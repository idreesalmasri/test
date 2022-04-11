'use strict';

require('dotenv').config();
var express = require('express')
var cookieParser = require('cookie-parser')
var app = express()
app.use(cookieParser())
const SECRET = process.env.SECRET||"test";
const jwt = require('jsonwebtoken');

const { users } = require('../models/index');
require("./baicAuth");
const bearerAuth = async (req, res, next) => {

    if (req.headers.cookie) {
        const tokenInCookie = req.headers.cookie;
    // console.log("ffffffffffff", tokenInCookie);
    let keyValueSplit=tokenInCookie.split('=');
    let token=keyValueSplit.pop()
        try {


            if (token) {
                // console.log("hkhvhvh------------");
                const userToken = jwt.verify(token, SECRET);
                // console.log("[[[[[[[[[[[[[[[",userToken);
                const user = await users.findOne({ where: { username: userToken.username } });
                // console.log("ggggggggggggggg",user)
                if (user) {
                    req.user = user;
                    req.token = userToken;

                    next();
                } else {
                    res.status(403).send('invalid user')
                }
            }
        } catch (error) {
            res.status(403).send('invalid Token');
        }
    } else {
        res.redirect('/register');
        // res.status(403).send('Empty Token')
    }
}
module.exports = bearerAuth;