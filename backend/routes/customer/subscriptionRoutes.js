const express = require("express");
const router = express.Router();

const {
    getSubscriptionDetails,
    managePausedDays,
    upgradeSubscription,
    cancelSubscription,
    purchaseSubscription
} = require("../../controllers/customer/subscriptionController");

const { protect, customerOnly } = require("../../middleware/authMiddleware.middleware");

// Subscription management routes
router.get("/details", protect, customerOnly, getSubscriptionDetails);
router.post("/purchase", protect, customerOnly, purchaseSubscription);
router.put("/pause", protect, customerOnly, managePausedDays);
router.put("/upgrade", protect, customerOnly, upgradeSubscription);
router.put("/cancel", protect, customerOnly, cancelSubscription);

module.exports = router;