/**
 * Equipment Controller
 * Handles HTTP requests for equipment-related operations
 */

const Equipment = require('../models/Equipment');

/**
 * Get all equipment (optionally filter by active status)
 * GET /api/equipment
 */
const getAllEquipment = async (req, res) => {
  try {
    const { active } = req.query;
    
    let query = {};
    if (active !== undefined) {
      query.isActive = active === 'true';
    }

    const equipment = await Equipment.find(query).sort({ category: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: equipment.length,
      data: equipment
    });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching equipment'
    });
  }
};

/**
 * Get single equipment by ID
 * GET /api/equipment/:id
 */
const getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        error: 'Equipment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: equipment
    });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching equipment'
    });
  }
};

module.exports = {
  getAllEquipment,
  getEquipmentById
};
