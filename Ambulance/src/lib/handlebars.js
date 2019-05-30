const exphbs = require('handlebars');
const helpers = {};

helpers.statusColor = status => {
  if (status == 'Free') {
    return new exphbs.SafeString(
      '<p class=' + '"m-2 btn btn-success block">' + status + '</p>'
    );
  } else if (status == 'Booked') {
    return new exphbs.SafeString(
      '<p class=' + '"m-2 btn btn-primary block">' + status + '</p>'
    );
  } else {
    return new exphbs.SafeString(
      '<p class=' + '"m-2 btn btn-danger block">' + status + '</p>'
    );
  }
};

const poolEps = require('../databaseEps');

helpers.epsName = async eps => {
  let epsName = await poolEps.query('SELECT name FROM eps WHERE id = ?', [eps]);
  epsName = JSON.parse(JSON.stringify(epsName))[0].name;

  console.log(epsName);
  //return epsName;
  return new exphbs.SafeString('<td>' + epsName + '</td>');
};
module.exports = helpers;
