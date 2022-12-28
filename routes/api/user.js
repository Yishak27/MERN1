const express = require('express')
const route = express.Router();
const { check, validationResult } = require('express-validator');
route.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('Email', "Email is required").not().isEmpty(),
    check('Email', 'Invalid Email').isEmail(),
    check('password', 'minimum lenght is 6').isLength({min: 6})
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } else {
        res.send(req.body);
    }
})
route.get('/', (req, res) => {
    console.log("user route");
})

module.exports = route;