const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

// Root

router.get('/', isLoggedIn, async (req, res) => {
  const areas = await pool.query('SELECT * FROM areas WHERE id_hospital = ?', [
    req.user.idhospital
  ]);
  beds = await pool.query(
    'SELECT COUNT(B.id) AS beds FROM Hospital.beds AS B WHERE B.id_area IN (SELECT A.id FROM Hospital.areas AS A WHERE A.id_hospital = ?) GROUP BY B.id_area;',
    [req.user.idhospital]
  );
  // Counting beds
  // let areax = JSON.parse(JSON.stringify(areas));
  // const bedx = JSON.parse(JSON.stringify(beds));
  // if (bedx.length > 0) {
  //   for (let i = 0; i < areax.length; i++) {
  //     areax[i].bed = bedx[i].beds;
  //   }
  // }
  res.render('areas/list', { areas });
});

// Add area  - - - - - - - - - - - - - - - - - - - - - - - - - - -

router.get('/add', isLoggedIn, (req, res) => {
  res.render('areas/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
  const { name, beds } = req.body;
  const newArea = {
    id: null,
    name,
    id_hospital: req.user.idhospital
  };
  const result = await pool.query('INSERT INTO areas set ?', [newArea]);
  const id_area = result.insertId;
  req.flash('success', 'Area saved successfully');
  res.redirect('/areas/beds/add/' + id_area);
});

// Delete area - - - - - - - - - - - - - - - - - - - - - - - - - - -

router.get('/delete/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM areas WHERE id = ?', [id]);
  req.flash('success', 'Area successfully removed');
  res.redirect('/areas');
});

// Edit Area - - - - - - - - - - - - - - - - - - - - - - - - - - -

router.get('/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const area = await pool.query('SELECT * FROM areas WHERE id = ?', [id]);
  res.render('areas/edit', { area: area[0] });
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { name, beds } = req.body;
  const newArea = {
    name
  };
  await pool.query('UPDATE areas set ? WHERE id = ?', [newArea, id]);
  req.flash('success', 'Area updated successfully');
  res.redirect('/areas');
});

// //export module
module.exports = router;
