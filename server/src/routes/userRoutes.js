const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/Auth');


router.get("/", (req, res) => {
    res.send("User route is working haha yoyo");
});

router.post("/register", register);
router.post("/login", login);

module.exports = router;