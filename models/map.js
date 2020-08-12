var mongoose = require('mongoose');

const mapSchema = new mongoose.Schema({
    title: String,
    lat: Number,
    lng: Number
  });

  module.exports = mongoose.model('map', mapSchema);