const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  city: { type: String, required: true },
  neighborhoods: [{ type: String }] // Array of neighborhood names
});

const Location = mongoose.model('Location', locationSchema);
module.exports = Location;
