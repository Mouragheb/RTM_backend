const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  createRestaurant,
  getMyRestaurants,
  getRestaurantById,
  getRestaurantByEmployee,
  getRestaurantByRestaurantId,
  deleteRestaurant,
  getTasksByRestaurant,
} = require('../controllers/restaurantController');

// Manager routes
router.post('/create', protect, restrictTo('manager'), upload.single('logo'), createRestaurant);
router.get('/my-restaurants', protect, restrictTo('manager'), getMyRestaurants);

// Employee routes
router.get('/by-id/:restaurantId', protect, getRestaurantByRestaurantId);
router.get('/employee/:id', protect, getRestaurantByEmployee);

// Task route
router.get('/tasks/:restaurantId', protect, getTasksByRestaurant);

// Manager routes (must be LAST)
router.get('/:id', protect, restrictTo('manager'), getRestaurantById);
router.delete('/:id', protect, restrictTo('manager'), deleteRestaurant);

module.exports = router;