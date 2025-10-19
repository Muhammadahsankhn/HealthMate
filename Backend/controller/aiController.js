// controller/aiController.js
const AiInsight = require('../models/aiInsight');
const File = require('../models/file');
const { analyzeFile, chatWithAi } = require('../utils/aiClient');
const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');

exports.analyze = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Upload the file to Cloudinary
    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const cloudResult = await uploadStream();

    // Analyze using Gemini
    const insights = await analyzeFile(cloudResult.secure_url);

    // Save file info
    const savedFile = await File.create({
      userId: req.user._id,
      fileUrl: cloudResult.secure_url,
      fileType: req.file.mimetype,
      uploadedAt: new Date(),
    });

    // Save AI insights
    const savedInsight = await AiInsight.create({
      fileId: savedFile._id,
      englishSummary: insights.englishSummary,
      romanUrduSummary: insights.romanUrduSummary,
      fullAnswerEnglish: insights.fullAnswerEnglish,
      fullAnswerRoman: insights.fullAnswerRoman,
      highlights: insights.highlights,
      doctorQuestions: insights.doctorQuestions,
      dietTips: insights.dietTips,
      homeRemedies: insights.homeRemedies,
      disclaimer: insights.disclaimer,
    });

    res.json({
      message: 'AI analysis successful',
      fileUrl: cloudResult.secure_url,
      insight: savedInsight,
    });
  } catch (err) {
    console.error('AI analyze error:', err);
    res.status(500).json({ error: 'AI analysis failed' });
  }
};


// Simple chat route remains unchanged
exports.chat = async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) return res.status(400).json({ error: 'message required' });

    const reply = await chatWithAi({ message, context });
    res.json({ reply });
  } catch (err) {
    console.error('AI chat error', err);
    res.status(500).json({ error: 'AI chat failed' });
  }
};
