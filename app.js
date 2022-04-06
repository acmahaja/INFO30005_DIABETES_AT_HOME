const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

app.engine(
  'hbs',
  exphbs.engine({
    defaultlayout: 'main',
    extname: '.hbs'
  })
);
app.set('view engine', 'hbs');

// GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Log requests
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Data sanitizaiton against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// ROUTES
app.get('/clinician', (req, res) => {
  res.send('Clinician Page');
});

app.get('/patient', (req, res) => {
  res.send('Patient Page');
});

app.get('/', (req, res) => {
  res.send('Welcome to Diabetes at Home');
});

module.exports = app;
