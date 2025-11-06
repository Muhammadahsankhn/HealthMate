const express= require('express');
const router= express.Router();
const { addVitals } = require('../controllers/vitalControllers');
const { protect } = require("../middleware/authMiddleware");


router.post('/addVitals', protect, addVitals);


module.exports= router;