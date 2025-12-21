const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const auth = require('../middleware/auth'); // JWT auth middleware

// =====================
// Test Route
// =====================
router.get('/test', (req, res) => {
  res.json({ message: 'Backend working!' });
});

// =====================
// Get ALL Rides (Admin / Debug)
// =====================
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find().sort({ createdAt: -1 }); // newest first
    res.json(rides);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// =====================
// 🆕 Get Logged-in User Ride History
// =====================
router.get('/my', auth, async (req, res) => {
  try {
    const rides = await Ride.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(rides);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// =====================
// Add a New Ride
// =====================
router.post('/', auth, async (req, res) => {
  const { from, to, distance, duration, fare, type } = req.body;

  // Input validation
  if (!from || !to || !distance || !duration || !fare || !type) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newRide = new Ride({
    user: req.user.id, // 🔑 user from JWT
    from,
    to,
    distance,
    duration,
    fare,
    type
  });

  try {
    const savedRide = await newRide.save();
    res.status(201).json(savedRide); // 201 = Created
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
