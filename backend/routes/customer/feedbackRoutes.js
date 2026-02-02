const express = require("express");
const router = express.Router();

const {
    getFeedbackData,
    submitFeedback,
    getFeedbackHistory,
    getFeedbackTags,
    updateFeedback
} = require("../../controllers/customer/feedbackController");

const { protect } = require("../../middleware/authMiddleware.middleware");

// Feedback routes
router.get("/data", protect, getFeedbackData);
router.post("/submit", protect, submitFeedback);
router.get("/history", protect, getFeedbackHistory);
router.get("/tags", protect, getFeedbackTags);
router.put("/update/:reviewId", protect, updateFeedback);

module.exports = router;