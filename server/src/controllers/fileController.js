const File = require("../models/fileModel");
const cloudinary = require("../utils/cloudinary");
const path = require("path");
const { analyzeReport } = require("../services/ai.services");
const fs = require("fs");
const pdfParse = require('pdf-parse');
const Tesseract = require("tesseract.js");

// ===============================
// 📄 Upload Report + AI Analysis
// ===============================
exports.uploadReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }


    // Get user info
    const userId = req.user._id;
    const userName = req.user.username || "user";
    const timestamp = Date.now();


    // Create custom file name
    const originalExt = path.extname(req.file.originalname);
    const customFileName = `${userName.toLowerCase()}-${timestamp}${originalExt}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "reports",
      resource_type: "auto",
      public_id: path.parse(customFileName).name,
      use_filename: true,
      unique_filename: false,
    });

    // Extract text
    let fileContent = "";
    if (req.file.mimetype.includes("pdf")) {
      const dataBuffer = fs.readFileSync(req.file.path);
      // console.log(req.file.path);

      const pdfData = await pdfParse(dataBuffer);
      fileContent = pdfData.text;
    } else if (req.file.mimetype.includes("image")) {
      const { data: { text } } = await Tesseract.recognize(req.file.path, "eng");
      fileContent = text;
    } else {
      fileContent = fs.readFileSync(req.file.path, "utf-8");
    }

    // Send text to AI
    const aiResult = await analyzeReport(fileContent, req.file.mimetype);

    // Save in DB
    const newFile = await File.create({
      userId,
      fileName: customFileName,
      fileUrl: result.secure_url,
      fileType: req.file.mimetype,
      aiSummary: aiResult.summary,
      aiRomanUrdu: aiResult.romanUrdu,
      aiDoctorQuestions: aiResult.doctorQuestions,
    });

    res.status(200).json({
      message: "File uploaded and analyzed successfully",
      file: newFile,
      ai: aiResult,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



exports.getFile = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all files uploaded by this user
    const files = await File.find({ userId: userId }).sort({ createdAt: -1 });

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "No files found for this user" });
    }

    res.status(200).json({ files });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Server error fetching files" });
  }
};