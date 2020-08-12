var mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    letter: String,
    frequency: Number
  });

  module.exports = mongoose.model('data', dataSchema);