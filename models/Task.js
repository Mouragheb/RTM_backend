const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  frequency: { type: String, enum: ['once', 'daily', 'weekly'], default: 'once' },
  dueDate: Date,
  status: { type: String, enum: ['open', 'in progress', 'completed'], default: 'open' },
  photoBefore: String,  // Manager uploaded image
  photoAfter: String,   // Employee uploaded completion proof
  completed: { type: Boolean, default: false },
  completedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);