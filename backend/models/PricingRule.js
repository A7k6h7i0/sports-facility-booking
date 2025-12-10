/**
 * PricingRule Model
 * Dynamic pricing rules that can stack (peak hours, weekends, indoor premium, etc.)
 * Rules are evaluated by the pricing engine to calculate final booking cost
 */

const mongoose = require('mongoose');

const pricingRuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    default: ''
  },
  ruleType: {
    type: String,
    required: true,
    enum: ['peak_hour', 'weekend', 'indoor_premium', 'seasonal', 'custom'],
    // Different types of pricing rules
  },
  multiplier: {
    type: Number,
    required: true,
    min: 0,
    default: 1,
    // 1.5 = 50% increase, 0.8 = 20% discount
  },
  applicableConditions: {
    // Conditions when this rule applies
    courtTypes: [{
      type: String,
      enum: ['indoor', 'outdoor']
    }],
    daysOfWeek: [{
      type: Number,
      min: 0,
      max: 6
      // 0 = Sunday, 6 = Saturday
    }],
    timeRanges: [{
      startTime: String, // "HH:mm" format
      endTime: String    // "HH:mm" format
    }],
    dateRanges: [{
      startDate: Date,
      endDate: Date
    }]
  },
  priority: {
    type: Number,
    default: 0,
    // Higher priority rules are applied first (for display purposes)
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

pricingRuleSchema.index({ isActive: 1, priority: -1 });

module.exports = mongoose.model('PricingRule', pricingRuleSchema);
