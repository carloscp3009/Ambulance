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
// Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
//   return arg1 == arg2 ? options.fn(this) : options.inverse(this);
// });
module.exports = helpers;
