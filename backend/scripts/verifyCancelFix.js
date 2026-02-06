const mongoose = require('mongoose');
const User = mongoose.models.User || require('../models/user.model');
const Subscription = mongoose.models.subscription || require('../models/subscription.model');
require('dotenv').config({ path: '../.env' });

async function verifyFix() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Smart-Tiffin-System');
        console.log("Connected to DB");

        // Find any active subscription
        const subscription = await Subscription.findOne({
            status: "approved",
            endDate: { $gte: new Date() }
        });

        if (!subscription) {
            console.log("No active subscription found to test with.");
            return;
        }

        console.log("Testing with Subscription ID:", subscription._id);
        console.log("Current totalAmount:", subscription.totalAmount);
        console.log("Current price:", subscription.price);

        // Simulate the logic in the controller
        const today = new Date();
        const startDate = new Date(subscription.startDate);
        const endDate = new Date(subscription.endDate);

        const totalDurationDays = subscription.durationInDays || Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 30;

        let remainingDays = 0;
        if (today < startDate) {
            remainingDays = totalDurationDays;
        } else {
            remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
        }
        remainingDays = Math.max(0, Math.min(remainingDays, totalDurationDays));

        // THE FIX:
        const amountToDivide = subscription.totalAmount || subscription.price || 0;
        const dailyRate = amountToDivide / (totalDurationDays || 30);
        const refundAmount = Math.floor(remainingDays * dailyRate);

        console.log("Safeguarded dailyRate:", dailyRate);
        console.log("Safeguarded refundAmount:", refundAmount);

        if (isNaN(refundAmount)) {
            throw new Error("Fix FAILED: refundAmount is still NaN!");
        }

        // Test the update
        const updated = await Subscription.findByIdAndUpdate(subscription._id, {
            refundAmount: Math.floor(refundAmount)
        }, { new: true });

        console.log("Update successful! refundAmount in DB:", updated.refundAmount);

    } catch (err) {
        console.error("Verification Error:", err.message);
    } finally {
        await mongoose.disconnect();
    }
}

verifyFix();
