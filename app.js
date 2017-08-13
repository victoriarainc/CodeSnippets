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
const LocalStrategy = require('passport-local').Strategy;

const loginRoutes = require('./routes/login');


let url = 'mongodb://localhost:27017/code_snippets';


// =========BOILER PLATE===========

// for passport
passport.use(new LocalStrategy(function(username, password, done) {
  User.authenticate(username, password)
  // success!
    .then(user => {
    if (user) {
      done(null, user);
    } else {
      done(null, null, {message: 'There was no user with this email and password.'});
    }
  })
  // there was a problem
    .catch(err => done(err));
}));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(user_id, done) {
  User.findById(user_id, (err, user) => {
    // TODO: Error Handling
    done(null, user.findById(user));
  });
});

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
