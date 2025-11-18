const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  from: String,
  to: String,
  distance: Number, // in km
  duration: Number, // in seconds
  fare: Number, // in INR
  type: { type: String, enum: ['bike', 'scooter'] },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ride', rideSchema);
