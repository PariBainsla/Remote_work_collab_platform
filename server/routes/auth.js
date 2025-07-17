// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();


const JWT_SECRET = process.env.JWT_SECRET;

// Signup Route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET);
    res.status(201).json({ token, user: { name: newUser.name, email: newUser.email } });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});


// Login Route
router.post('/login', async (req, res) => {
  console.log('Login Request Body:', req.body);

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log('User found:', user); // ✅ Debug user

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch); // ✅ Debug match

    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error('Server error:', err); // ✅ Print full error
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
