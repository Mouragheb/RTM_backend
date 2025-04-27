const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
const Task = require('../models/Task');
const User = require('../models/User');

// Create Restaurant
exports.createRestaurant = async (req, res) => {
  try {
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    const { name, address } = req.body;
    let logoPath = req.file ? req.file.filename : ''; // <-- Save filename ONLY

    const restaurant = await Restaurant.create({
      name,
      address,
      logo: logoPath, // <- only filename stored
      manager: req.user.userId,
    });

    res.status(201).json({ message: 'Restaurant created', restaurantId: restaurant._id });
  } catch (err) {
    console.error('Error creating restaurant:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get My Restaurants
exports.getMyRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ manager: req.user.userId });
    res.status(200).json({ restaurants });
  } catch (err) {
    console.error('Get my restaurants error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Restaurant by Manager ID
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ _id: req.params.id, manager: req.user.userId });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json(restaurant);
  } catch (err) {
    console.error('Get restaurant by ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Restaurant by Employee ID (optional)
exports.getRestaurantByEmployee = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);

    if (!employee || !employee.restaurant) {
      return res.status(404).json({ message: 'Employee or restaurant not found' });
    }

    const restaurant = await Restaurant.findById(employee.restaurant);

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json({
      _id: restaurant._id,
      name: restaurant.name,
      address: restaurant.address,
      logo: restaurant.logo.replace(/\\/g, '/'),
    });
  } catch (err) {
    console.error('Get restaurant by employee error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Restaurant by Restaurant ID (clean employee dashboard route)
exports.getRestaurantByRestaurantId = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const restaurant = await Restaurant.findById(new mongoose.Types.ObjectId(restaurantId));

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json({
      _id: restaurant._id,
      name: restaurant.name,
      address: restaurant.address,
      logo: restaurant.logo.replace(/\\/g, '/'),
    });
  } catch (err) {
    console.error('Get restaurant by restaurant ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Restaurant
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ _id: req.params.id, manager: req.user.userId });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found or unauthorized' });
    }

    await restaurant.deleteOne();
    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (err) {
    console.error('Delete restaurant error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Tasks by Restaurant
exports.getTasksByRestaurant = async (req, res) => {
  try {
    const tasks = await Task.find({ restaurant: req.params.restaurantId })
      .populate('assignedTo', 'name')
      .populate('createdBy', 'name');

    res.status(200).json({ tasks });
  } catch (err) {
    console.error('Get tasks by restaurant error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};