const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '3009',
  database: 'Hospital'
});

let hospitalModel = {};

hospitalModel.getHospitals = callback => {
  if (connection) {
    connection.query('SELECT hname FROM Hospital.hospital'),
      (err, rows) => {
        if (err) {
          throw err;
        } else {
          callback(null, rows);
        }
      };
  }
};

module.exports = hospitalModel;
