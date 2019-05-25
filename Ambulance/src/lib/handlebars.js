const helpers = {};

helpers.ifEquals = (status, value) => {
  if (status == value) {
    return true;
  }
};
// Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
//   return arg1 == arg2 ? options.fn(this) : options.inverse(this);
// });
module.exports = helpers;
