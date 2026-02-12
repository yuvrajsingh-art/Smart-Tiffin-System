const express = require("express");
const router = express.Router();

const { getCustomerActivities } = require("../../controllers/provider/activityController");
const { protect, providerOnly } = require("../../middleware/authMiddleware.middleware");

// GET /api/provider/activities - Get last 24 hours customer activities
router.get("/", protect, providerOnly, getCustomerActivities);

module.exports = router;
