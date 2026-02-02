const express = require("express");
const router = express.Router();

const {
    getSubscriptionDetails,
    managePausedDays,
    upgradeSubscription,
    cancelSubscription,
    purchaseSubscription
} = require("../../controllers/customer/subscriptionController");

const { protect } = require("../../middleware/authMiddleware.middleware");

// Subscription management routes
router.get("/details", protect, getSubscriptionDetails);
router.post("/purchase", protect, purchaseSubscription);
router.put("/pause", protect, managePausedDays);
router.put("/upgrade", protect, upgradeSubscription);
router.put("/cancel", protect, cancelSubscription);

module.exports = router;