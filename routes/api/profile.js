const express = require('express');
const auth = require('../../middleware/auth');
const route = express.Router();
const Profile = require('../../module/profileSchema');
const User = require('../../module/UserSchema');
const { check, validationResult, Result } = require('express-validator');
const mongoose = require('mongoose');
const UserSchema = require('../../module/UserSchema');

//getting specific user profile
route.get('/me', auth, async (req, res) => {
    try {
        const result = await Profile.findOne({ user: req.user.id }).populate({ path: 'user' }).exec();
        if (!result) return res.status(400).send({ msg: 'there is no profile for this user' });
        return res.send(result);
    } catch (err) {
        console.log(err.message);
        res.send(500).json({ msg: 'server error' });
    }
})

//creating profile for setting the value
route.post('/', auth,
    [check('skills', 'skill is required').not().isEmpty()], async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
        const {
            company,
            website,
            location,
            status,
            skills,
            bio,
            githubusername,
            social,
            education }
            = req.body;

        const prof_body = new Profile({
            company: company,
            website: website,
            location: location,
            status: status,
            skills: skills,
            bio: bio,
            githubusername: githubusername,
            social: social,
            education: education
        })
        if (skills) {
            prof_body.skills = skills.split(',').map(skills => skills.trim());
        }
        console.log(req.user.id);
        const profiles = await Profile.findOne({ user: req.user.id });
        if (profiles) {
            const update = await Profile.findOneAndUpdate({ user: req.user.id }, {
                company: company,
                website: website,
                location: location,
                status: status,
                skills: skills,
                bio: bio,
                githubusername: githubusername,
                social: social,
                education: education
            });
            res.status(200).send({ msg: "updated" })
        } else {
            prof_body.user = req.user.id;
            prof_body.save();
            res.status(200).send({ msg: 'Profile Saved!' })
        }
    })

//delete by users
route.delete('/user', auth, async (req, res) => {
    try {
        const result = await User.findOneAndRemove({ _id: req.user.id });
        const result1 = await Profile.findOneAndRemove({ user: req.user.id });
        if (!result) return res.status(400).send({ msg: 'there is no user' });
        return res.send({ msg: 'User Deleted Successfully' });
    } catch (err) {
        if (err.kind == 'ObjectId') {
            return res.status(201).send({ msg: 'There is no User' })
        }
        return res.send(500).json({ msg: 'server error' });
    }
})

//deleting the specific profile
route.delete('/me', auth, async (req, res) => {
    try {
        const result = await Profile.findOneAndDelete({ user: req.user.id });
        if (!result) return res.status(400).send({ msg: 'there is no profile for this user' });
        return res.send({ msg: 'Profile Deleted Successfuuly' });
    } catch (err) {
        console.log(err.message);
        res.send(500).json({ msg: 'server error' });
    }
})

//getting all the profile
route.get('/', auth, async (req, res) => {
    try {
        const result = await Profile.find().select('').populate('user', ['name', 'avatar'])
        if (!result) return res.status(404).send({ msg: 'No Found' });
        return res.send(result);
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: "server errror" })
    }
})

//adding profiles experience
route.post('/experience', auth, [check('title', 'title is required').not().isEmpty()], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(404).send({ errors: errors });
        const { title, company, location, from, to, current, description } = req.body;

        const updates = [{
            title: title, company: company, location: location, from: from, to: to, current: current, description: description
        }];

        const users = await Profile.findOne({ user: req.user.id });
        if (!users) return res.status(404).send({ msg: 'No Profile found for this user' });
        console.log(users);
        users.experience = updates;
        users.save();
        return res.status(200).send({ msg: 'Updated Successfully' });
        // const result = await Profile.findOneAndUpdate({ user: req.user.id }, updates)
        // console.log(result);
    } catch (err) {
        console.log(err);
        return res.status(500).send('server error');
    }
})

//deleting the experience
route.delete('/experiences/:id', auth, async (req, res) => {
    try {
        const profiles = await Profile.findOne({ user: req.user.id });
        if (!profiles) return res.status(400).send({ msg: 'No profile for this user' });
        const remove = profiles.experience
            .map(item => item.id)
            .indexOf(req.params.id);
        if (remove === -1) return res.send({ msg: 'No Experience for this user' });
        profiles.experience.slice(remove, 1);
        profiles.save();
        res.send({ msg: 'experience removed' })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ msg: 'Server Error' })
    }
})

//delete profile by id
route.delete('/:userid', auth, async (req, res) => {
    try {
        const result = await Profile.findByIdAndDelete({ _id: req.params.userid });
        if (!result) return res.status(400).send({ msg: 'there is no profile for this user' });
        return res.send({ msg: 'Profile Deleted Successfully' });
    } catch (err) {
        if (err.kind == 'ObjectId') {
            return res.status(201).send({ msg: 'There is no profile' })
        }
        return res.send(500).json({ msg: 'server error' });
    }
})
module.exports = route;