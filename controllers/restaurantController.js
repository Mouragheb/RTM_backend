// controllers/restaurantController.js
const Restaurant = require('../models/Restaurant');

exports.createRestaurant = async (req, res) => {
  try {
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    const { name, address } = req.body;
    let logoPath = req.file ? req.file.path : '';

    const restaurant = await Restaurant.create({
      name,
      address,
      logo: logoPath,
      manager: req.user.userId, // <-- THIS is critical
    });

    res.status(201).json({ message: 'Restaurant created', restaurantId: restaurant._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getMyRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ manager: req.user.userId }); // This must match your schema field exactly
    res.status(200).json({ restaurants }); // It must return { restaurants: [...] }
  } catch (err) {
    console.error("getMyRestaurants error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get one restaurant by ID (for dashboard view)
// Get one restaurant by ID (for dashboard view)
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      _id: req.params.id,
      manager: req.user.userId,
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.status(200).json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      _id: req.params.id,
      manager: req.user.userId,
    });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found or unauthorized' });
    }

    await restaurant.deleteOne();
    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (err) {
    console.error('Error deleting restaurant:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getTasksByRestaurant = async (req, res) => {
  try {
    const tasks = await Task.find({ restaurant: req.params.restaurantId })
      .populate('assignedTo', 'name') // populate employee name
      .populate('createdBy', 'name'); // populate manager name
    res.status(200).json({ tasks });
  } catch (err) {
    console.error('Error fetching tasks by restaurant:', err);
    res.status(500).json({ message: 'Server error' });
  }
};