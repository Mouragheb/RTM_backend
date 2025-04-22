const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  createRestaurant,
  getMyRestaurants,
  getRestaurantById
} = require('../controllers/restaurantController');

const { deleteRestaurant } = require('../controllers/restaurantController');
router.delete(
  '/:id',
  protect,
  restrictTo('manager'),
  deleteRestaurant
);

// POST /api/restaurants/create - Create a new restaurant
router.post(
  '/create',
  protect,
  restrictTo('manager'),
  upload.single('logo'),
  createRestaurant
);

// GET /api/restaurants/my-restaurants - Get all restaurants for the logged-in manager
router.get(
  '/my-restaurants',
  protect,
  restrictTo('manager'),
  getMyRestaurants
);

// GET /api/restaurants/:id - Get one specific restaurant by ID (must belong to manager)
router.get(
  '/:id',
  protect,
  restrictTo('manager'),
  getRestaurantById
);



module.exports = router;