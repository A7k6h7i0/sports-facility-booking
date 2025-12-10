const express = require('express');
const router = express.Router();
const { getAllEquipment, getEquipmentById } = require('../controllers/equipmentController');

router.get('/', getAllEquipment);
router.get('/:id', getEquipmentById);

module.exports = router;
