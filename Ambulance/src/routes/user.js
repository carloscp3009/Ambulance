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
  const areaName = req.body.area;
  let area = await pool.query(
    'SELECT a.id FROM Hospital.areas AS a WHERE a.name = ? AND a.id_hospital = ?',
    [areaName, req.user.idhospital]
  );
  area = JSON.parse(JSON.stringify(area))[0].id;
  const beds = await pool.query(
    'SELECT * FROM beds WHERE id_area = ? AND status = "Free"',
    [area]
  );

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
  res.render('user/list');
});
// Module
module.exports = router;
