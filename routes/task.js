const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  createTask,
  getMyTasks,
  getTasksByEmployeeId,
  markTaskCompleteWithPhoto,
  deleteTask,
  getTasksByRestaurant,
} = require('../controllers/taskController');

// Manager routes
router.post('/create', protect, restrictTo('manager'), upload.single('photo'), createTask);
router.get('/restaurant/:restaurantId', protect, restrictTo('manager'), getTasksByRestaurant);
router.delete('/:id', protect, restrictTo('manager'), deleteTask);

// Employee routes
router.get('/my-tasks', protect, restrictTo('employee'), getMyTasks);
router.get('/employee/:employeeId', protect, restrictTo('manager', 'employee'), getTasksByEmployeeId);
router.put('/:id/complete', protect, restrictTo('employee'), upload.single('photo'), markTaskCompleteWithPhoto);

module.exports = router;