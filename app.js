require('dotenv').config();

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
require('./config/passportConfig'); 

const authRoutes = require('./routes/auth');
const submitRoutes = require('./routes/submit');

const app = express();



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Route handlers
app.use('/auth', authRoutes);
app.use('/', submitRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});