const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');

// SIGNUP
router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post(
  '/signup',
  passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  })
);

// SINGIN
router.get('/signin', (req, res) => {
  res.render('auth/signin');
});

router.post(
  '/signin',
  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  })
);

// LogOut
router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/signin');
});

//Profile
router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

module.exports = router;
