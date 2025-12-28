const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// =======================
// Middleware
// =======================
app.use(cors());
app.use(express.json());

// =======================
// API Routes
// =======================
const ridesRouter = require('./routes/rides');
const authRouter = require('./routes/auth');

app.use('/api/rides', ridesRouter);
app.use('/api/auth', authRouter);

// Test API route (must be ABOVE React catch-all)
app.get('/api', (req, res) => {
  res.json({ message: 'Backend is running 🚀' });
});

// =======================
// MongoDB Connection
// =======================
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) =>
    console.error('❌ MongoDB connection error:', err.message)
  );

// =======================
// Serve React Frontend (Production)
// =======================
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(
    __dirname,
    '../Smart Bike Rental App UI (Community)/build'
  );

  // Serve static files
  app.use(express.static(frontendPath));

  // React catch-all route using RegExp (works with Node 25+)
  app.get(/^\/.*$/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
