const express = require('express');
const router = express.Router();
const { uploadReport, chatWithAIResponse } = require('../controllers/fileController');
const { protect } = require("../middleware/authMiddleware");
const upload = require('../middleware/multer');

// Upload and Analyze
router.post('/uploadReport', protect, upload.single('file'), uploadReport);


// Chat with AI
router.post('/chat', protect, chatWithAIResponse);

module.exports = router;
