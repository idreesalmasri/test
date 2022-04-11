const express = require('express');

const app = express()
const bcrypt = require('bcrypt')
const { users } = require('./models/index.js');
const authentication = require('./middlewares/baicAuth.js');
const bearerAuth = require('./middlewares/bearerAuth');



app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.get("/" ,(req, res) => {
    res.render('index.ejs');
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
    res.render('index.ejs');
})
app.get("/register", (req, res) => {
    res.render('register.ejs');
})

app.get("/secret",bearerAuth,async (req, res) => {
    res.status(200).json(req.user);
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
// app.listen(3000);