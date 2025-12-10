/**
 * Booking Model
 * Represents a complete booking with court, equipment, coach, and pricing details
 */

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  court: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Court',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  equipment: [{
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    pricePerHour: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  coach: {
    coachId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coach',
      default: null
    },
    pricePerHour: {
      type: Number,
      default: 0
    }
  },
  pricing: {
    courtBasePrice: {
      type: Number,
      required: true
    },
    courtMultiplier: {
      type: Number,
      default: 1
    },
    courtPrice: {
      type: Number,
      required: true
    },
    equipmentPrice: {
      type: Number,
      default: 0
    },
    coachPrice: {
      type: Number,
      default: 0
    },
    subtotal: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      required: true
    },
    appliedRules: [{
      name: String,
      multiplier: Number,
      description: String
    }]
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true
  },
  customerPhone: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
bookingSchema.index({ court: 1, startTime: 1, endTime: 1 });
bookingSchema.index({ 'coach.coachId': 1, startTime: 1, endTime: 1 });
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
