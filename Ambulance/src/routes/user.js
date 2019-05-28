const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

// User

router.get('/', isLoggedIn, async (req, res) => {
  let usersIn = await pool.query(
    'SELECT U.*, A.name AS area, B.location FROM user AS U, areas AS A, beds AS B, hospital AS H WHERE H.idhospital = ? AND U.status = "in" AND U.bed = B.id AND B.id_area = A.id AND A.id_hospital = H.idhospital ORDER BY U.name',
    [req.user.idhospital]
  );
  res.render('user/list', { usersIn });
});

//Register a user

router.get('/add', isLoggedIn, async (req, res) => {
  let areas = await pool.query('SELECT * FROM areas WHERE id_hospital = ?', [
    req.user.idhospital
  ]);
  res.render('user/add', { areas });
});

// Post

router.post('/add', isLoggedIn, async (req, res) => {
  const areaName = req.body.area;
  let area = await pool.query(
    'SELECT a.id FROM areas AS a WHERE a.name = ? AND a.id_hospital = ?',
    [areaName, req.user.idhospital]
  );
  area = JSON.parse(JSON.stringify(area))[0].id;
  const beds = await pool.query(
    'SELECT * FROM beds WHERE id_area = ? AND status = "Free" LIMIT 1',
    [area]
  );
  if (beds.length == 1) {
    const bed = JSON.parse(JSON.stringify(beds))[0];

    let date_in = new Date(Date.now());
    date_in = date_in.toString().split('GMT')[0];

    const { cedula, name, eps, date_out } = req.body;
    const newUser = {
      cedula,
      name,
      eps,
      date_in,
      date_out,
      bed: bed.id,
      status: 'in'
    };
    console.log(newUser);
    await pool.query('UPDATE beds set ? WHERE id = ?', [
      { status: 'Busy' },
      bed.id
    ]);
    await pool.query('INSERT INTO user set ?', [newUser]);
    req.flash(
      'success',
      `${areaName} Bed ${bed.id} in room ${bed.location} assigned`
    );
    res.redirect('/user');
  } else {
    req.flash('message', `No beds available for ${areaName} area`);
    res.redirect('/areas');
  }
});

// dar de alta

router.get('/release/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  // release Bed
  let bed = await pool.query('SELECT bed FROM user WHERE id = ?', [id]);
  bed = JSON.parse(JSON.stringify(bed))[0].bed;
  await pool.query('UPDATE beds set ? WHERE id = ?', [{ status: 'Free' }, bed]);

  // release Patient
  let date_out = new Date(Date.now());
  date_out = date_out.toString().split('GMT')[0];

  const newUser = {
    date_out,
    status: 'out'
  };

  await pool.query('UPDATE user set ? WHERE id = ?', [newUser, id]);
  res.redirect('/user');
});

// Module
module.exports = router;
