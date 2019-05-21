const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const Hospital = require('./models/Hospital');

const app = express();

// Settings
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/dist/index.html'));
});

app.get('/hospital', (req, res) => {
  res.json([]);
  Hospital.getHospitals((err, data) => {
    res.status(200).json(data);
  });
});

// Static Files

// Start the Server
app.listen(PORT, () => console.log(`App runing on port ${PORT}`));
