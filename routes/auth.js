const express = require('express');
const router = express.Router();
const { register, login, getEmployees, deleteEmployee } = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Email verification route
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).send('Invalid verification link');

    if (user.isVerified) {
      return res.send('Email already verified.');
    }

    user.isVerified = true;
    await user.save();

    res.send('Email successfully verified! You can now log in.');
  } catch (err) {
    console.error('Email verification error:', err);
    res.status(400).send('Invalid or expired token.');
  }
});

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Employee management
router.get('/employees', protect, restrictTo('manager'), getEmployees);
router.delete('/employees/:id', protect, restrictTo('manager'), deleteEmployee);

module.exports = router;