const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware.middleware");
const { getSubscriptionPlan, createSubscriptionPlan } = require("../../controllers/provider/subscriptionPlanController");

// Get subscription plan
router.get("/subscription-plan", protect, getSubscriptionPlan);

// Create/Update subscription plan
router.post("/subscription-plan", protect, createSubscriptionPlan);

module.exports = router;
