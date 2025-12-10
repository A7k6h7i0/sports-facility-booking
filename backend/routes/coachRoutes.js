const express = require('express');
const router = express.Router();
const { getAllCoaches, getCoachById } = require('../controllers/coachController');

router.get('/', getAllCoaches);
router.get('/:id', getCoachById);

module.exports = router;
