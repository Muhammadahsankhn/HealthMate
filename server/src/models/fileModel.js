const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    aiSummary: String,
    aiRomanUrdu: String,
    aiDoctorQuestions: String,
    uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("File", fileSchema);
