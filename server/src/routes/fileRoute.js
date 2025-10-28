const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const uploadReport = require('../controllers/fileController');


router.post('/uploadReport', upload.single('file'), uploadReport.uploadReport);

module.exports = router;