const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBookingById,
  cancelBookingById,
  checkAvailability
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes - require authentication
router.use(protect);

// IMPORTANT: Place /all BEFORE /:id to avoid route conflict
router.get('/all', authorize('admin'), getAllBookings); // Admin only - MUST BE FIRST
router.post('/check-availability', checkAvailability);
router.post('/', createBooking);
router.get('/', getUserBookings);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBookingById);

module.exports = router;
