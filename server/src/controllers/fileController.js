const File = require("../models/fileModel");
const cloudinary = require("../utils/cloudinary");
const path = require("path");
const { analyzeReport } = require("../services/ai.services");


// these three imports are needs forextract the text from images or pdfs;
const fs = require("fs");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");



exports.uploadReport = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        //  Extract user info for naming
        const userId = req.body.userId || "unknown";
        const userName = req.body.userName || "user";
        const timestamp = Date.now();

        //  Create custom filename like: ahsan-1735320436123.pdf
        const originalExt = path.extname(req.file.originalname);
        const customFileName = `${userName.toLowerCase()}-${timestamp}${originalExt}`;

        //  Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "reports",
            resource_type: "auto",
            public_id: path.parse(customFileName).name,
            use_filename: true,
            unique_filename: false,
        });

        //  Extract text from PDF
        async function extractPdfText(filePath) {
            const dataBuffer = fs.readFileSync(filePath);
            const pdfData = await pdfParse(dataBuffer);
            return pdfData.text;
        }

        //  Extract text from Image
        async function extractImageText(filePath) {
            const { data: { text } } = await Tesseract.recognize(filePath, "eng");
            return text;
        }

        //  Extract actual text from file before sending to AI
        let fileContent = "";

        if (req.file.mimetype.includes("pdf")) {
            fileContent = await extractPdfText(req.file.path);
        } else if (req.file.mimetype.includes("image")) {
            fileContent = await extractImageText(req.file.path);
        } else {
            fileContent = fs.readFileSync(req.file.path, "utf-8");
        }

        //  Analyze the actual text using Gemini
        const aiResult = await analyzeReport(fileContent, req.file.mimetype);

        //  Log the full AI result for debugging
        // console.log("🧠 Gemini AI Result:");
        // console.log(JSON.stringify(aiResult, null, 2));

        //  Save record in MongoDB
        const newFile = await File.create({
            userId: userId,
            fileName: customFileName,
            fileUrl: result.secure_url,
            fileType: req.file.mimetype,
            aiSummary: aiResult.summary,
            aiRomanUrdu: aiResult.romanUrdu,
            aiDoctorQuestions: aiResult.doctorQuestions,
        });

        //  Respond with file + AI data
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
