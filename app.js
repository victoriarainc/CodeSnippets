// ===========PACKAGES===========

const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');

const app = express();

const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('express-flash-messages');

const mongoose = require('mongoose');
const bluebird = require('bluebird');
mongoose.Promise = bluebird;

const User = require('./models/user');
const Snippet = require('./models/snippet');

const passport = require('passport');

const loginRoutes = require('./routes/login');


let url = 'mongodb://localhost:27017/code_snippets';


// =========BOILER PLATE===========

// for handlebars
app.engine('handlebars', exphbs());
app.set('views', './views');
app.set('view engine', 'handlebars');

// for express-session
app.use(session({
  //in the future this is not how to store passwords
  secret: 'CROWpoe',
  resave: false, // doesn't save without changes
  saveUninitialized: true // creates a session
}));

// for express
app.use(express.static('public'));

//for bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// for express-validator
app.use(expressValidator());

//for passport
app.use(passport.initialize());

//for passport session
app.use(passport.session());

//for flash
app.use(flash());

// ============= ENDPOINTS ===============

const requireLogin = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

app.get('/', requireLogin, function(req, res) {
  Snippet.find({author: req.user.username})
    .then((snippets) => {
      res.render('home', {user: req.user, snippets: snippets})
    })
    .catch(err => response.send('Can not find snippets'));
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  let user = new User(req.body);
  user.provider = 'local';
  user.setPassword(req.body.password);

  user.save()
  // if good...
    .then(() => res.redirect('/'))
  // if bad...
    .catch(err => console.log(err));
});

app.use('/', loginRoutes);

//APP
mongoose.connect(url, (err, connection) => {
  if (!err) {
    console.log('connected to mongo');
  }
  // ============== LISTEN =================
  app.listen(3000, function() {
    console.log('Your app is running!')
  });
});
