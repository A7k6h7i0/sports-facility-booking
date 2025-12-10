/**
 * Pricing Controller
 * Handles HTTP requests for pricing operations
 */

const { getPriceEstimate } = require('../services/pricingService');

/**
 * Get price estimate for a booking
 * POST /api/pricing/estimate
 */
const estimatePrice = async (req, res) => {
  try {
    const bookingData = req.body;

    // Validation
    const requiredFields = ['courtId', 'startTime', 'endTime'];
    const missingFields = requiredFields.filter(field => !bookingData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const pricing = await getPriceEstimate(bookingData);

    res.status(200).json({
      success: true,
      data: pricing
    });

  } catch (error) {
    console.error('Error estimating price:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while calculating price'
    });
  }
};

module.exports = {
  estimatePrice
};
