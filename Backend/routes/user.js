const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getReports, getVitals } = require('../controller/userController');

router.get('/reports', auth, getReports);
router.get('/vitals', auth, getVitals);

module.exports = router;
