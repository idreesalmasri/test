// 'use strict';

// // const server = require('../server.js');
// // var express = require('express') 
// // var app = express()
// require('dotenv').config();
// // var cookieParser = require('cookie-parser')
// // app.use(cookieParser())
// const SECRET = process.env.SECRET;
// const jwt = require('jsonwebtoken');
// const { user } = require('pg/lib/defaults');
// const {users} = require('../models/index');
// require("./baicAuth");
// const bearerAuth = async (req, res, next) => {
//     var token = req.cookies.auth;
//     if (token) {
//         try {
            
    
//             if (token) {
//                 const userToken = jwt.verify(token, SECRET);
    
//                 const user = await users.findOne({ where: { username: userToken.username } });
//                 console.log(userToken);
//                 if (user) {
//                     // req.token = userToken;
//                     // req.user = user;
//                     next();
//                 } else {
//                     res.status(403).send('invalid user')
//                 }
//             }
//         } catch (error) {
//             res.status(403).send('invalid Token');
//         }
//     } else {
//         res.status(403).send('Empty Token')
//     }
//     }
//     module.exports = bearerAuth;