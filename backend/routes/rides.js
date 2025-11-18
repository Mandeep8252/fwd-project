const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Backend working!' });
});

// Get all rides
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find().sort({ date: -1 });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new ride
router.post('/', async (req, res) => {
  const { from, to, distance, duration, fare, type } = req.body;
  const newRide = new Ride({ from, to, distance, duration, fare, type });
  try {
    const savedRide = await newRide.save();
    res.json(savedRide);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
