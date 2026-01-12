const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { addVitals, getUserVitals, getVitalById } = require('../controllers/vitalControllers');

if(!addVitals) console.log("singular vital not found")
if(!getUserVitals) console.log("singular vital not found")
if(!getVitalById) console.log("singular vital not found")
router.post('/addVitals', protect, addVitals);
router.get("/allVitals", protect, getUserVitals);
router.get('/:id', protect, getVitalById);


module.exports = router;