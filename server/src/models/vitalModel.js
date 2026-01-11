const mongoose = require('mongoose');

const vitalSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bloodPressure: { type: String, required: true },
    bloodSugar: { type: Number, required: true },
    weight: { type: Number, required: true },
    heartRate: { type: Number, required: true },

    createdAt: { type: Date, default: Date.now },


    aiSummary: { type: String },
    aiRomanUrdu: { type: String },
    aiDoctorAdvice: { type: String },

    fullAnalysis: { type: String },


    chatHistory: [
        {
            sender: { type: String, enum: ["user", "ai"], required: true },
            message: { type: String, required: true },
            timestamp: { type: Date, default: Date.now }
        }
    ],
});

module.exports = mongoose.model('Vital', vitalSchema);