/**
 * Equipment Model
 * Represents rentable equipment with quantity tracking
 */

const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    enum: ['racket', 'shoes', 'ball', 'protective_gear', 'other']
  },
  pricePerHour: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  availableQuantity: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Ensure available quantity never exceeds total
equipmentSchema.pre('save', function(next) {
  if (this.availableQuantity > this.totalQuantity) {
    this.availableQuantity = this.totalQuantity;
  }
  next();
});

equipmentSchema.index({ isActive: 1, category: 1 });

module.exports = mongoose.model('Equipment', equipmentSchema);
