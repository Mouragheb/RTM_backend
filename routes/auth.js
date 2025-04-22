const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { getEmployees } = require('../controllers/authController');
const { deleteEmployee } = require('../controllers/authController');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
    console.error(err);
    res.status(400).send('Invalid or expired token.');
  }
});

router.delete(
  '/employees/:id',
  protect,
  restrictTo('manager'),
  deleteEmployee
);

router.post('/register', register);
router.post('/login', login);
router.get('/employees', protect, restrictTo('manager'), getEmployees);

module.exports = router;