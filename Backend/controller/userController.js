const File = require('../models/file');
const AiInsight = require('../models/aiInsight');
const Vital = require('../models/vital');

exports.getReports = async (req, res) => {
  try {
    const files = await File.find({ userId: req.user.userId }).sort({ uploadedAt: -1 });
    // Populate insights
    const reports = [];
    for (const f of files) {
      const insight = await AiInsight.findOne({ fileId: f._id });
      reports.push({ file: f, insight });
    }
    res.json({ reports });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch reports' });
  }
};

exports.getVitals = async (req, res) => {
  try {
    const vitals = await Vital.find({ userId: req.user.userId }).sort({ date: -1 });
    res.json({ vitals });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch vitals' });
  }
};
