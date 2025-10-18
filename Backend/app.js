const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const seedAdmin = require('./scripts/admin'); // ✅ Import it

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api', adminRoutes);

// Connect DB and seed admin
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await seedAdmin(); // ✅ Seed admin only once
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

module.exports = app;
