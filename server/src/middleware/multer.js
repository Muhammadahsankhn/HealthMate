const multer = require('multer');
const path = require('path');

// Set up storage engine
const storage = multer.diskStorage({
  // (Optional) No destination — file goes to temp folder
  filename: function (req, file, cb) {
    // Generate unique filename using timestamp + original extension
    const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

module.exports = upload;
