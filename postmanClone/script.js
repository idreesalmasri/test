'use strict'
import  "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"

//hook up and make these requests(add,delete,update ...) using axios
import axios from "axios"
import prettyBytes from "pretty-bytes"//this is for size to convert it to bytes
import setupEditors from "./editor" //this is fir the JSON section 

//---------------------------------------------------
//now we want to connect the html elements with the js file using querySelector==>Get the first element with class="example":
const form = document.querySelector("[data-form]")//where we add the url and sending it 
const queryParamsContainer = document.querySelector("[data-query-params]")//div
const requestHeadersContainer = document.querySelector("[data-request-headers]")//div
const keyValueTemplate = document.querySelector("[data-key-value-template]")//template
const responseHeadersContainer = document.querySelector("[data-response-headers]")//div

//---------------------------------------------------
// we want to make the add btn works and for each click we will create key value 
document.querySelector("[data-add-query-param-btn]").addEventListener("click", () => {
    // inserts a set of Node objects or DOMString objects after the last child of the Element. DOMString objects are inserted as equivalent Text nodes.
    queryParamsContainer.append(createKeyValuePair())
  })

document
  .querySelector("[data-add-request-header-btn]")
  .addEventListener("click", () => {
    // inserts a set of Node objects or DOMString objects after the last child of the Element. DOMString objects are inserted as equivalent Text nodes.
    requestHeadersContainer.append(createKeyValuePair())
  })
//--------------------------------------------------------
// inserts a set of Node objects or DOMString objects after the last child of the Element. DOMString objects are inserted as equivalent Text nodes.
queryParamsContainer.append(createKeyValuePair())
requestHeadersContainer.append(createKeyValuePair())
//----------------------------------------------------------------
//whenever we have request we will  intercept this req by using this function 
axios.interceptors.request.use(request => {
  request.customData = request.customData || {}
  request.customData.startTime = new Date().getTime()
  return request
})

function updateEndTime(response) {
  response.customData = response.customData || {}
  response.customData.time =
    new Date().getTime() - response.config.customData.startTime
  return response
}

axios.interceptors.response.use(updateEndTime, e => {
  return Promise.reject(updateEndTime(e.response))
})

const { requestEditor, updateResponseEditor } = setupEditors()//this is to get the argument that we send it from the set up editers file 
//==--==--==--==--*********************==--==--==--==--==--
//this is the event for the send btn 
form.addEventListener("submit", e => {
  e.preventDefault()// tells the user agent that if the event does not get explicitly handled, its default action should not be taken as it normally would be.

  let data
  try {
    data = JSON.parse(requestEditor.state.doc.toString() || null)//take the jsaon from the document and convert it to an object 
  } catch (e) {
    alert("JSON data is malformed")
    return
  }

  axios({
    url: document.querySelector("[data-url]").value,
    method: document.querySelector("[data-method]").value,
    params: keyValuePairsToObjects(queryParamsContainer)//this is because axios pass only objects that contain  key and value pairs 
    ,
    headers: keyValuePairsToObjects(requestHeadersContainer)//this is because axios pass only objects that contain  key and value pairs 
    ,
    data,
  }).catch(e => e).then(response => {//.catch(e => e) this line is for wrong request for example if we enter 1 we will get 200 in the status but if we enter -1 wewill get nothing 
      document.querySelector("[data-response-section]").classList.remove("d-none")
      updateResponseDetails(response)
      updateResponseEditor(response.data)//this is for Json that we recieve it from setupEditer in line 53 
      updateResponseHeaders(response.headers)
      console.log(response)
    })
})
//-------------------------------------------------------------
//this is for set the time and size and status
function updateResponseDetails(response) {
  document.querySelector("[data-status]").textContent = response.status
  document.querySelector("[data-time]").textContent = response.customData.time

  //prettyBytes ==> this is for size to convert it to bytes
  document.querySelector("[data-size]").textContent = prettyBytes(
    JSON.stringify(response.data).length +
      JSON.stringify(response.headers).length
  )
}

function updateResponseHeaders(headers) {
  responseHeadersContainer.innerHTML = ""

  //  Object.entries ==> returns an array of a given object's own enumerable string-keyed property [key, value] pairs. 
  Object.entries(headers).forEach(([key, value]) => {
    const keyElement = document.createElement("div")
    keyElement.textContent = key
    responseHeadersContainer.append(keyElement)
    const valueElement = document.createElement("div")
    valueElement.textContent = value
    responseHeadersContainer.append(valueElement)
  })
}

//---------------------------------------------------
//create key value 
function createKeyValuePair() {
  //inside the html file wa create templete to create key + value +delete btn 

  //Cloning a node copies all of its attributes and their values, including intrinsic (inline) listeners. &&  controls if the subtree contained in a node is also cloned or not.
  const element = keyValueTemplate.content.cloneNode(true)
  element.querySelector("[data-remove-btn]").addEventListener("click", e => {
    // traverses the Element and its parents (heading toward the document root) until it finds a node that matches the provided selector string. Will return itself or the matching ancestor. If no such element exists, it returns null.
    e.target.closest("[data-key-value-pair]").remove()
  })
  return element
}

function keyValuePairsToObjects(container) {
  const pairs = container.querySelectorAll("[data-key-value-pair]")// that exists inside the template

  //the pairs are  (node list) so we want to convert theme to an array using  (...)
  //and then take data objects and each one of the pairs using reduce
  return [...pairs].reduce((data, pair) => {
    const key = pair.querySelector("[data-key]").value
    const value = pair.querySelector("[data-value]").value

    if (key === "") return data //if object is empty 

    //The spread syntax is commonly used to make shallow copies of JS objects. Using this operator makes the code concise and enhances its readability.
    //spread the data out and  the add key +value for the data on top 
    return { ...data, [key]: value }
  }, {})
}