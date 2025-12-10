const express = require('express');
const router = express.Router();
const {
  getAllPricingRules,
  createPricingRule,
  updatePricingRule,
  deletePricingRule,
  toggleCourtStatus,
  toggleEquipmentStatus,
  toggleCoachStatus
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes and restrict to admin only
router.use(protect);
router.use(authorize('admin'));

// Pricing rules routes
router.get('/pricing-rules', getAllPricingRules);
router.post('/pricing-rules', createPricingRule);
router.put('/pricing-rules/:id', updatePricingRule);
router.delete('/pricing-rules/:id', deletePricingRule);

// Resource management routes
router.patch('/courts/:id/toggle', toggleCourtStatus);
router.patch('/equipment/:id/toggle', toggleEquipmentStatus);
router.patch('/coaches/:id/toggle', toggleCoachStatus);

module.exports = router;
