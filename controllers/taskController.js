const Task = require('../models/Task');

// Create a new task (Manager only)
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, frequency, dueDate, restaurant } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo,
      frequency,
      dueDate,
      createdBy: req.user.userId,
      restaurant,
      photoBefore: req.file ? req.file.path : '', // save to photoBefore
      status: 'open',
    });

    res.status(201).json({ message: 'Task created', task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get tasks assigned to logged-in employee
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.userId });
    res.status(200).json({ tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Employee marks their task as complete (optionally with photo)
exports.markTaskCompleteWithPhoto = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Ensure only the assigned employee can complete it
    if (task.assignedTo.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to complete this task' });
    }

    // Save uploaded image as "after" photo
    if (req.file) {
      task.photoAfter = req.file.path;
    }

    task.completed = true;
    task.status = 'completed';
    task.completedAt = new Date();

    await task.save();

    res.status(200).json({ message: 'Task marked as completed', task });
  } catch (err) {
    console.error('Error completing task:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
// Get all tasks for a specific restaurant
exports.getTasksByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const tasks = await Task.find({ restaurant: restaurantId })
      .populate('assignedTo', 'name') // include employee name
      .populate('createdBy', 'name'); // optionally include manager name

    res.status(200).json({ tasks });
  } catch (err) {
    console.error('Error fetching tasks by restaurant:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTasksByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const tasks = await Task.find({ assignedTo: employeeId })
      .populate('createdBy', 'name')
      .populate('restaurant', 'name');

    res.status(200).json({ tasks });
  } catch (err) {
    console.error('Error fetching tasks by employee ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ message: 'Server error' });
  }
};