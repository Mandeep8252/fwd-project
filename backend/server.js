const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// =======================
// Middleware
// =======================
app.use(express.json());
app.use(cookieParser());

// ✅ FIXED CORS (required for live login if using cookies)
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // e.g. https://your-frontend.onrender.com
    credentials: true,
  })
);

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
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// =======================
// Serve React Frontend (Production)
// =======================
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../smart-bike-frontend/build');

  app.use(express.static(frontendPath));

  app.get(/^\/.*$/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
