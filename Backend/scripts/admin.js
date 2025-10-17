// scripts/seedAdmin.js
const bcrypt = require('bcrypt');
const User = require('../models/user'); // adjust path
require('dotenv').config();

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingAdmin) {
      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await User.create({
      first_name: 'Admin',
      last_name: 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Admin seeded securely');
  } catch (err) {
    console.error('❌ Error seeding admin:', err);
  }
};

module.exports = seedAdmin;
