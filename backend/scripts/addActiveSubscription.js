const mongoose = require("mongoose");
const User = require("../models/user.model");
const Subscription = require("../models/subscription.model");
require("dotenv").config();

async function addSubscription() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ DB Connected");

        const customer = await User.findOne({ email: "customer@gmail.com" });
        const provider = await User.findOne({ email: "indoredeluxe@example.com" });

        if (!customer || !provider) {
            console.log("❌ Customer or Provider not found!");
            process.exit(1);
        }

        // 1. Cleanup old subscriptions for this test user to keep it clean
        await Subscription.deleteMany({ customer: customer._id });
        console.log("🧹 Cleaned up old subscriptions for customer.");

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 30); // 30 days subscription

        // 2. Create Active & Approved Subscription
        const sub = await Subscription.create({
            customer: customer._id,
            provider: provider._id,
            created_by: "customer",
            planName: "Monthly Deluxe Plan",
            price: 3500,
            type: "monthly",
            category: "veg",
            durationInDays: 30,
            startDate: startDate,
            endDate: endDate,
            mealType: "Lunch",
            mealTypes: ["lunch"],
            status: "approved", // Set to approved/active
            adminApproval: "approved",
            paymentStatus: "Paid",
            paymentMethod: "Wallet",
            deliveryAddress: {
                street: "C-21 Mall, AB Road",
                city: "Indore",
                pincode: "452010",
                phone: customer.mobile
            }
        });

        // 3. Update User Flags
        await User.findByIdAndUpdate(customer._id, {
            hasActiveSubscription: true,
            activeSubscription: sub._id
        });

        console.log("\n✅ ACTIVE SUBSCRIPTION CREATED!");
        console.log(`👤 Customer: ${customer.fullName}`);
        console.log(`🏠 Provider: Indore Deluxe`);
        console.log(`📅 Valid: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`);
        console.log(`🔓 Customer can now access Menu and Tracking pages.`);

        process.exit(0);

    } catch (error) {
        console.error("❌ Subscription Creation Failed:", error);
        process.exit(1);
    }
}

addSubscription();
