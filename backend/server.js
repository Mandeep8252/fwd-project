const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const ridesRouter = require('./routes/rides');
const authRouter = require('./routes/auth');

app.use('/api/rides', ridesRouter);
app.use('/api/auth', authRouter);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err.message));

// Start server
const PORT = process.env.PORT || 5000;

// Root route (for testing)
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
