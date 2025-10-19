const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hackathon_db';
    if (!process.env.MONGO_URI) {
      console.warn('MONGO_URI not set in env — using fallback', uri);
    }
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err && err.message ? err.message : err);
    // Do not hard exit here; let the app log the error so developer can debug locally.
    process.exit(1);
  }
};

module.exports = connectDB;
