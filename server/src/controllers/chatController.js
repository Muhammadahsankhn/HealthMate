const File = require("../models/fileModel");
const Vitals = require("../models/vitalModel");
const { chatWithAI } = require("../services/ai.services");

exports.chat = async (req, res) => {
  try {
    const { message, id, source } = req.body;

    let aiSummaryObject =
      source === "vitals"
        ? await Vitals.findById(id)
        : await File.findById(id);

    if (!aiSummaryObject) {
      return res.status(404).json({ msg: "Record not found" });
    }

    const reply = await chatWithAI(aiSummaryObject, message);
    return res.json({ reply });
  } catch (error) {
    console.log("Chat error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};
