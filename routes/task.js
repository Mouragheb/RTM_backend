const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const {
  createTask,
  getMyTasks,
  markTaskCompleteWithPhoto,
  deleteTask,
  getTasksByRestaurant,
  getTasksByEmployeeId,
} = require('../controllers/taskController');

// GET tasks by restaurant (for manager dashboard)
router.get(
  '/restaurant/:restaurantId',
  protect,
  restrictTo('manager'),
  getTasksByRestaurant
);

// GET tasks by employeeId (optional if needed later)
router.get(
  '/employee/:employeeId',
  protect,
  restrictTo('manager', 'employee'),
  getTasksByEmployeeId
);

// POST new task (manager uploads "photoBefore")
router.post(
  '/create',
  protect,
  restrictTo('manager'),
  upload.single('photo'), // expects 'photo' as field name
  createTask
);

// GET tasks for current logged-in employee
router.get(
  '/my-tasks',
  protect,
  restrictTo('employee'),
  getMyTasks
);

// PUT task complete with optional "photoAfter" upload
router.put(
  '/:id/complete',
  protect,
  restrictTo('employee'),
  upload.single('photo'),
  markTaskCompleteWithPhoto
);

// DELETE task
router.delete(
  '/:id',
  protect,
  restrictTo('manager'),
  deleteTask
);

module.exports = router;