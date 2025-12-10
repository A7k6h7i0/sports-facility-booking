/**
 * Court Model
 * Represents a sports court (indoor/outdoor) with availability status
 */

const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['indoor', 'outdoor'],
    required: true
  },
  sport: {
    type: String,
    required: true,
    trim: true,
    // e.g., 'Tennis', 'Badminton', 'Basketball'
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0,
    // Base price per hour (used as reference, actual pricing is dynamic)
  },
  isActive: {
    type: Boolean,
    default: true
  },
  capacity: {
    type: Number,
    default: 1,
    // Number of simultaneous bookings allowed (usually 1)
  },
  description: {
    type: String,
    default: ''
  },
  amenities: [{
    type: String
  }]
}, {
  timestamps: true
});

// Index for faster queries
courtSchema.index({ type: 1, isActive: 1 });

module.exports = mongoose.model('Court', courtSchema);
