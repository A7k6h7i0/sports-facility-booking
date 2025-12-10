/**
 * Availability Service
 * Checks resource availability for bookings with timezone handling
 */

const Booking = require('../models/Booking');
const Court = require('../models/Court');
const Equipment = require('../models/Equipment');
const Coach = require('../models/Coach');

/**
 * Convert time string to minutes for comparison
 * @param {string} timeString - Time in "HH:MM" format
 * @returns {number} Total minutes
 */
const timeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Get local time string from Date object (handles timezone)
 * @param {Date} date - Date object
 * @returns {string} Time in "HH:MM" format in local timezone
 */
const getLocalTimeString = (date) => {
  const d = new Date(date);
  // Get hours and minutes in local timezone
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Check if a court is available for the given time slot
 */
const checkCourtAvailability = async (courtId, startTime, endTime, excludeBookingId = null) => {
  try {
    const court = await Court.findById(courtId);
    
    if (!court) {
      return { available: false, reason: 'Court not found' };
    }

    if (!court.isActive) {
      return { available: false, reason: 'Court is currently inactive' };
    }

    // Check for conflicting bookings
    const query = {
      court: courtId,
      status: { $in: ['confirmed', 'pending'] },
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
      ]
    };

    if (excludeBookingId) {
      query._id = { $ne: excludeBookingId };
    }

    const conflictingBooking = await Booking.findOne(query);

    if (conflictingBooking) {
      return { 
        available: false, 
        reason: 'Court already booked for this time slot',
        conflictingBooking 
      };
    }

    return { available: true, court };
  } catch (error) {
    console.error('Error checking court availability:', error);
    throw error;
  }
};

/**
 * Check if equipment items are available
 */
const checkEquipmentAvailability = async (equipmentRequests, startTime, endTime, excludeBookingId = null) => {
  try {
    if (!equipmentRequests || equipmentRequests.length === 0) {
      return { available: true, equipment: [] };
    }

    const unavailableItems = [];

    for (const request of equipmentRequests) {
      const equipment = await Equipment.findById(request.equipmentId);

      if (!equipment) {
        unavailableItems.push({
          id: request.equipmentId,
          reason: 'Equipment not found'
        });
        continue;
      }

      if (!equipment.isActive) {
        unavailableItems.push({
          id: request.equipmentId,
          name: equipment.name,
          reason: 'Equipment is currently inactive'
        });
        continue;
      }

      // Count equipment already booked in this time slot
      const query = {
        'equipment.equipmentId': request.equipmentId,
        status: { $in: ['confirmed', 'pending'] },
        $or: [
          { startTime: { $lt: endTime, $gte: startTime } },
          { endTime: { $gt: startTime, $lte: endTime } },
          { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
        ]
      };

      if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
      }

      const bookedEquipment = await Booking.find(query);
      
      const totalBooked = bookedEquipment.reduce((sum, booking) => {
        const item = booking.equipment.find(e => e.equipmentId.toString() === request.equipmentId.toString());
        return sum + (item ? item.quantity : 0);
      }, 0);

      const availableQuantity = equipment.availableQuantity - totalBooked;

      if (availableQuantity < request.quantity) {
        unavailableItems.push({
          id: request.equipmentId,
          name: equipment.name,
          requested: request.quantity,
          available: availableQuantity,
          reason: `Only ${availableQuantity} available`
        });
      }
    }

    if (unavailableItems.length > 0) {
      return {
        available: false,
        reason: 'Some equipment items are not available',
        unavailableItems
      };
    }

    return { available: true };
  } catch (error) {
    console.error('Error checking equipment availability:', error);
    throw error;
  }
};

/**
 * Check if a coach is available - FIXED with proper timezone handling
 */
// FIXED — Uses local day instead of UTC day
const checkCoachAvailability = async (coachId, startTime, endTime, excludeBookingId = null) => {
  try {
    if (!coachId) return { available: true };

    const coach = await Coach.findById(coachId);
    if (!coach) return { available: false, reason: "Coach not found" };
    if (!coach.isActive) return { available: false, reason: "Coach is inactive" };

    const bookingDate = new Date(startTime);

    // ✅ FIXED — use local day, not UTC
    const dayOfWeek = bookingDate.getDay();

    const dayAvailability = coach.availability.find(a => a.dayOfWeek === dayOfWeek);
    if (!dayAvailability) {
      return {
        available: false,
        reason: `Coach is not available on ${["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dayOfWeek]}`
      };
    }

    const bookingStartTime = getLocalTimeString(startTime);
    const bookingEndTime = getLocalTimeString(endTime);

    const bookingStartMinutes = timeToMinutes(bookingStartTime);
    const bookingEndMinutes = timeToMinutes(bookingEndTime);
    const coachStartMinutes = timeToMinutes(dayAvailability.startTime);
    const coachEndMinutes = timeToMinutes(dayAvailability.endTime);

    if (bookingStartMinutes < coachStartMinutes || bookingEndMinutes > coachEndMinutes) {
      return {
        available: false,
        reason: `Coach is only available from ${dayAvailability.startTime} to ${dayAvailability.endTime} on this day`
      };
    }

    // Check conflicting bookings
    const query = {
      "coach.coachId": coachId,
      status: { $in: ["confirmed", "pending"] },
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
      ]
    };
    if (excludeBookingId) query._id = { $ne: excludeBookingId };

    const conflict = await Booking.findOne(query);
    if (conflict) {
      return { available: false, reason: "Coach is already booked for this slot" };
    }

    return { available: true, coach };
  } catch (err) {
    console.error(err);
    throw err;
  }
};


/**
 * Check all resources for a booking
 */
const checkMultiResourceAvailability = async (bookingData, excludeBookingId = null) => {
  try {
    const { courtId, startTime, endTime, equipment, coachId } = bookingData;

    const results = {
      available: true,
      court: null,
      equipment: null,
      coach: null,
      errors: []
    };

    // Check court
    const courtCheck = await checkCourtAvailability(courtId, startTime, endTime, excludeBookingId);
    results.court = courtCheck;
    if (!courtCheck.available) {
      results.available = false;
      results.errors.push(courtCheck.reason);
    }

    // Check equipment
    if (equipment && equipment.length > 0) {
      const equipmentCheck = await checkEquipmentAvailability(equipment, startTime, endTime, excludeBookingId);
      results.equipment = equipmentCheck;
      if (!equipmentCheck.available) {
        results.available = false;
        results.errors.push(equipmentCheck.reason);
      }
    }

    // Check coach (only if coachId is provided)
    if (coachId) {
      const coachCheck = await checkCoachAvailability(coachId, startTime, endTime, excludeBookingId);
      results.coach = coachCheck;
      if (!coachCheck.available) {
        results.available = false;
        results.errors.push(coachCheck.reason);
      }
    } else {
      // If no coach requested, mark as available
      results.coach = { available: true };
    }

    return results;
  } catch (error) {
    console.error('Error checking multi-resource availability:', error);
    throw error;
  }
};

module.exports = {
  checkCourtAvailability,
  checkEquipmentAvailability,
  checkCoachAvailability,
  checkMultiResourceAvailability
};
