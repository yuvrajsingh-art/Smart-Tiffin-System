const express = require('express');
const router = express.Router();
const razorpayController = require('../../controllers/customer/razorpay.controller');
const { protect, customerOnly } = require('../../middleware/authMiddleware.middleware');

router.post('/create-order', protect, customerOnly, razorpayController.createOrder);
router.post('/verify-payment', protect, customerOnly, razorpayController.verifyPayment);

module.exports = router;
