const express = require('express');
const router = express.Router();
const { addVitals, getVitalsById } = require('../controllers/vitalControllers');
const { protect } = require("../middleware/authMiddleware");


router.post('/addVitals', protect, addVitals);
router.get("/allVitals", protect, getVitalsById);

module.exports = router;