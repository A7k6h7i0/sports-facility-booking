const express = require('express');
const router = express.Router();
const { getAllCourts, getCourtById } = require('../controllers/courtController');

router.get('/', getAllCourts);
router.get('/:id', getCourtById);

module.exports = router;
