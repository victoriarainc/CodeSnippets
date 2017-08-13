const express = require('express');
const routes = express.Router();
const passport = require('passport')

// local login form
routes.get('/login', (req, res) => {
  res.render('login', {failed: req.query.failed});
});

// endpoint for local login sumbit
routes.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login?failed=true',
  failureFlash: true
}));

// log out
routes.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


module.exports = routes;
