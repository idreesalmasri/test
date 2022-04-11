'use strict'
const {Sequelize, DataTypes} = require('sequelize');
require('dotenv').config();
const users=require('./userModel.js');
const POSTGRES_URI = process.env.NODE_ENV === 'test' ? 'sqlite:memory:' : process.env.DATABASE_URL ;


let sequelizeOptions = process.env.NODE_ENV === 'production' ? {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      }
    }
  }:{};
  let sequelize = new Sequelize(POSTGRES_URI,sequelizeOptions);
  module.exports = {
    db: sequelize, //for real connection and will use it in index.js
    users: users(sequelize,DataTypes),// for creating the table and will use it in our routes
     
}