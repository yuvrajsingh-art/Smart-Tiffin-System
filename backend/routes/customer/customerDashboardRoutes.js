const express = require("express");
const router = express.Router();

const {
    getCustomerDashboard,
    getLiveTracking
} = require("../../controllers/customer/customerDashboardController");

const { protect } = require("../../middleware/authMiddleware.middleware");

// Dashboard routes
router.get("/", protect, getCustomerDashboard);
router.get("/live-tracking", protect, getLiveTracking);

module.exports = router;