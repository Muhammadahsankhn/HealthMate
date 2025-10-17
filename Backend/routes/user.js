const express = require('express');
const router = express.Router();
const { registerUser } = require('../controller/user');
const { login } = require('../controller/auth');

router.post('/register', registerUser);
router.post('/login', login);

module.exports = router;
