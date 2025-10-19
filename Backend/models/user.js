const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
