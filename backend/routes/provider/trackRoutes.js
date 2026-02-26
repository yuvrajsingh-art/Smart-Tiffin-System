const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/authMiddleware.middleware');
const { getOrderTracking, updateOrderStatus } = require('../../controllers/provider/track.controller');

// GET /api/provider-track/:orderId - Get order tracking details
router.get('/:orderId', protect, getOrderTracking);

// PUT /api/provider-track/:orderId/status - Update order status
router.put('/:orderId/status', protect, updateOrderStatus);

module.exports = router;
