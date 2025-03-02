const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const bcrypt = require('bcryptjs');
const router = express.Router();
//user register route
router.get('/register', (req, res) => {
  res.render('register');
});
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    //hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    //check if the email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.render('error', { message: 'Email already in use. Please choose a different one.' });
    }
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    return res.redirect('/auth/login');
  } catch (error) {
    return res.render('error', { message: 'Registration failed. Please check your inputs.' });
  }
});
//login route
router.get('/login', (req, res) => {
  res.render('login');
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch);
      if (isMatch) {
        const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        return res.redirect('/dashboard');
      }
    }
    return res.render('error', { message: 'Invalid credentials.' });
  } catch (error) {
    console.error('Login error:', error);
    return res.render('error', { message: 'Login failed. Please try again.' });
  }
});
//dashboard route
router.get('/dashboard', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.render('dashboard');
});
//logout route
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/auth/login');
});

module.exports = router;
