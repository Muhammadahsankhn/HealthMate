const Vital = require("../models/vitalModel"); // ✅ Import your Mongoose model
const { analyzeVitals } = require("../services/ai.services"); // ✅ Import AI service

exports.addVitals = async (req, res) => {
  try {
    const { bloodPressure, bloodSugar, weight, heartRate } = req.body;

    // 🔒 Authentication check
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // ⚙️ Validation
    if (!bloodPressure || !bloodSugar || !weight || !heartRate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🩺 Save vitals to MongoDB
    const newVital = Vital.create({
      userId: req.user._id,
      bloodPressure,
      bloodSugar,
      weight,
      heartRate,
    });


    // 🤖 Generate AI summary
    const aiResponse = await analyzeVitals({
      bloodPressure,
      bloodSugar,
      weight,
      heartRate,
    });

    // ✅ Send response
    res.status(201).json({
      message: "Vitals added successfully",
      data: newVital,
      aiSummary: aiResponse,
    });
  } catch (error) {
    console.error("Error adding vitals:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};