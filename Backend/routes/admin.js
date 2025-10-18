const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole } = require('../controller/admin');

// Admin routes
router.get('/admin/users', getAllUsers);
router.put('/admin/users/:id/role', updateUserRole);

module.exports = router;

