const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { generateToken } = require('../utils/generateToken');

exports.register = async (req, res) => {
    {
        try {
            const { username, email, password } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            

            bcrypt.genSalt(10, (err, salt) => {
                if (err) throw err;
                bcrypt.hash(password, salt, async (err, hash) => {
                    if (err) return res.send(err.message);
                    const newUser = await User.create({
                        username,
                        email,
                        password: hash
                    });
                    let token = generateToken(newUser);
                    res.cookie('token', token);
                    res.send("User registered successfully");
                });
            })
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }
}




exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                let token = generateToken(user);
                res.cookie('token', token);
                res.send("Login successful");
            } else {
                return res.status(400).json({ message: "Invalid credentials" });
            }
        })
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}