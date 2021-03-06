const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const poolEps = require('../databaseEps');
const helpers = require('./helpers');

passport.use(
  'local.signin',
  new LocalStrategy(
    {
      usernameField: 'hname',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, hname, password, done) => {
      const rows = await pool.query('SELECT * FROM hospital WHERE hname = ?', [
        hname
      ]);
      if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(
          password,
          user.password
        );
        console.log(user);
        if (validPassword) {
          done(null, user, req.flash('success', 'Welcome ' + user.hname));
        } else {
          done(null, false, req.flash('message', 'Incorrect Password'));
        }
      } else {
        return done(
          null,
          false,
          req.flash('message', 'The User does not exists.')
        );
      }
    }
  )
);

// passport.use(
//   'local.signin',
//   new LocalStrategy(
//     {
//       usernameField: 'hname',
//       passwordField: 'password',
//       passReqToCallback: true
//     },
//     async (req, username, password, done) => {
//       const rows = await pool.query('SELECT * FROM hospital WHERE hname = ?', [
//         username
//       ]);
//       if (rows.length > 0) {
//         const user = rows[0];
//         const validPassword = await helpers.matchPassword(
//           password,
//           user.password
//         );
//         if (validPassword) {
//           done(null, user, req.flash('success', 'Welcome ' + user.username));
//         } else {
//           done(null, false, req.flash('message', 'Incorrect Password'));
//         }
//       } else {
//         return done(
//           null,
//           false,
//           req.flash('message', 'The Username does not exists.')
//         );
//       }
//     }
//   )
// );

passport.use(
  'local.signup',
  new LocalStrategy(
    {
      usernameField: 'hname',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, hname, password, done) => {
      var { address, phone, department, city, lat, long, eps } = req.body;
      var epsH = [];
      for (let i = 0; i < eps.length; i++) {
        epsH[i] = [eps[i], hname];
      }
      console.log(epsH);
      let rslt = await poolEps.query(
        'INSERT INTO hospitals (id_eps, name) VALUES ?',
        [epsH]
      );
      console.log(rslt);
      let newUser = {
        hname,
        password,
        address,
        phone,
        department,
        city,
        lat,
        long
      };
      newUser.password = await helpers.encryptPassword(password);
      const result = await pool.query('INSERT INTO hospital SET ?', [newUser]);
      newUser.idhospital = result.insertId;
      return done(
        null,
        newUser,
        req.flash('success', 'Wellcome ' + newUser.hname)
      );
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.idhospital);
});

passport.deserializeUser(async (id, done) => {
  const rows = await pool.query('SELECT * FROM hospital WHERE idhospital = ?', [
    id
  ]);
  done(null, rows[0]);
});
