const File = require("../models/fileModel");
const cloudinary = require("../utils/cloudinary");
const path = require("path");
const { analyzeReport } = require("../services/ai.services");
const fs = require("fs");
const pdfParse = require('pdf-parse');
const Tesseract = require("tesseract.js");

// ===============================
// Upload Report + AI Analysis
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
    let aiResult = { summary: null, romanUrdu: null, doctorQuestions: null };

    try {
      if (req.file.mimetype === "application/pdf") {
        // Read file from disk
        const dataBuffer = fs.readFileSync(req.file.path);

        //  DANGEROUS LINE WRAPPED IN TRY/CATCH
        try {
          const pdfData = await pdfParse(dataBuffer);
          fileContent = pdfData.text;

          // Truncate to prevent AI crash on large files
          if (fileContent) fileContent = fileContent.substring(0, 3000);

        } catch (pdfErr) {
          console.warn("PDF Parsing Failed (Skipping AI):", pdfErr.message);
          fileContent = ""; // Continue without text
        }

      } else if (req.file.mimetype.startsWith("image/")) {
        const { data: { text } } = await Tesseract.recognize(req.file.path, "eng");
        fileContent = text;
      }
    } catch (extractionErr) {
      console.error("General Extraction Error:", extractionErr);
      // Do NOT return 500 here. We want to save the file even if text read fails.
    }

    // 4. AI Analysis (Only if we successfully got text)
    if (fileContent && fileContent.trim().length > 10) {
      try {
        console.log("Sending text to AI...");
        aiResult = await analyzeReport(fileContent, req.file.mimetype);
      } catch (aiErr) {
        console.error("AI Analysis Failed:", aiErr.message);
      }
    } else {
      console.log("Skipping AI: Not enough text found.");
      aiResult.summary = "Could not extract text from this file. Upload image only";
    }

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

    res.status(200).json({
      count: files.length,
      files: files
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Server error fetching files" });
  }
};



// ... existing uploadReport and getFile ...

//  GET SINGLE FILE BY ID (For Analysis Page)
exports.getFileById = async (req, res) => {
  try {
    // Find the file AND ensure it belongs to the logged-in user
    const file = await File.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!file) {
      return res.status(404).json({ message: "Report not found or unauthorized" });
    }

    res.status(200).json({ data: file });
  } catch (error) {
    console.error("Error fetching single file:", error);
    res.status(500).json({ message: "Server error" });
  }
};