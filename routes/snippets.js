const express = require('express');
const routes = express.Router();
const User = require('../models/user');
const Snippet = require('../models/snippet')
const mongoose = require('mongoose');

//retrieves a form
routes.get('/snippets/add', (req, res) => {
  res.render('add');
});

routes.post('/snippets', (req, res) => {
  if (!req.body._id) {
    req.body._id = new mongoose.mongo.ObjectID();
  }

  req.body.author = req.user.username;

  Snippet.findByIdAndUpdate(req.body._id, req.body, {upsert: true}).then(() => res.redirect('/'))
  // catch validation errors
    .catch(err => {
    console.log(err);
    res.render('snippets', {
      errors: err.errors,
      item: req.body
    });
  });
});

routes.get('/deleteItem', (req, res) => {
  Item.findById(req.query.id).remove()
  // then redirect to the homepage
    .then(() => res.redirect('/'));
});

module.exports = routes;
