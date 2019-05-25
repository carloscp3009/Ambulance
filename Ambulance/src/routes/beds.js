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
  res.render('areas/beds/details', { beds, id_area });
});
// add beds - - - - - - - - - - - - - - - - - - - - - - - - - -
router.get('/add/:id', isLoggedIn, (req, res) => {
  const id_area = req.params.id;
  res.render('areas/beds/add', { id_area });
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

//export module
module.exports = router;
