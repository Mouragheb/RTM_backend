const Task = require('../models/Task');

// Create Task
// Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, restaurantId, assignedTo, frequency, dueDate } = req.body;
    const photoBefore = req.file ? req.file.filename : '';

    const task = await Task.create({
      title,
      description,
      restaurant: restaurantId,
      assignedTo,
      frequency,
      dueDate,
      createdBy: req.user.userId,
      photoBefore,
      status: 'open',       // <-- added default status
      completed: false,     // <-- added default completed flag
    });

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (err) {
    console.error('Error creating task:', err);
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

// Get Tasks by Employee ID
exports.getTasksByEmployeeId = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.employeeId });
    res.status(200).json({ tasks });
  } catch (err) {
    console.error('Get tasks by employee ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get My Tasks
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.userId });
    res.status(200).json({ tasks });
  } catch (err) {
    console.error('Get my tasks error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark Task Complete with Photo
exports.markTaskCompleteWithPhoto = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if a photo is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No photo uploaded' });
    }

    task.photoAfter = req.file.filename; // <-- Save filename
    task.status = 'completed';
    task.completed = true;
    task.completedAt = new Date();

    await task.save();

    res.status(200).json({ message: 'Task marked as complete', task });
  } catch (err) {
    console.error('Error marking task complete:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};