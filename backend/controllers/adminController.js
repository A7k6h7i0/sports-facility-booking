/**
 * Admin Controller
 * Handles HTTP requests for admin operations (pricing rules, resource management)
 */

const PricingRule = require('../models/PricingRule');
const Court = require('../models/Court');
const Equipment = require('../models/Equipment');
const Coach = require('../models/Coach');

/**
 * Get all pricing rules
 * GET /api/admin/pricing-rules
 */
const getAllPricingRules = async (req, res) => {
  try {
    const rules = await PricingRule.find().sort({ priority: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rules.length,
      data: rules
    });
  } catch (error) {
    console.error('Error fetching pricing rules:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching pricing rules'
    });
  }
};

/**
 * Create a new pricing rule
 * POST /api/admin/pricing-rules
 */
const createPricingRule = async (req, res) => {
  try {
    const ruleData = req.body;

    const newRule = await PricingRule.create(ruleData);

    res.status(201).json({
      success: true,
      message: 'Pricing rule created successfully',
      data: newRule
    });
  } catch (error) {
    console.error('Error creating pricing rule:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create pricing rule'
    });
  }
};

/**
 * Update a pricing rule
 * PUT /api/admin/pricing-rules/:id
 */
const updatePricingRule = async (req, res) => {
  try {
    const updatedRule = await PricingRule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedRule) {
      return res.status(404).json({
        success: false,
        error: 'Pricing rule not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pricing rule updated successfully',
      data: updatedRule
    });
  } catch (error) {
    console.error('Error updating pricing rule:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update pricing rule'
    });
  }
};

/**
 * Delete a pricing rule
 * DELETE /api/admin/pricing-rules/:id
 */
const deletePricingRule = async (req, res) => {
  try {
    const rule = await PricingRule.findByIdAndDelete(req.params.id);

    if (!rule) {
      return res.status(404).json({
        success: false,
        error: 'Pricing rule not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pricing rule deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting pricing rule:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting pricing rule'
    });
  }
};

/**
 * Toggle court active status
 * PATCH /api/admin/courts/:id/toggle
 */
const toggleCourtStatus = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);

    if (!court) {
      return res.status(404).json({
        success: false,
        error: 'Court not found'
      });
    }

    court.isActive = !court.isActive;
    await court.save();

    res.status(200).json({
      success: true,
      message: `Court ${court.isActive ? 'activated' : 'deactivated'} successfully`,
      data: court
    });
  } catch (error) {
    console.error('Error toggling court status:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while toggling court status'
    });
  }
};

/**
 * Toggle equipment active status
 * PATCH /api/admin/equipment/:id/toggle
 */
const toggleEquipmentStatus = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        error: 'Equipment not found'
      });
    }

    equipment.isActive = !equipment.isActive;
    await equipment.save();

    res.status(200).json({
      success: true,
      message: `Equipment ${equipment.isActive ? 'activated' : 'deactivated'} successfully`,
      data: equipment
    });
  } catch (error) {
    console.error('Error toggling equipment status:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while toggling equipment status'
    });
  }
};

/**
 * Toggle coach active status
 * PATCH /api/admin/coaches/:id/toggle
 */
const toggleCoachStatus = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);

    if (!coach) {
      return res.status(404).json({
        success: false,
        error: 'Coach not found'
      });
    }

    coach.isActive = !coach.isActive;
    await coach.save();

    res.status(200).json({
      success: true,
      message: `Coach ${coach.isActive ? 'activated' : 'deactivated'} successfully`,
      data: coach
    });
  } catch (error) {
    console.error('Error toggling coach status:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while toggling coach status'
    });
  }
};

module.exports = {
  getAllPricingRules,
  createPricingRule,
  updatePricingRule,
  deletePricingRule,
  toggleCourtStatus,
  toggleEquipmentStatus,
  toggleCoachStatus
};
