const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: { type: String, enum: ['manager', 'employee'], default: 'employee' },
  joinCode: String,
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
  }
});

module.exports = mongoose.model('User', userSchema);