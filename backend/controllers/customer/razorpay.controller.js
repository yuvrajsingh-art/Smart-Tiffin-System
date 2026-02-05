const Razorpay = require('razorpay');
const crypto = require('crypto');
const DummyBank = require('../../models/dummyBank.model');

// Initialize Razorpay only if keys are present
let razorpayInstance = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
}

/**
 * @desc Create Razorpay Order
 * @route POST /api/customer/razorpay/create-order
 */
exports.createOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;

        if (!amount) {
            return res.status(400).json({ success: false, message: 'Amount is required' });
        }

        // 1. Check if we should use Mock or Real
        if (!razorpayInstance) {
            console.log("RAZORPAY: Using Mock Mode (No keys found)");

            // Validate against DummyBank balance even in Mock Mode for realism
            const bank = await DummyBank.findOne({ user: req.user._id });
            if (bank && bank.balance < amount) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient bank balance in your linked account. Available: ₹${bank.balance}`
                });
            }

            return res.status(200).json({
                success: true,
                isMock: true,
                order: {
                    id: `order_mock_${Math.random().toString(36).slice(2, 11)}`,
                    amount: amount * 100, // Razorpay expects paise
                    currency: currency,
                    receipt: receipt || `receipt_${Date.now()}`
                }
            });
        }

        // 2. Real Razorpay Flow
        const options = {
            amount: amount * 100,
            currency: currency,
            receipt: receipt || `receipt_${Date.now()}`,
        };

        const order = await razorpayInstance.orders.create(options);
        res.status(200).json({ success: true, isMock: false, order });

    } catch (error) {
        console.error("Razorpay Create Order Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc Verify Razorpay Payment Signature
 * @route POST /api/customer/razorpay/verify-payment
 */
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            amount // We pass amount to deduct from DummyBank in Mock/Simulated flow
        } = req.body;

        // 1. Mock Verification Logic
        if (!razorpayInstance || razorpay_order_id.startsWith('order_mock_')) {
            console.log("RAZORPAY: Verifying Mock Payment");

            // Deduct from DummyBank to keep simulation closed-loop
            const bank = await DummyBank.findOne({ user: req.user._id });
            if (bank) {
                bank.balance -= (amount || 0);
                await bank.save();
            }

            return res.status(200).json({
                success: true,
                message: 'Mock payment verified successfully',
                data: { paymentId: razorpay_payment_id || `pay_mock_${Date.now()}` }
            });
        }

        // 2. Real Verification Logic
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // In real flow, we might still want to deduct from DummyBank if it's acting as the "source"
            // but usually real payments are external. We'll skip bank deduction for real payments.
            res.status(200).json({ success: true, message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid signature' });
        }

    } catch (error) {
        console.error("Razorpay Verify Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
