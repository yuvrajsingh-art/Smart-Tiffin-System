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
const { validate } = require("../../middleware/validateInput");

// Feedback routes
router.get("/data", protect, getFeedbackData);
router.post("/submit", protect, validate('submitFeedback'), submitFeedback);
router.get("/history", protect, getFeedbackHistory);
router.get("/tags", protect, getFeedbackTags);
router.put("/update/:reviewId", protect, updateFeedback);

module.exports = router;