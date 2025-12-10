/**
 * Court Controller
 * Handles HTTP requests for court-related operations
 */

const Court = require('../models/Court');

/**
 * Get all courts (optionally filter by active status)
 * GET /api/courts
 */
const getAllCourts = async (req, res) => {
  try {
    const { active } = req.query;
    
    let query = {};
    if (active !== undefined) {
      query.isActive = active === 'true';
    }

    const courts = await Court.find(query).sort({ type: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: courts.length,
      data: courts
    });
  } catch (error) {
    console.error('Error fetching courts:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching courts'
    });
  }
};

/**
 * Get single court by ID
 * GET /api/courts/:id
 */
const getCourtById = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);

    if (!court) {
      return res.status(404).json({
        success: false,
        error: 'Court not found'
      });
    }

    res.status(200).json({
      success: true,
      data: court
    });
  } catch (error) {
    console.error('Error fetching court:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching court'
    });
  }
};

module.exports = {
  getAllCourts,
  getCourtById
};
