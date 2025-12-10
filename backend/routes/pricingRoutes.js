const express = require('express');
const router = express.Router();
const { estimatePrice } = require('../controllers/pricingController');

router.post('/estimate', estimatePrice);

module.exports = router;
