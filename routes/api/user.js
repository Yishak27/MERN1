const express = require('express')
const route = express.Router();
const User = require('../../module/UserSchema');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
               return  res.send({ errors: [{ msg: 'User Already exit' }] });
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

            //encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            const payload = {
                user: { id: user.id }
            }
            const token = await jwt.sign(payload, process.env.JWT_TOKEN)
            //     , {
            //     expiresIn: process.env.EXP_TIME
            // })
            //save to db
            user.token = token;
            user.save();
            res.send(user);
        } catch (err) {
            console.log(err);
            res.status(500).send("Server Error");
        };
    })

route.get('/', async (req, res) => {
    let user = await User.find().select('-password');
    res.send(user);
})

module.exports = route;