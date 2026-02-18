const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/authMiddleware.middleware');
const { getOrderTracking } = require('../../controllers/provider/track.controller');

// GET /api/provider-track/:orderId - Get order tracking details
router.get('/:orderId', protect, getOrderTracking);

module.exports = router;
