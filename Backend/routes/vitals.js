const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { addVital, getVitals } = require('../controller/vitalsController');

router.post('/add', auth, addVital);
router.get('/', auth, getVitals);

module.exports = router;
