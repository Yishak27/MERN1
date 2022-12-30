const express = require('express')
const route = express.Router();

route.get('/', (req, res)=>{
    console.log("auth route");
})
route.post('/autho', (req, res)=>{
    console.log('authos post');
})
module.exports = route;