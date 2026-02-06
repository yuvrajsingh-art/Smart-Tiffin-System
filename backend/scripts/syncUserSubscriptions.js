const mongoose = require("mongoose");
const Subscription = require("../models/subscription.model");
const User = require("../models/user.model");
require("dotenv").config();

async function syncSubscriptions() {
    try {
        console.log("🚀 Starting Subscription Sync Migration...");

        // Connect to DB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ DB Connected");

        const now = new Date();

        // 1. Reset all users first (Optional, but safe)
        console.log("🔄 Resetting subscription flags for all users...");
        await User.updateMany({}, {
            hasActiveSubscription: false,
            activeSubscription: null
        });

        // 2. Find all currently active/approved subscriptions
        const activeSubscriptions = await Subscription.find({
            status: { $in: ['approved', 'active'] },
            endDate: { $gt: now }
        });

        console.log(`🔍 Found ${activeSubscriptions.length} active subscriptions.`);

        let updatedCount = 0;
        for (const sub of activeSubscriptions) {
            await User.findByIdAndUpdate(sub.customer, {
                hasActiveSubscription: true,
                activeSubscription: sub._id
            });
            updatedCount++;
        }

        console.log(`✅ Successfully updated ${updatedCount} users.`);
        process.exit(0);

    } catch (error) {
        console.error("❌ Migration Failed:", error);
        process.exit(1);
    }
}

syncSubscriptions();
