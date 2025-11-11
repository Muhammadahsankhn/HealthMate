const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { chat } = require("../controllers/chatController");

router.get('/', (req,res) => {
    res.send("Helo")
} )
// Chat with AI
router.post("/chat", protect, chat);

module.exports = router;