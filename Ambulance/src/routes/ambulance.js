const express = require('express');
const router = express.Router();

const pool = require('../database');
const poolEps = require('../databaseEps');

router.get('/ambulance', async (req, res) => {
  const areas = await pool.query('SELECT DISTINCT name FROM areas');
  //const eps = await poolEPS.query('SELECT * FROM eps');
  res.render('ambulance/report', { areas });
});

// Post hard

router.post('/ambulance', async (req, res) => {
  let { id, area, level } = req.body;
  // Get User
  let user = await poolEps.query('SELECT * FROM users WHERE id = ?', [id]);
  user = JSON.parse(JSON.stringify(user))[0];

  // Get possibles Hospitals Name
  var hospitalsName = await poolEps.query(
    'SELECT DISTINCT name FROM hospitals WHERE id_eps = ?',
    [user.id_eps]
  );
  hospitalsName = JSON.parse(JSON.stringify(hospitalsName));
  var hnames = [];

  for (let i = 0; i < hospitalsName.length; i++) {
    hnames[i] = hospitalsName[i].name;
  }

  // Get possibles hospital id Because EPS & Area
  let hospitals = await pool.query(
    'SELECT H.idhospital, A.id FROM Hospital.hospital AS H, areas AS A WHERE H.hname in (?) AND A.name = ? AND A.id_hospital = H.idhospital',
    [hnames, area]
  );
  hospitals = JSON.parse(JSON.stringify(hospitals));

  // var id_hospital = [];
  // for (let i = 0; i < hospitals.length; i++) {
  //   id_hospital[i] = hospitals[i].name;
  // }

  //

  console.log(area);
  //console.log(hnames);
  console.log(hospitals);
  res.redirect('ambulance/coords');
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
