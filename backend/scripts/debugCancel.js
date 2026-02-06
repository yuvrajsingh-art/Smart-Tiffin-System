const mongoose = require('mongoose');
const User = require('../models/user.model');
const Subscription = require('../models/subscription.model');
require('dotenv').config({ path: '../.env' });

async function debugCancel() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Smart-Tiffin-System');
        console.log("Connected to DB");

        const user = await User.findOne({ email: 'yuvraj@gmail.com' });
        if (!user) {
            console.log("User not found");
            return;
        }

        console.log("User found:", user.fullName, user._id);
        console.log("Has Active Subscription:", user.hasActiveSubscription);
        console.log("Active Subscription ID:", user.activeSubscription);

        const subscription = await Subscription.findOne({
            customer: user._id,
            status: "approved",
            endDate: { $gte: new Date() }
        });

        if (!subscription) {
            console.log("No active subscription found in DB for query");
            return;
        }

        console.log("Subscription found:", subscription._id);
        console.log("Price:", subscription.price);
        console.log("Total Amount:", subscription.totalAmount);
        console.log("Duration In Days:", subscription.durationInDays);
        console.log("Start Date:", subscription.startDate);
        console.log("End Date:", subscription.endDate);

        const today = new Date();
        const startDate = new Date(subscription.startDate);
        const endDate = new Date(subscription.endDate);

        const totalDurationDays = subscription.durationInDays || Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 30;

        console.log("Calculated Total Duration Days:", totalDurationDays);

        let remainingDays = 0;
        if (today < startDate) {
            remainingDays = totalDurationDays;
        } else {
            remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
        }
        remainingDays = Math.max(0, Math.min(remainingDays, totalDurationDays));
        console.log("Calculated Remaining Days:", remainingDays);

        const amountToUse = subscription.totalAmount || subscription.price || 0;
        console.log("Amount to use for calculation:", amountToUse);

        const dailyRate = amountToUse / totalDurationDays;
        console.log("Daily Rate:", dailyRate);

        const refundAmount = Math.floor(remainingDays * dailyRate);
        console.log("Refund Amount:", refundAmount);

        if (isNaN(refundAmount)) {
            console.error("ERROR: Refund Amount is NaN!");
        }

    } catch (err) {
        console.error("Debug Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

debugCancel();
