const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configure cloudinary if available
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Ensure local uploads dir exists for fallback
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
try {
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
} catch (e) {
  console.warn('Could not ensure uploads directory exists', e && e.message ? e.message : e);
}

/**
 * uploadBuffer: upload a buffer to Cloudinary if configured, otherwise write locally and return
 * a Cloudinary-like result object { secure_url, public_id, format, bytes }
 * options may include: originalname, mimetype
 */
const uploadBuffer = async (buffer, options = {}) => {
  // If Cloudinary is configured, use it
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  // Fallback: write file locally and return a minimal result object
  // Derive extension from originalname or mimetype
  const original = options.originalname || 'upload';
  const mimetype = options.mimetype || '';
  let ext = path.extname(original);
  if (!ext) {
    if (mimetype === 'application/pdf') ext = '.pdf';
    else if (mimetype.startsWith('image/')) {
      const map = { 'image/jpeg': '.jpg', 'image/jpg': '.jpg', 'image/png': '.png', 'image/gif': '.gif' };
      ext = map[mimetype] || '.bin';
    } else {
      ext = '.bin';
    }
  }

  const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
  const outPath = path.join(UPLOADS_DIR, filename);

  await fs.promises.writeFile(outPath, buffer);

  const baseUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
  return {
    secure_url: `${baseUrl}/uploads/${filename}`,
    public_id: filename.replace(ext, ''),
    format: ext.replace('.', ''),
    bytes: buffer.length,
  };
};

module.exports = { uploadBuffer };
