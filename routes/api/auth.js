const express = require('express')
const route = express.Router();
const auth = require('../../middleware/auth');
const user = require('../../module/UserSchema');

route.get('/', auth, async (req, res) => {

    const users = await user.findById(req.user.id).select("-password");
    res.json(users);
})
route.post('/autho', (req, res) => {
    console.log('authos post');
})
module.exports = route;