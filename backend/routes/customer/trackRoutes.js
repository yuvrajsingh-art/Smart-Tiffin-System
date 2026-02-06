const express = require("express");
const router = express.Router();

const {
    getLiveTracking,
    getOrderHistory,
    updateOrderStatus,
    initializeTestOrder,
    advanceTestStatus
} = require("../../controllers/customer/trackController");

const { protect } = require("../../middleware/authMiddleware.middleware");

// Track routes
router.get("/live", protect, getLiveTracking);
router.post("/initialize-test", protect, initializeTestOrder);
router.post("/advance-test", protect, advanceTestStatus);
router.get("/history", protect, getOrderHistory);
router.put("/status/:orderId", protect, updateOrderStatus);

module.exports = router;