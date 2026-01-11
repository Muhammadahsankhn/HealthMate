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

    // 🤖 Generate AI summary
    const aiResponse = await analyzeVitals({
      bloodPressure,
      bloodSugar,
      weight,
      heartRate,
    });


    // 🩺 Save vitals to MongoDB
    const newVital = await Vital.create({
      userId: req.user._id,
      bloodPressure,
      bloodSugar,
      weight,
      heartRate,
      aiSummary: aiResponse.summary,
      aiRomanUrdu: aiResponse.romanUrdu,
      aiDoctorAdvice: aiResponse.doctorAdvice,
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



exports.getVitalsById = async (req, res) => {
  try {
    const userId = req.user._id;
    const vital = await Vital.find({ userId: userId }).sort({ createdAt: -1 });

    if (!vital) {
      return res.status(404).json({
        message: "Vital record not found"
      });
    }

    res.status(200).json({ data: vital });

  } catch (error) {

    console.error("Error fetching vitals:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }
};

