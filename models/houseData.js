const mongoose = require('mongoose');

// Main House Schema
const houseSchema = new mongoose.Schema({
  partnerName: String,
  partnerLastName: String,
  phoneNumber: String,
  city: String,
  neighborhood: String,
  type: String,
  nightmonth: String,
  furniture: String,
  apartmentInfo: {
    position: String,
    apartmentName: String,
    floor: Number,
    area: Number,
    price: Number,
  },
  rooms: [{
    typee: { type: String },
    description: { type: String },
  }],
  features: {
    type: Object,
    default: {},
  },
  environment: {
    type: Object,
    default: {},
  },
  images: [String], 
}, { timestamps: true });

module.exports = mongoose.model('House', houseSchema);
