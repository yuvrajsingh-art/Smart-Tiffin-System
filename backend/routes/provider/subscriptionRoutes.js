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

const { generateTestOrders } = require("../../controllers/provider/testOrderController");

const { protect } = require("../../middleware/authMiddleware.middleware");
const { isVerifiedProvider } = require("../../middlewares/isVerifiedProvider");

// Test endpoint to generate sample orders
router.post("/generate-test-orders", protect, isVerifiedProvider, generateTestOrders);

// Get all subscribers for provider
router.get("/", protect, isVerifiedProvider, getSubscribers);

// Get subscription statistics
router.get("/stats", protect, isVerifiedProvider, getSubscriptionStats);

// Get single subscription by ID
router.get("/:id", protect, isVerifiedProvider, getSubscriptionById);

// Pause subscription
router.put("/:id/pause", protect, isVerifiedProvider, pauseSubscription);

// Resume subscription
router.put("/:id/resume", protect, isVerifiedProvider, resumeSubscription);

// Update subscription status (approve/reject)
router.put("/:id/status", protect, isVerifiedProvider, updateSubscriptionStatus);

module.exports = router;
