const express = require('express')
const route = express.Router();
const User = require('../../module/UserSchema');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');


route.post('/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', "Email is required").not().isEmpty(),
        check('email', 'Invalid Email').isEmail(),
        check('password', 'minimum lenght is 6').isLength({ min: 6 })
    ],
    async (req, res, next) => {
        //check validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (user) {
                res.send({ errors: [{ msg: 'User Already exit' }] });
            }
            //getting avatar of the user
            const avatar = gravatar.url(email, {
                s: '200',
                d: 'mm',
                r: 'pg'
            });
            user = new User({
                name,
                email,
                password,
                avatar,
            });

            //encript password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            console.log(user.password);
            console.log(user);
            //save to db
            user.save();
            res.send("User Registed");
            next();
        } catch (err) {
            console.log(err);
            res.status(500).send("Server Error");
        };
    })

route.get('/', async (req, res) => {
    let user = await User.find()
    res.send(user);
})

module.exports = route;