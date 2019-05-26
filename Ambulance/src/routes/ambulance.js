const express = require('express');
const router = express.Router();

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
// Modules Exports
module.exports = router;
