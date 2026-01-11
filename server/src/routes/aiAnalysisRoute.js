const express = require('express');
const router = express.Router();
const { uploadReport, getFile, getFileById } = require('../controllers/fileController');
const { protect } = require("../middleware/authMiddleware");
const upload = require('../middleware/multer');

// Upload and Analyze
router.post('/uploadReport', protect, upload.single('file'), uploadReport);
router.get('/uploaded', protect, getFile)
router.get('/:id', protect, getFileById);

// // Chat with AI
// router.post('/chit', protect, chatWithAIResponse);

module.exports = router;
