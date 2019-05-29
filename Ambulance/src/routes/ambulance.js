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

router.get('/ambulance/test/:id/:area', async (req, res) => {
  let { id, area } = req.params;

  // Check availability
  res.render('ambulance/coords', { area, id });
});
//
///////

////Master query

//////
router.post('/ambulance/test/:id/:area', async (req, res) => {
  let { id, area } = req.params;
  // Get User
  let user = await poolEps.query('SELECT * FROM users WHERE id = ?', [id]);
  if (user.length == 1) {
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
      'SELECT DISTINCT A.id_hospital FROM Hospital.hospital AS H, Hospital.beds AS B, Hospital.areas AS A WHERE B.id_area IN (SELECT A.id FROM Hospital.hospital AS H, areas AS A WHERE H.hname in (?) AND A.name = ? AND A.id_hospital = H.idhospital) AND B.status ="Free" AND B.id_area = A.id AND H.idhospital = A.id_hospital',
      [hnames, area]
    );
    options = JSON.parse(JSON.stringify(options));

    var ops = [];
    for (let i = 0; i < options.length; i++) {
      ops[i] = options[i].id_hospital;
    }
    console.log(ops);

    /////////////////////////////////////////////////////////////////////////////////////
    let { origin } = req.body;

    origin = origin
      .split('(')[1]
      .split(')')[0]
      .split(',');
    let lat = origin[0];
    let lon = origin[1];

    //console.log(origin[1]);
    let sql = `SELECT H.hname,H.idhospital,H.lat,H.long,( 6371 * acos(cos(radians(${lat})) * cos(radians(lat)) * cos(radians(H.long) - radians(${lon})) + sin(radians(${lat})) * sin(radians(lat)))) AS distance FROM Hospital.hospital AS H WHERE H.idhospital IN (?) ORDER BY distance ASC`;
    let hospitalSelected = await pool.query(sql, [ops]);

    hospitalSelected = JSON.parse(JSON.stringify(hospitalSelected))[0];
    const latf = hospitalSelected.lat;
    const lonf = hospitalSelected.long;

    // Patient manage
    let userBed = await pool.query(
      'SELECT B.id FROM hospital AS H, beds AS B, areas AS A WHERE B.id_area = A.id AND H.idhospital = A.id_hospital AND A.name = ? AND H.idhospital = ? LIMIT 1 ',
      [area, hospitalSelected.idhospital]
    );
    userBed = JSON.parse(JSON.stringify(userBed))[0].id;

    const newUser = {
      cedula: user.id,
      name: user.name,
      eps: user.id_eps,
      date_in: 'Arriving',
      bed: userBed,
      status: 'in'
    };
    await pool.query('INSERT INTO user set ?', [newUser]);
    await pool.query('UPDATE beds set ? WHERE id = ?', [
      { status: 'Booked' },
      userBed
    ]);

    console.log(newUser);

    req.flash('success', `${area} Bed ${userBed} in room Booked`);
    res.render('ambulance/route', { lat, lon, latf, lonf });
  } else {
    req.flash('message', 'User doesnt exist');
    res.redirect('/ambulance');
  }
});
// Modules Exports
module.exports = router;
