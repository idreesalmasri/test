'use strict';

require('dotenv').config();
const {db}=require('./models/index.js');
const server = require('./server.js');

db.sync().then(()=>{
    server.start(process.env.PORT || 3001);
})