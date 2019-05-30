const express = require('express');
const router = express.Router();

const passport = require('passport');
const poolEps = require('../databaseEps');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

// SIGNUP
router.get('/signup', isNotLoggedIn, async (req, res) => {
  const eps = await poolEps.query('SELECT * FROM eps');
  res.render('auth/signup', { eps });
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
router.get('/signin', isNotLoggedIn, (req, res) => {
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
