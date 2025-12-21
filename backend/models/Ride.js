const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // reference to User model
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  distance: {
    type: Number, // in km
    required: true
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  fare: {
    type: Number, // in INR
    required: true
  },
  type: {
    type: String,
    enum: ['bike', 'scooter'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true }); // automatically adds createdAt and updatedAt

module.exports = mongoose.model('Ride', rideSchema);
