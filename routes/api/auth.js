const express = require('express')
const route = express.Router();

route.get('/', (req, res)=>{
    console.log("auth route");
})

module.exports = route;