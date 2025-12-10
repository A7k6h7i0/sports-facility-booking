/**
 * Coach Model
 * Represents a coach with availability windows and booking schedule
 */

const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialization: {
    type: String,
    required: true,
    trim: true,
    // e.g., 'Tennis', 'Badminton', 'Fitness'
  },
  pricePerHour: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  availability: [{
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6,
      // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    },
    startTime: {
      type: String,
      // Format: "HH:mm" (e.g., "09:00")
    },
    endTime: {
      type: String,
      // Format: "HH:mm" (e.g., "18:00")
    }
  }],
  bio: {
    type: String,
    default: ''
  },
  experience: {
    type: Number,
    default: 0,
    // Years of experience
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  }
}, {
  timestamps: true
});

coachSchema.index({ isActive: 1, specialization: 1 });

module.exports = mongoose.model('Coach', coachSchema);
