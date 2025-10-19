const mongoose = require('mongoose');

const vitalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bp: { type: String },
  sugar: { type: String },
  weight: { type: String },
  date: { type: Date, default: Date.now },
  notes: { type: String }
});

module.exports = mongoose.model('Vital', vitalSchema);
