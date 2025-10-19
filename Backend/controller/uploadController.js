const { uploadBuffer } = require('../utils/cloudinary');
const File = require('../models/file');
const AiInsight = require('../models/aiInsight');
const { analyzeFile } = require('../utils/aiClient');

exports.upload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const file = req.file; // buffer available because multer memoryStorage
    // pass original filename and mimetype so local fallback can pick a correct extension
    const result = await uploadBuffer(file.buffer, { resource_type: 'auto', originalname: file.originalname, mimetype: file.mimetype });
    // Save to DB
    const saved = await File.create({ userId: req.user.userId, fileUrl: result.secure_url, fileType: result.format });

    // Attempt AI analysis immediately (best-effort). If analysis fails, return uploaded file info and error details.
    try {
      const insights = await analyzeFile(result.secure_url);
      const savedInsight = await AiInsight.create({
        fileId: saved._id,
        englishSummary: insights.englishSummary || insights.english || insights.text || '',
        romanUrduSummary: insights.romanUrduSummary || insights.roman || '',
        fullAnswerEnglish: insights.fullAnswerEnglish || insights.fullAnswer || '',
        fullAnswerRoman: insights.fullAnswerRoman || insights.fullAnswerRoman || insights.fullRoman || '',
        summary: insights.summary || insights.shortSummary || '',
        highlights: insights.highlights || [],
        doctorQuestions: insights.doctorQuestions || [],
        dietTips: insights.dietTips || [],
        homeRemedies: insights.homeRemedies || [],
        disclaimer: insights.disclaimer || 'Always consult your doctor before making any decision.'
      });

      return res.status(201).json({ message: 'Uploaded and analyzed', file: saved, insight: savedInsight });
    } catch (aiErr) {
      console.error('AI analysis after upload failed, attempting fallback analyzeFile()', aiErr && aiErr.message ? aiErr.message : aiErr);
      // Try to get a fallback insight (analyzeFile returns fallback on errors) and save it so frontend always gets insight
      try {
        const fallback = await analyzeFile(result.secure_url);
        const savedInsight = await AiInsight.create({
          fileId: saved._id,
          englishSummary: fallback.englishSummary || '',
          romanUrduSummary: fallback.romanUrduSummary || '',
          fullAnswerEnglish: fallback.fullAnswerEnglish || fallback.fullAnswer || '',
          fullAnswerRoman: fallback.fullAnswerRoman || fallback.fullAnswerRoman || fallback.fullRoman || '',
          summary: fallback.summary || '',
          highlights: fallback.highlights || [],
          doctorQuestions: fallback.doctorQuestions || [],
          dietTips: fallback.dietTips || [],
          homeRemedies: fallback.homeRemedies || [],
          disclaimer: fallback.disclaimer || 'Always consult your doctor before making any decision.'
        });
        return res.status(201).json({ message: 'Uploaded (analysis fallback)', file: saved, insight: savedInsight });
      } catch (fallbackErr) {
        console.error('Fallback analysis also failed', fallbackErr && fallbackErr.message ? fallbackErr.message : fallbackErr);
        // Return uploaded file and AI error details (dev)
        if (process.env.NODE_ENV !== 'production') {
          return res.status(201).json({ message: 'Uploaded (analysis failed)', file: saved, aiError: aiErr.message || String(aiErr) });
        }
        return res.status(201).json({ message: 'Uploaded', file: saved });
      }
    }

  } catch (err) {
    console.error('Upload error', err && err.stack ? err.stack : err);
    // Helpful error messages in dev to speed debugging (do not leak in production)
    if (err && String(err.message).toLowerCase().includes('cloudinary not configured')) {
      return res.status(500).json({ error: 'Cloudinary not configured', details: err.message });
    }
    if (process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ error: 'Upload failed', details: err.message || String(err) });
    }
    res.status(500).json({ error: 'Upload failed' });
  }
};
