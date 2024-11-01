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
  descriptions: [String],
  condition: {  
    arrival: { type: String },
    departure: { type: String },
    smoker: { type: String },
    animal: { type: String },
    holidays: { type: String },
    ageRestriction: { type: String },
    ageRestrictionDsc: { type: String },
    bebebeds: { type: String },
    bedsRestrictionDsc: { type: String },
  }
}, { timestamps: true });

module.exports = mongoose.model('House', houseSchema);
