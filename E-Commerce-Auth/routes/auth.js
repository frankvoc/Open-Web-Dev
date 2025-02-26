const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');

const router = express.Router();

//register route
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = new User({ username, email, password });
    await user.save();
    res.redirect('/auth/login');
  } catch (error) {
    res.render('error', { message: 'Registration failed. Please check your inputs.' });
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
    if (user && await user.matchPassword(password)) {
      const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/dashboard');
    } else {
      res.render('error', { message: 'Invalid credentials.' });
    }
  } catch (error) {
    res.render('error', { message: 'Login failed. Please try again.' });
  }
});

// Dashboard Route
router.get('/dashboard', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.render('dashboard');
});

// Logout Route
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/auth/login');
});

module.exports = router;
