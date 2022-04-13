const express = require('express');
// var fs= require("fs");
const app = express()
app.use(express.static('./'));
app.use(express.static(__dirname + '/views'));
const bcrypt = require('bcrypt')
const { users } = require('./models/index.js');
const authentication = require('./middlewares/baicAuth.js');
const bearerAuth = require('./middlewares/bearerAuth');

// app.use(express.static(path.join(__dirname, 'public')));

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get("/" ,(req, res) => {
    // res.writeHead(200,{"Content-Type":"text/html"});
    // fs.readFile("./index.html",null,function(error,data){
    //     if(error){
    //         res.writeHead(404);
    //         res.writeHead("not found")
    //     }else{
    //         res.write(data);
    //     }
    //     res.end();
    // })
    // res.render('index.ejs');
    res.render('index.html');
    // res.setHeader('Content-Type', 'text/html');
    // fs.createReadStream("index.html").pipe(res);

    // res.sendFile(__dirname + "/index.html");
})
app.get("/login", (req, res) => {
    res.render('login.ejs');
})

app.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password,5);
        console.log(hashedPassword);
        const newUser = await users.create({
            username: req.body.name,
            email:req.body.email,
            password: hashedPassword
        })
        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
    // res.render('register.ejs');
})
app.post('/login',authentication,(req,res)=>{
    
    res.sendFile(__dirname + "/index.html");
    
})
app.get("/register", (req, res) => {
    res.render('register.ejs');
})

app.get("/support",bearerAuth,async (req, res) => {
    res.sendFile(__dirname + "/chat.html");
})
function start(port) {
    app.listen(port,()=>{
        console.log(`running on port ${port}`)
    })
}
module.exports = {
    app: app,
    start: start
}
