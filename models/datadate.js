var mongoose = require('mongoose');

const datadateSchema = new mongoose.Schema({
    letter: String,
    frequency: Number
  });

  module.exports = mongoose.model('datadate', datadateSchema);