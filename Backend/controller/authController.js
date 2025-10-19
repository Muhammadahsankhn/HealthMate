const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.status(201).json({ message: 'Registered', userId: user._id });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  console.log('[authController.login] incoming login attempt', { email: String(email).slice(0, 100), hasPassword: !!password });
  console.log('[authController.login] ADMIN_EMAIL set?', !!process.env.ADMIN_EMAIL, 'JWT_SECRET set?', !!process.env.JWT_SECRET);
  try {
    // allow environment admin as well
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      let secret = process.env.JWT_SECRET;
      if (!secret && process.env.NODE_ENV !== 'production') {
        // dev fallback - do not use in production
        secret = 'dev_jwt_secret_fallback';
        console.warn('Using dev fallback JWT secret for admin login');
      }
      if (!secret) {
        return res.status(500).json({ error: 'JWT_SECRET not configured on server' });
      }
      const token = jwt.sign({ role: 'admin', email }, secret, { expiresIn: '7d' });
      return res.json({ token, role: 'admin' });
    }

  const user = await User.findOne({ email });
  console.log('[authController.login] User lookup result:', !!user);
  if (!user) return res.status(404).json({ error: 'User not found' });
    const match = await bcrypt.compare(password, user.password);
  console.log('[authController.login] password compare result:', !!match);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    let secret = process.env.JWT_SECRET;
    if (!secret && process.env.NODE_ENV !== 'production') {
      secret = 'dev_jwt_secret_fallback';
      console.warn('Using dev fallback JWT secret for user login');
    }
    if (!secret) return res.status(500).json({ error: 'JWT_SECRET not configured on server' });
    const token = jwt.sign({ userId: user._id, email: user.email }, secret, { expiresIn: '7d' });
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error('authController.login error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};
