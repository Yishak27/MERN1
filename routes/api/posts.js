const express = require('express')
const route = express.Router();

route.get('/', (req, res)=>{
    console.log("posts route");
})

module.exports = route;