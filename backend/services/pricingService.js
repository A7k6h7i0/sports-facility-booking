/**
 * Pricing Service
 * Calculates dynamic pricing based on rules
 */

const PricingRule = require('../models/PricingRule');
const Court = require('../models/Court');
const Equipment = require('../models/Equipment');
const Coach = require('../models/Coach');

/**
 * Calculate total price for a booking
 */
const calculateTotalPrice = async (bookingData) => {
  try {
    const { courtId, startTime, endTime, equipment = [], coachId } = bookingData;

    // Calculate duration in hours
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end - start;
    const durationHours = durationMs / (1000 * 60 * 60);

    if (durationHours <= 0) {
      throw new Error('Invalid booking duration');
    }

    // Get court base price
    const court = await Court.findById(courtId);
    if (!court) {
      throw new Error('Court not found');
    }

    let courtBasePrice = court.basePrice * durationHours;

    // Get active pricing rules
    const pricingRules = await PricingRule.find({ isActive: true }).sort({ priority: -1 });

    // Apply pricing rules
    let courtMultiplier = 1;
    const appliedRules = [];

    for (const rule of pricingRules) {
      if (isRuleApplicable(rule, court, start)) {
        courtMultiplier *= rule.multiplier;
        appliedRules.push({
          name: rule.name,
          multiplier: rule.multiplier,
          description: rule.description
        });
      }
    }

    const courtPrice = courtBasePrice * courtMultiplier;

    // Calculate equipment price
    let equipmentPrice = 0;
    const equipmentDetails = [];

    for (const item of equipment) {
      const equipmentItem = await Equipment.findById(item.equipmentId);
      if (equipmentItem) {
        const itemPrice = equipmentItem.pricePerHour * item.quantity * durationHours;
        equipmentPrice += itemPrice;
        equipmentDetails.push({
          name: equipmentItem.name,
          quantity: item.quantity,
          pricePerHour: equipmentItem.pricePerHour,
          totalPrice: itemPrice
        });
      }
    }

    // Calculate coach price
    let coachPrice = 0;
    let coachDetails = null;

    if (coachId) {
      const coach = await Coach.findById(coachId);
      if (coach) {
        coachPrice = coach.pricePerHour * durationHours;
        coachDetails = {
          name: coach.name,
          pricePerHour: coach.pricePerHour,
          totalPrice: coachPrice
        };
      }
    }

    // Calculate totals
    const subtotal = courtPrice + equipmentPrice + coachPrice;
    const tax = subtotal * 0.18; // 18% GST
    const totalPrice = subtotal + tax;

    return {
      courtBasePrice,
      courtMultiplier,
      courtPrice,
      equipmentPrice,
      coachPrice,
      subtotal,
      tax,
      totalPrice,
      durationHours,
      appliedRules,
      equipmentDetails,
      coachDetails
    };
  } catch (error) {
    console.error('Error calculating price:', error);
    throw error;
  }
};

/**
 * Check if a pricing rule applies to a booking
 */
const isRuleApplicable = (rule, court, bookingDate) => {
  const conditions = rule.applicableConditions;

  // Check court type
  if (conditions.courtTypes && conditions.courtTypes.length > 0) {
    if (!conditions.courtTypes.includes(court.type)) {
      return false;
    }
  }

  // Check day of week
  const dayOfWeek = bookingDate.getDay();
  if (conditions.daysOfWeek && conditions.daysOfWeek.length > 0) {
    if (!conditions.daysOfWeek.includes(dayOfWeek)) {
      return false;
    }
  }

  // Check time range
  if (conditions.timeRanges && conditions.timeRanges.length > 0) {
    const bookingTime = bookingDate.toTimeString().slice(0, 5); // "HH:MM"
    let inTimeRange = false;
    
    for (const range of conditions.timeRanges) {
      if (bookingTime >= range.startTime && bookingTime <= range.endTime) {
        inTimeRange = true;
        break;
      }
    }
    
    if (!inTimeRange) {
      return false;
    }
  }

  // Check date range
  if (conditions.dateRanges && conditions.dateRanges.length > 0) {
    const bookingDateOnly = bookingDate.toISOString().split('T')[0];
    let inDateRange = false;
    
    for (const range of conditions.dateRanges) {
      const startDate = new Date(range.startDate).toISOString().split('T')[0];
      const endDate = new Date(range.endDate).toISOString().split('T')[0];
      
      if (bookingDateOnly >= startDate && bookingDateOnly <= endDate) {
        inDateRange = true;
        break;
      }
    }
    
    if (!inDateRange) {
      return false;
    }
  }

  return true;
};

/**
 * Get price estimate (for frontend preview)
 */
const getPriceEstimate = async (bookingData) => {
  try {
    return await calculateTotalPrice(bookingData);
  } catch (error) {
    console.error('Error getting price estimate:', error);
    throw error;
  }
};

module.exports = {
  calculateTotalPrice,
  getPriceEstimate,
  isRuleApplicable
};
