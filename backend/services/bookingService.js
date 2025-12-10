/**
 * Booking Service
 * Handles complex booking logic with transactions
 */

const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');
const { checkMultiResourceAvailability } = require('./availabilityService');
const { calculateTotalPrice } = require('./pricingService');

/**
 * Create booking with transaction
 */
const createBookingWithTransaction = async (bookingData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('Creating booking with data:', {
      ...bookingData,
      hasCoach: !!bookingData.coachId
    });

    // Check availability
    const availabilityCheck = await checkMultiResourceAvailability({
      courtId: bookingData.courtId,
      startTime: new Date(bookingData.startTime),
      endTime: new Date(bookingData.endTime),
      equipment: bookingData.equipment || [],
      coachId: bookingData.coachId || null
    });

    console.log('Availability check result:', availabilityCheck);

    if (!availabilityCheck.available) {
      await session.abortTransaction();
      return {
        success: false,
        error: 'Booking not available',
        message: availabilityCheck.errors.join(', ')
      };
    }

    // Calculate pricing
    console.log('Calculating pricing...');
    const pricing = await calculateTotalPrice(bookingData);
    console.log('Pricing calculated:', pricing);

    // Prepare equipment array with pricePerHour for each item
    const equipmentWithPrices = [];
    if (bookingData.equipment && bookingData.equipment.length > 0) {
      for (const item of bookingData.equipment) {
        const equipmentItem = await Equipment.findById(item.equipmentId);
        if (equipmentItem) {
          equipmentWithPrices.push({
            equipmentId: item.equipmentId,
            quantity: item.quantity,
            pricePerHour: equipmentItem.pricePerHour
          });
        }
      }
    }

    // Prepare booking document
    const booking = new Booking({
      userId: bookingData.userId,
      court: bookingData.courtId,
      startTime: new Date(bookingData.startTime),
      endTime: new Date(bookingData.endTime),
      equipment: equipmentWithPrices,
      coach: {
        coachId: bookingData.coachId || null,
        pricePerHour: bookingData.coachId && pricing.coachDetails ? pricing.coachDetails.pricePerHour : 0
      },
      pricing: {
        courtBasePrice: pricing.courtBasePrice,
        courtMultiplier: pricing.courtMultiplier,
        courtPrice: pricing.courtPrice,
        equipmentPrice: pricing.equipmentPrice,
        coachPrice: pricing.coachPrice,
        subtotal: pricing.subtotal,
        tax: pricing.tax,
        totalPrice: pricing.totalPrice,
        appliedRules: pricing.appliedRules || []
      },
      customerName: bookingData.customerName,
      customerEmail: bookingData.customerEmail,
      customerPhone: bookingData.customerPhone,
      status: 'confirmed'
    });

    console.log('Saving booking...');
    await booking.save({ session });

    // Update equipment quantities (if any)
    if (bookingData.equipment && bookingData.equipment.length > 0) {
      for (const item of bookingData.equipment) {
        await Equipment.findByIdAndUpdate(
          item.equipmentId,
          { $inc: { availableQuantity: -item.quantity } },
          { session }
        );
      }
    }

    await session.commitTransaction();

    // Populate the booking before returning
    const populatedBooking = await Booking.findById(booking._id)
      .populate('court')
      .populate('equipment.equipmentId')
      .populate('coach.coachId');

    console.log('✅ Booking created successfully:', populatedBooking._id);

    return {
      success: true,
      booking: populatedBooking,
      message: 'Booking created successfully'
    };

  } catch (error) {
    await session.abortTransaction();
    console.error('❌ Transaction aborted:', error.message);
    return {
      success: false,
      error: error.message,
      message: 'Failed to create booking'
    };
  } finally {
    session.endSession();
  }
};

/**
 * Cancel a booking
 */
const cancelBooking = async (bookingId, userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      await session.abortTransaction();
      return {
        success: false,
        error: 'Booking not found'
      };
    }

    // Check if user owns this booking (unless admin)
    if (booking.userId !== userId) {
      await session.abortTransaction();
      return {
        success: false,
        error: 'Not authorized to cancel this booking'
      };
    }

    if (booking.status === 'cancelled') {
      await session.abortTransaction();
      return {
        success: false,
        error: 'Booking is already cancelled'
      };
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save({ session });

    // Restore equipment quantities
    if (booking.equipment && booking.equipment.length > 0) {
      for (const item of booking.equipment) {
        await Equipment.findByIdAndUpdate(
          item.equipmentId,
          { $inc: { availableQuantity: item.quantity } },
          { session }
        );
      }
    }

    await session.commitTransaction();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('court')
      .populate('equipment.equipmentId')
      .populate('coach.coachId');

    return {
      success: true,
      booking: populatedBooking,
      message: 'Booking cancelled successfully'
    };

  } catch (error) {
    await session.abortTransaction();
    console.error('Error cancelling booking:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to cancel booking'
    };
  } finally {
    session.endSession();
  }
};

module.exports = {
  createBookingWithTransaction,
  cancelBooking
};
