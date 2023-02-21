const express = require('express')
const route = express.Router();
const Profile = require('../../module/profileSchema');

route.get('/', async (req, res)=>{
    const result = await Profile.find();
    res.send(result);
})

module.exports = route;