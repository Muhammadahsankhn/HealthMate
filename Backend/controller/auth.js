const bcrypt = require('bcrypt');
const User = require('../models/user'); // your mongoose model

// Environment-based secure admin credentials
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Admin login (not stored in DB)
        if (email === ADMIN_EMAIL) {
            if (password === ADMIN_PASSWORD) {
                return res.status(200).json({ message: 'Admin login successful', role: 'admin' });
            } else {
                return res.status(401).json({ error: 'Invalid admin credentials' });
            }
        }

        // For student/teacher login
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

        res.status(200).json({
            message: 'Login successful',
            user_id: user._id,
            role: user.role,
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    login,
};
