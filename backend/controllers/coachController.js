/**
 * Coach Controller
 * Handles HTTP requests for coach-related operations
 */

const Coach = require('../models/Coach');

/**
 * Get all coaches (optionally filter by active status or specialization)
 * GET /api/coaches
 */
const getAllCoaches = async (req, res) => {
  try {
    const { active, specialization } = req.query;
    
    let query = {};
    if (active !== undefined) {
      query.isActive = active === 'true';
    }
    if (specialization) {
      query.specialization = new RegExp(specialization, 'i');
    }

    const coaches = await Coach.find(query).sort({ specialization: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: coaches.length,
      data: coaches
    });
  } catch (error) {
    console.error('Error fetching coaches:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching coaches'
    });
  }
};

/**
 * Get single coach by ID
 * GET /api/coaches/:id
 */
const getCoachById = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);

    if (!coach) {
      return res.status(404).json({
        success: false,
        error: 'Coach not found'
      });
    }

    res.status(200).json({
      success: true,
      data: coach
    });
  } catch (error) {
    console.error('Error fetching coach:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching coach'
    });
  }
};

module.exports = {
  getAllCoaches,
  getCoachById
};
