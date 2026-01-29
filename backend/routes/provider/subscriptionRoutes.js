const express = require("express");
const router = express.Router();

const { 
    getSubscribers, 
    getSubscriptionStats, 
    pauseSubscription, 
    resumeSubscription,
    getSubscriptionById,
    updateSubscriptionStatus
} = require("../../controllers/provider/providersubscriptioncontroller");

const { protect } = require("../../middleware/authMiddleware.middleware");

// Get all subscribers for provider
router.get("/", protect, getSubscribers);

// Get subscription statistics
router.get("/stats", protect, getSubscriptionStats);

// Get single subscription by ID
router.get("/:id", protect, getSubscriptionById);

// Pause subscription
router.put("/:id/pause", protect, pauseSubscription);

// Resume subscription
router.put("/:id/resume", protect, resumeSubscription);

// Update subscription status (approve/reject)
router.put("/:id/status", protect, updateSubscriptionStatus);

module.exports = router;
