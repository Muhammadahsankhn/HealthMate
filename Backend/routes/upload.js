const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const auth = require('../middleware/authMiddleware');
const { upload: uploadController } = require('../controller/uploadController');

// Wrap multer so we can return JSON errors instead of HTML stack traces
router.post('/', auth, (req, res, next) => {
	upload.single('file')(req, res, function (err) {
		if (err) {
			console.error('Multer error:', err && err.message ? err.message : err);
			return res.status(400).json({ error: err.message || 'File upload error' });
		}
		next();
	});
}, uploadController);

module.exports = router;
