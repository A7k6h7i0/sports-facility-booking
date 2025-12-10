/**
 * Booking Controller
 * Handles HTTP requests for booking operations
 */

const Booking = require('../models/Booking');
const { createBookingWithTransaction, cancelBooking } = require('../services/bookingService');
const { checkMultiResourceAvailability } = require('../services/availabilityService');

/**
 * Create a new booking
 * POST /api/bookings
 */
const createBooking = async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      userId: req.user.id, // Use authenticated user's ID
      customerName: req.body.customerName || req.user.name,
      customerEmail: req.body.customerEmail || req.user.email,
      customerPhone: req.body.customerPhone || req.user.phone
    };

    // Validation
    const requiredFields = ['courtId', 'startTime', 'endTime'];
    const missingFields = requiredFields.filter(field => !bookingData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Create booking with transaction
    const result = await createBookingWithTransaction(bookingData);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }

    res.status(201).json({
      success: true,
      message: result.message,
      data: result.booking
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while creating booking'
    });
  }
};

/**
 * Get all bookings for current user
 * GET /api/bookings
 */
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('court')
      .populate('equipment.equipmentId')
      .populate('coach.coachId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });

  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching bookings'
    });
  }
};

/**
 * Get all bookings (Admin only)
 * GET /api/bookings/all
 */
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('court')
      .populate('equipment.equipmentId')
      .populate('coach.coachId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });

  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching bookings'
    });
  }
};

/**
 * Get booking by ID
 * GET /api/bookings/:id
 */
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('court')
      .populate('equipment.equipmentId')
      .populate('coach.coachId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if user owns this booking or is admin
    if (booking.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching booking'
    });
  }
};

/**
 * Cancel a booking
 * PUT /api/bookings/:id/cancel
 */
const cancelBookingById = async (req, res) => {
  try {
    const result = await cancelBooking(req.params.id, req.user.id);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.booking
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while cancelling booking'
    });
  }
};

/**
 * Check availability for booking
 * POST /api/bookings/check-availability
 */
const checkAvailability = async (req, res) => {
  try {
    const { courtId, startTime, endTime, equipment, coachId } = req.body;

    if (!courtId || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: courtId, startTime, endTime'
      });
    }

    const availabilityCheck = await checkMultiResourceAvailability({
      courtId,
      startTime,
      endTime,
      equipment: equipment || [],
      coachId: coachId || null
    });

    res.status(200).json({
      success: true,
      data: availabilityCheck
    });

  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while checking availability'
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBookingById,
  cancelBookingById,
  checkAvailability
};
