const express = require('express');
const routes = express.Router();
const User = require('../models/user');

routes.get('/snippets/add', (req, res) => {
  res.render('add');
});






















module.exports = routes;
