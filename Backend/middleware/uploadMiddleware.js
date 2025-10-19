const multer = require('multer');
const path = require('path');

// Use memory storage; we'll send buffer to Cloudinary via stream or upload
const storage = multer.memoryStorage();

// Allow images and pdfs, limit size to 10MB
const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
	fileFilter: (req, file, cb) => {
		// Accept common image types and PDFs. Some clients upload PDFs as application/octet-stream,
		// so allow that too when the filename ends with .pdf.
		const allowedExt = /\.(jpe?g|png|gif|pdf)$/i;
		const mimetype = (file.mimetype || '').toLowerCase();
		const ext = (path.extname(file.originalname) || '').toLowerCase();

		const isImage = mimetype.startsWith('image/');
		const isPdfMime = mimetype === 'application/pdf';
		const isOctet = mimetype === 'application/octet-stream';
		const extOk = allowedExt.test(ext);

		if ((isImage && extOk) || (isPdfMime && extOk) || (isOctet && ext === '.pdf')) {
			return cb(null, true);
		}

		return cb(new Error('Unsupported file type. Allowed: images and PDF.'), false);
	}
});

module.exports = upload;
