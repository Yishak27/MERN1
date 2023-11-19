const express = require('express');
const auth = require('../../middleware/auth');
const route = express.Router();
const Profile = require('../../module/profileSchema');
const User = require('../../module/UserSchema');
const { check, validationResult, Result } = require('express-validator');
const mongoose = require('mongoose');
const UserSchema = require('../../module/UserSchema');
const request = require('request');

//getting specific user profile
route.get('/me', auth, async (req, res) => {
  try {
    const result = await Profile.findOne({ user: req.user.id }).populate({
      path: 'user',
    });
    if (!result)
      return res.status(400).send({ msg: 'there is no profile for this user' });
    return res.send(result);
  } catch (err) {
    console.log(err.message);
    return res.send(500).json({ msg: 'server error' });
  }
});

//creating profile for setting the value
route.post(
  '/',
  auth,
  [check('skills', 'skill is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      social,
      education,
    } = req.body;

    const prof_body = new Profile({
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      social,
      education,
    });

    if (skills) {
      prof_body.skills = skills.split(',').map((skills) => skills.trim());
    }

    const profiles = await Profile.findOne({ user: req.user.id });
    if (profiles) {
      const update = await Profile.findOneAndUpdate(
        { user: req.user.id },
        {
          company: company,
          website: website,
          location: location,
          status: status,
          skills: skills,
          bio: bio,
          githubusername: githubusername,
          social: social,
          education: education,
        }
      );

      return res.status(200).send({ msg: 'updated' });
    } else {
      prof_body.user = req.user.id;
      prof_body.save();
      return res.status(200).send({ msg: 'Profile Saved!', prof_body });
    }
  }
);

//delete by users
route.delete('/user', auth, async (req, res) => {
  try {
    const result = await User.findOneAndRemove({ _id: req.user.id });
    const result1 = await Profile.findOneAndRemove({ user: req.user.id });
    if (!result) return res.status(400).send({ msg: 'there is no user' });
    return res.send({ msg: 'User Deleted Successfully' });
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(201).send({ msg: 'There is no User' });
    }
    return res.send(500).json({ msg: 'server error' });
  }
});

//deleting the specific profile
route.delete('/me', auth, async (req, res) => {
  try {
    const result = await Profile.findOneAndDelete({ user: req.user.id });
    if (!result)
      return res.status(400).send({ msg: 'there is no profile for this user' });
    return res.send({ msg: 'Profile Deleted Successfuuly' });
  } catch (err) {
    console.log(err.message);
    res.send(500).json({ msg: 'server error' });
  }
});

//getting all the profile
route.get('/', auth, async (req, res) => {
  try {
    const result = await Profile.find()
      .select('')
      .populate('user', ['name', 'avatar']);
    if (!result) return res.status(404).send({ msg: 'No Found' });
    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: 'server errror' });
  }
});

//adding profiles experience
route.post(
  '/experience',
  auth,
  [check('title', 'title is required').not().isEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(404).send({ errors: errors });
      const { title, company, location, from, to, current, description } =
        req.body;

      const updates = {
        title: title,
        company: company,
        location: location,
        from: from,
        to: to,
        current: current,
        description: description,
      };

      const users = await Profile.findOne({ user: req.user.id });
      if (!users)
        return res.status(404).send({ msg: 'No Profile found for this user' });

      users.experience.push(updates);
      await users.save();
      return res.status(200).send({ msg: 'Inserted' });
      // const result = await Profile.findOneAndUpdate({ user: req.user.id }, updates)
      // console.log(result);
    } catch (err) {
      console.log(err);
      return res.status(500).send('server error');
    }
  }
);

//deleting the experience
route.delete('/experiences/:id', auth, async (req, res) => {
  try {
    const profiles = await Profile.findOne({ user: req.user.id });
    if (!profiles)
      return res.status(400).send({ msg: 'No profile for this user' });
    const remove = profiles.experience
      .map((item) => item.id)
      .indexOf(req.params.id);
    if (remove === -1) return res.send({ msg: 'No Experience for this user' });
    profiles.experience.splice(remove, 1);
    profiles.save();
    return res.send({ msg: 'experience removed' });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: 'Server Error' });
  }
});

//adding Education profile
route.post(
  '/education',
  auth,
  [check('school', 'school is required').not().isEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(404).send({ errors: errors });
      const { school, degree, fieldofstudy, from, to, current, description } =
        req.body;

      const educations = {
        school: school,
        degree: degree,
        fieldofstudy: fieldofstudy,
        from: from,
        to: to,
        current: current,
        description: description,
      };

      const users = await Profile.findOne({ user: req.user.id });
      if (!users)
        return res.status(404).send({ msg: 'No Profile found for this user' });

      users.education.unshift(educations);
      await users.save();
      return res.status(200).send({ msg: 'Education Inserted' });
      // const result = await Profile.findOneAndUpdate({ user: req.user.id }, updates)
      // console.log(result);
    } catch (err) {
      console.log(err);
      return res.status(500).send('server error');
    }
  }
);

//deleting the Education
route.delete('/educations/:id', auth, async (req, res) => {
  try {
    let userinfo = await Profile.findOne({ user: req.user.id });
    if (!userinfo)
      return res.status(400).send({ msg: 'No profile for this user' });
    let data;
    const removeIndex = userinfo.education.map((item) => {
      if (item.id == req.params.id) {
        data = item;
        return item;
      }
    });
    console.log(data);
    if (userinfo.education.indexOf(data) != -1) {
      console.log('Reached here');
      await userinfo.education.splice(removeIndex, 1);
    }
    await userinfo.save();
    // console.log("Rewached here",removeIndex);
    // if (removeIndex === -1) return res.send({ msg: 'No Education for this user' });
    //  const use =  userinfo.education.slice(removeIndex,1);
    //  //console.log(use);
    // await userinfo.save();
    res.send({ msg: 'Education removed' });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ msg: 'Server Error' });
  }
});

//delete profile by id
route.delete('/:userid', auth, async (req, res) => {
  try {
    const result = await Profile.findByIdAndDelete({ _id: req.params.userid });
    if (!result)
      return res.status(400).send({ msg: 'there is no profile for this user' });
    return res.send({ msg: 'Profile Deleted Successfully' });
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(201).send({ msg: 'There is no profile' });
    }
    return res.send(500).json({ msg: 'server error' });
  }
});

route.get('/github/:username', (req, res) => {
  try {
    const option = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=create aces&cliend_id=${process.env.GIT_CLIENT_ID}&client_secret=${process.env.GIT_SECRET}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };
    request(option, (err, response, body) => {
      if (err) console.log({ err: err });
      if (response.statusCode !== 200) {
        return res.status(404).send({ msg: 'no profiles' });
      }
      res.status(200).send(body);
    });
  } catch (err) {
    return res.status(500).send({ msg: err });
  }
});
module.exports = route;
