const File = require("../models/fileModel");
const Vitals = require("../models/vitalModel");
const { chatWithAI } = require("../services/ai.services");

exports.chat = async (req, res) => {
  try {
    const { message, id, source } = req.body; 

    // 1. Find the document (File or Vitals)
    let document = null;
    if (source === "vitals") {
        document = await Vitals.findById(id);
    } else {
        document = await File.findById(id);
    }

    if (!document) {
      return res.status(404).json({ msg: "Record not found" });
    }

    // 2. Get AI Response
    const reply = await chatWithAI(document, message);

  
    // Push User's Message
    document.chatHistory.push({
        sender: "user",
        message: message
    });

    // Push AI's Reply
    document.chatHistory.push({
        sender: "ai",
        message: reply
    });

    // Save the document!
    await document.save();
    // ---------------------------------------------------------

    return res.json({ reply });
    
  } catch (error) {
    console.error("Chat Controller error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};