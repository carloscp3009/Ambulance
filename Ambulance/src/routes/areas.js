const express = require('express');
const router = express.Router();

const Areas = require('../database');
const { isLoggedIn } = require('../lib/auth');

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
  await Areas.query('INSERT INTO areas set ?', [newArea]);
  req.flash('success', 'Area saved successfully');
  res.redirect('/areas');
});

router.get('/', isLoggedIn, async (req, res) => {
  const areas = await Areas.query('SELECT * FROM areas WHERE id_hospital = ?', [
    req.user.idhospital
  ]);
  res.render('areas/list', { areas });
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await Areas.query('DELETE FROM areas WHERE id = ?', [id]);
  req.flash('success', 'Area successfully removed');
  res.redirect('/areas');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const area = await Areas.query('SELECT * FROM areas WHERE id = ?', [id]);
  res.render('areas/edit', { area: area[0] });
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { name, beds } = req.body;
  const newArea = {
    name
  };
  await Areas.query('UPDATE areas set ? WHERE id = ?', [newArea, id]);
  req.flash('success', 'Area updated successfully');
  res.redirect('/areas');
});

module.exports = router;
