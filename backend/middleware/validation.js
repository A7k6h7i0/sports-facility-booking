/**
 * Input Validation Middleware
 * Validates request data before processing
 */

const { body, validationResult } = require('express-validator');

/**
 * Validate booking creation request
 */
const validateBooking = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('courtId').notEmpty().withMessage('Court ID is required'),
  body('startTime').isISO8601().withMessage('Valid start time is required'),
  body('endTime').isISO8601().withMessage('Valid end time is required'),
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('customerEmail').isEmail().withMessage('Valid email is required'),
  body('customerPhone').notEmpty().withMessage('Phone number is required'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

/**
 * Validate pricing rule creation
 */
const validatePricingRule = [
  body('name').notEmpty().withMessage('Rule name is required'),
  body('ruleType').isIn(['peak_hour', 'weekend', 'indoor_premium', 'seasonal', 'custom'])
    .withMessage('Invalid rule type'),
  body('multiplier').isFloat({ min: 0 }).withMessage('Multiplier must be a positive number'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = {
  validateBooking,
  validatePricingRule
};
