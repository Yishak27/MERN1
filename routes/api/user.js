const express = require('express')
const route = express.Router();

route.post('/', (req, res) => {
    res.send(req.body);
})
route.get('/', (req, res) => {
    console.log("user route");
})

module.exports = route;