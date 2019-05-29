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

  res.redirect(`ambulance/test/${id}/${area}`);
});

// response

router.get('/ambulance/route', (req, res) => {
  res.render('ambulance/map');
});
router.get('/ambulance/coords', (req, res) => {
  res.render('ambulance/coords');
});
router.get('/ambulance/test/:id/:area', async (req, res) => {
  let { id, area } = req.params;
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

  // Get possibles hospital id Because EPS & Area & bed availbility
  let options = await pool.query(
    'SELECT DISTINCT A.id_hospital, H.lat, H.long FROM Hospital.hospital AS H, Hospital.beds AS B, Hospital.areas AS A WHERE B.id_area IN (SELECT A.id FROM Hospital.hospital AS H, areas AS A WHERE H.hname in (?) AND A.name = ? AND A.id_hospital = H.idhospital) AND B.status ="Free" AND B.id_area = A.id AND H.idhospital = A.id_hospital',
    [hnames, area]
  );
  options = JSON.parse(JSON.stringify(options));

  var ops = [];
  for (let i = 0; i < options.length; i++) {
    ops[i] = options[i];
  }
  console.log(ops);
  // Check availability
  res.render('ambulance/test', { ops });
});

// Modules Exports
module.exports = router;
