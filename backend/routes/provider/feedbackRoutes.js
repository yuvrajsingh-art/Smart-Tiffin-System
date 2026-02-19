const express = require('express');
const router = express.Router();
const { protect, providerOnly } = require('../../middleware/authMiddleware.middleware');
const feedbackController = require('../../controllers/provider/feedbackController');

// All routes require provider authentication
router.use(protect);
router.use(providerOnly);

// Get categorized feedback
router.get('/categorized', feedbackController.getProviderFeedback);

// Get all feedback
router.get('/', feedbackController.getProviderFeedback);

// Get feedback statistics
router.get('/stats', feedbackController.getFeedbackStats);

// Reply to feedback
router.post('/reply/:orderId', feedbackController.replyToFeedback);

module.exports = router;
