const mongoose = require('mongoose');

const aiInsightSchema = new mongoose.Schema({
  fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: true },
  englishSummary: { type: String },
  romanUrduSummary: { type: String },
  highlights: { type: [String], default: [] },
  doctorQuestions: { type: [String], default: [] },
  dietTips: { type: [String], default: [] },
  homeRemedies: { type: [String], default: [] }
  ,disclaimer: { type: String }
  ,summary: { type: String }
  ,fullAnswerEnglish: { type: String }
  ,fullAnswerRoman: { type: String }
});

module.exports = mongoose.model('AiInsight', aiInsightSchema);
