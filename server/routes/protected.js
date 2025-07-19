// server/routes/protected.js
const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');

router.get('/dashboard', authenticateUser, (req, res) => {
  res.json({ message: `Welcome ${req.user.id}, this is a protected dashboard.` });
});

module.exports = router;
