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
  res.render('areas/beds/add');
});

router.post('/add/:id', isLoggedIn, async (req, res) => {
  const { name, beds } = req.body;
  const newArea = {
    id: null,
    name,
    id_hospital: req.user.idhospital
  };
  await pool.query('INSERT INTO areas set ?', [newArea]);
  req.flash('success', 'Area saved successfully');
  res.redirect('/areas');
});

//export module
module.exports = router;
