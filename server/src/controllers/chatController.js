const File = require("../models/fileModel");
const Vitals = require("../models/vitalModel");
const { chatWithAI } = require("../services/ai.services");

exports.chat = async (req, res) => {
  try {
    const { message, id, source } = req.body; // source should be "vitals" or "report"

    let aiSummaryObject = null;

    if (source === "vitals") {
        aiSummaryObject = await Vitals.findById(id);
    } else {
        // Default to File search if source isn't vitals
        aiSummaryObject = await File.findById(id);
    }

    if (!aiSummaryObject) {
      return res.status(404).json({ msg: "Record not found" });
    }

    const reply = await chatWithAI(aiSummaryObject, message);
    return res.json({ reply });
    
  } catch (error) {
    console.error("Chat Controller error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};