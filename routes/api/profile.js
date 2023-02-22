const express = require('express');
const auth = require('../../middleware/auth');
const route = express.Router();
const Profile = require('../../module/profileSchema');
const User = require('../../module/UserSchema');
const { check, validationResult } = require('express-validator');

route.get('/', async (req, res) => {
    const result = await Profile.find();
    res.send(result);
})

route.get('/me', auth, async (req, res) => {
    try {
        const result = await Profile.findOne({ user: req.user.id }).populate('users', ['name', 'avatar']);
        if (!result) return res.status(400).send({ msg: 'there is no profile for this user' });
        res.json(result);
    } catch (err) {
        console.log(err.message);
        res.send(500).json({ msg: 'server error' });
    }
})

route.post('/', auth,
    [check('status', 'status is required').not().isEmpty(),
    check('skills', 'skill is required').not().isEmpty()],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

        const { company,
            website,
            location,
            status,
            skills,
            bio,
            githubusername,
            youtube,
            twitter,
            facebook,
            linkedin,
            instagram } = req.body;

        const profileField = {};
        profileField.user = req.user.id;
        console.log(skills);
        if (skills) {
            profileField.skills = skills.split(',').map(skills => skills.trim());
            console.log(skills);
            res.send(skills);
        }
    })
module.exports = route;