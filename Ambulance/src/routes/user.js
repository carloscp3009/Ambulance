const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

// Root
router.get('/', isLoggedIn, (req, res) => {
  res.render('user/list');
});

//Register a user

router.get('/add', isLoggedIn, async (req, res) => {
  let areas = await pool.query('SELECT * FROM areas WHERE id_hospital = ?', [
    req.user.idhospital
  ]);
  res.render('user/add', { areas });
});
router.post('/add', isLoggedIn, async (req, res) => {
  let date_in = new Date(Date.now());
  date_in = date_in.toString().split('GMT')[0];

  const { cedula, name, eps, date_out } = req.body;
  const newUser = {
    cedula,
    name,
    eps,
    date_in,
    date_out
  };
  console.log(newUser);
  //areas = JSON.parse(JSON.stringify(areas));
  res.render('user/list');
});
// Module
module.exports = router;
