const express = require('express');
const router = express.Router();

const pool = require('../database');
const poolEPS = require('../databaseEps');

router.get('/ambulance', (req, res) => {
  res.render('ambulance/report');
});
router.post('/ambulance', (req, res) => {
  res.redirect('ambulance/route');
});
// response
router.get('/ambulance/route', (req, res) => {
  res.render('ambulance/map');
});
router.get('/ambulance/coords', (req, res) => {
  res.render('ambulance/coords');
});
router.get('/test', async (req, res) => {
  const hospitals = await poolEPS.query('SELECT * FROM hospitals');
  res.send(hospitals);
});

// Modules Exports
module.exports = router;
