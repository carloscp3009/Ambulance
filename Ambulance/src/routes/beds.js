const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

// Details ==
router.get('/:id', isLoggedIn, async (req, res) => {
  const id_area = req.params.id;
  const beds = await pool.query('SELECT * FROM beds WHERE id_area = ?', [
    id_area
  ]);
  res.render('beds/details', { beds, id_area });
});
// add beds - - - - - - - - - - - - - - - - - - - - - - - - - -
router.get('/add/:id', isLoggedIn, (req, res) => {
  const id_area = req.params.id;
  res.render('beds/add', { id_area });
});

router.post('/add/:id', isLoggedIn, async (req, res) => {
  const { location, status } = req.body;
  const id_area = req.params.id;
  const newBed = {
    id: null,
    id_area,
    location,
    status
  };
  await pool.query('INSERT INTO beds set ?', [newBed]);
  req.flash('success', 'Bed saved successfully');
  res.redirect('/areas');
});
// edit beds - - - - - - - - - - - - - - - - - - - - - - - - - -
router.get('/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const bed = await pool.query('SELECT * FROM beds WHERE id = ?', [id]);
  res.render('beds/edit', { bed: bed[0] });
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { location, status } = req.body;
  const newBed = {
    location,
    status
  };
  await pool.query('UPDATE beds set ? WHERE id = ?', [newBed, id]);
  let id_area = await pool.query('SELECT id_area FROM beds WHERE id = ?', [id]);
  id_area = JSON.parse(JSON.stringify(id_area))[0].id_area;
  req.flash('success', ' Bed updated successfully');
  res.redirect('/areas/beds/' + id_area);
});

//export module
module.exports = router;
