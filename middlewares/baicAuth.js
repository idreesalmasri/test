'use strict';


var express = require('express') 
var cookieParser = require('cookie-parser')
var app = express() 

app.use(cookieParser())
const bcrypt = require('bcrypt');
require('dotenv').config();
var jwt = require('jsonwebtoken');
const { users } = require('../models/index');
const SECRET = process.env.SECRET || "test";
const authentication = async (req, res, next) => {
try{
    if (req.body) {

        const user = await users.findOne({ where: { email: req.body.email } });
        // console.log("uuuuu", user);
        const valid = await bcrypt.compare(req.body.password, user.password);
        // console.log("vvvvvvv", valid);
        if (valid) {

            req.user = user;
            let newToken = jwt.sign({username:user.username},SECRET,{expiresIn : 900000});
            // console.log("-----------------",newToken)
            res.cookie("jwt",newToken,{
                httpOnly:true
            });
        
        
            user.token=newToken;
            // req.token = userToken;
            // req.body.token=newToken;
            
            // console.log("===================",user.token)
            next();
        } else {
            // return next(null, false, { message: 'Password incorrect' })
            res.status(403).send('invalid login Password')
            next(`input is invalid`);
        }
    }
}catch{
    res.status(403).send('invalid login Username')
}
}

module.exports = authentication;