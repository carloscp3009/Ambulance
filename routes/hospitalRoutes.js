const Hospital = require('../models/Hospital');

module.exports = function(app) {
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dist/index.html'));
  });

  app.get('/hospital', (req, res) => {
    res.json([]);
    Hospital.getHospitals((err, data) => {
      res.status(200).json(data);
    });
  });
};
