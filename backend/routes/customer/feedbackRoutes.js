const express = require('express');
const router = express.Router();
const { protect, customerOnly } = require('../../middleware/authMiddleware.middleware');
const feedbackController = require('../../controllers/customer/feedbackController');

// All routes require customer authentication
router.use(protect);
router.use(customerOnly);

// Submit feedback for an order
router.post('/:orderId', feedbackController.submitFeedback);

// Get orders that need feedback
router.get('/pending', feedbackController.getOrdersForFeedback);

// Get feedback history
router.get('/history', feedbackController.getFeedbackHistory);

module.exports = router;
