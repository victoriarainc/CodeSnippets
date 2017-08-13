const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const findOrCreate = require('mongoose-findorcreate');

// get a reference to Schema
const Schema = mongoose.Schema;

// create a schema for a user
const snippetSchema = new Schema({
  id : {type: String},
  title : {type: String, required: true},
  body : {type: String, required: true},
  notes: {type: String},
  language: {type: String, required: true},
  tags: {type: String, required: true},
  author: {type: String, required: true}
});

// create a model for a User
const Snippet = mongoose.model('Snippet', snippetSchema);

module.exports = Snippet;
