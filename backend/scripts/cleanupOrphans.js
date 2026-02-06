const mongoose = require("mongoose");
const Subscription = require("../models/subscription.model");
const User = require("../models/user.model");
require("dotenv").config();

async function cleanupOrphanedSubscriptions() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected");

        const subscriptions = await Subscription.find({
            status: { $in: ['approved', 'active'] }
        });

        console.log(`Checking ${subscriptions.length} active/approved subscriptions for orphaned providers...`);

        let cleanupCount = 0;
        for (const sub of subscriptions) {
            const provider = await User.findById(sub.provider);
            if (!provider) {
                console.log(`🧹 Cleaning up Orphaned Subscription: ${sub._id} (Provider ${sub.provider} missing)`);

                // Option: Mark as cancelled so it doesn't show up in active list
                sub.status = 'cancelled';
                sub.cancellationReason = 'System Cleanup: Associated Provider no longer exists';
                await sub.save();

                // Also clear the user's active flags if this was their active one
                await User.findByIdAndUpdate(sub.customer, {
                    hasActiveSubscription: false,
                    activeSubscription: null
                });

                cleanupCount++;
            }
        }

        console.log(`\n✅ Cleanup Finished. Fixed ${cleanupCount} orphaned records.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

cleanupOrphanedSubscriptions();
