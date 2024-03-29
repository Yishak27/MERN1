const express = require('express');
const route = express.Router();
const auth = require('../../middleware/auth');
const user = require('../../module/UserSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

route.get('/', auth, async (req, res) => {
  try {
    const users = await user.findById(req.user.id).select('-password');
    return res.json(users);
  } catch (err) {
    return res.send('Unable to get the user data');
  }
});

route.post(
  '/',
  [
    check('email', 'Email is required').not().isEmpty(),
    check('email', 'Invalid Email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res, next) => {
    //check validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.send({ errors: [{ msg: 'Invalid Credential' }] });
      }
      //check the password validation
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.send({ errors: [{ msg: 'Invalid Credential' }] });
      }
      return res.json(user.token);
    } catch (err) {
      console.log(err);
      return res.status(500).send('Server Error');
    }
  }
);

module.exports = route;
