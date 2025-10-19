const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { analyze, chat } = require('../controller/aiController');

// Upload report for AI analysis
router.post('/analyze', auth, upload.single('file'), analyze);

// Chat route (text-based)
router.post('/chat', auth, chat);

module.exports = router;
