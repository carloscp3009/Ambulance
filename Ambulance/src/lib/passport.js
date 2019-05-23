const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
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
          req.flash('message', 'The Username does not exists.')
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
      const { address, phone, department, city, lat, long } = req.body;
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
      newUser.id = result.insertId;
      return done(null, newUser);
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
