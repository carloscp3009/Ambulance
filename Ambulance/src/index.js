const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

// initializations
const app = express();

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine(
  '.hbs',
  exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
  })
);
app.set('view engine', '.hbs');

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Global Variables
app.use((req, res, next) => {
  next();
});

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/areas', require('./routes/areas'));

// Public (Static Files)
app.use(express.static(path.join(__dirname + 'public')));

// Start the Server
app.listen(app.get('port'), () =>
  console.log(`App runing on port ${app.get('port')}`)
);
