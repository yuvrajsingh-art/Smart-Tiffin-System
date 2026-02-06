const mongoose = require("mongoose");
const Subscription = require("../models/subscription.model");
const User = require("../models/user.model");
require("dotenv").config();

async function traceCustomerSubscription(targetCustomerId) {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connected");

        console.log(`\n🔍 Tracing Data for Customer ID: ${targetCustomerId}`);

        // 1. Fetch User
        const user = await User.findById(targetCustomerId);
        if (!user) {
            console.log("❌ USER NOT FOUND");
        } else {
            console.log(`✅ User Found: ${user.fullName} (${user.email})`);
            console.log(`   hasActiveSubscription (Flag): ${user.hasActiveSubscription}`);
            console.log(`   activeSubscription (Field): ${user.activeSubscription}`);
        }

        // 2. Fetch All Subscriptions for this User
        const subscriptions = await Subscription.find({ customer: targetCustomerId });
        console.log(`\n📄 Subscriptions Found (Total: ${subscriptions.length}):`);

        for (const sub of subscriptions) {
            console.log(`\n--- Sub ID: ${sub._id} ---`);
            console.log(`   Status: ${sub.status}`);
            console.log(`   End Date: ${sub.endDate}`);
            console.log(`   Plan: ${sub.planName}`);

            // 3. Trace Provider
            const provider = await User.findById(sub.provider);
            if (!provider) {
                console.log(`   ❌ PROVIDER MISSING (Provider ID: ${sub.provider})`);
            } else {
                console.log(`   ✅ Provider Exists: ${provider.fullName} (${provider.email})`);
            }

            const isExpired = sub.endDate < new Date();
            console.log(`   Is Expired? ${isExpired}`);

            const isApproved = sub.status === "approved";
            console.log(`   Is Approved? ${isApproved}`);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

// Target Customer ID from logs
traceCustomerSubscription("69859e56f428b147d06a41a6");
