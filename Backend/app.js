const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const aiRoutes = require('./routes/ai');
const vitalsRoutes = require('./routes/vitals');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve locally-stored uploads when Cloudinary is not configured
const path = require('path');
const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Dev request logger to help debugging
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    try {
      console.log(`[req] ${req.method} ${req.originalUrl} body:`, req.body && Object.keys(req.body).length ? req.body : '{}');
    } catch (e) {
      console.warn('req logger error', e);
    }
    next();
  });
}

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/vitals', vitalsRoutes);

// Database connection is started from server.js (connectDB) to keep app module side-effect free

module.exports = app;
