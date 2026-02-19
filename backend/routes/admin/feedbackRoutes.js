const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../../middleware/authMiddleware.middleware');
const feedbackController = require('../../controllers/admin/feedback.controller');

router.use(protect);
router.use(adminOnly);

router.get('/', feedbackController.getAllFeedbacks);

module.exports = router;
