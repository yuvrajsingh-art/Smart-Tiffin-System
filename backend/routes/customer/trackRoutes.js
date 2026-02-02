const express = require("express");
const router = express.Router();

const {
    getLiveTracking,
    getOrderHistory,
    updateOrderStatus
} = require("../../controllers/customer/trackController");

const { protect } = require("../../middleware/authMiddleware.middleware");

// Track routes
router.get("/live", protect, getLiveTracking);
router.get("/history", protect, getOrderHistory);
router.put("/status/:orderId", protect, updateOrderStatus);

module.exports = router;