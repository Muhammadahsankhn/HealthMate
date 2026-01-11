const Vital = require("../models/vitalModel");
const { analyzeVitals } = require("../services/ai.services");

// 1. ADD VITALS
exports.addVitals = async (req, res) => {
  try {
    const { bloodPressure, bloodSugar, weight, heartRate } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!bloodPressure || !bloodSugar || !weight || !heartRate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // AI Analysis
    const aiResponse = await analyzeVitals({
      bloodPressure,
      bloodSugar,
      weight,
      heartRate,
    });

    // Save to DB
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

// 2. GET USER VITALS (History List)
exports.getUserVitals = async (req, res) => {
  try {
    const userId = req.user._id;
    const vitals = await Vital.find({ userId: userId }).sort({ createdAt: -1 });
    res.status(200).json({ data: vitals });
  } catch (error) {
    console.error("Error fetching vitals:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 3. GET SINGLE VITAL (For Chat)
exports.getVitalById = async (req, res) => {
  try {
    const vital = await Vital.findOne({ 
        _id: req.params.id, 
        userId: req.user._id 
    });

    if (!vital) {
      return res.status(404).json({ message: "Vital record not found" });
    }

    res.json({ data: vital });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};