const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path'); // <-- ADD THIS LINE

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // <-- UPDATED LINE

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const taskRoutes = require('./routes/task');
app.use('/api/tasks', taskRoutes);

const restaurantRoutes = require('./routes/restaurant');
app.use('/api/restaurants', restaurantRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('RTM API running');
});

// Start Server
const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URI, {
  dbName: 'rtm_app',
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));