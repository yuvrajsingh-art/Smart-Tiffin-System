const express = require("express");
const router = express.Router();

const {
    getDashboardOverview,
    getCategorizedReviews,
    takeReviewAction,
    bulkReviewActions,
    syncNewReviews
} = require("../../controllers/provider/reviewTriageController");

const { protect } = require("../../middleware/authMiddleware.middleware");

// Get dashboard overview with KPIs
router.get("/overview", protect, getDashboardOverview);

// Get categorized reviews (negative, neutral, positive)
router.get("/categorized", protect, getCategorizedReviews);

// Take action on single review
router.put("/action/:reviewId", protect, takeReviewAction);

// Bulk actions on multiple reviews
router.put("/bulk-action", protect, bulkReviewActions);

// Sync new reviews from external platforms
router.post("/sync", protect, syncNewReviews);

module.exports = router;