const mongoose = require("mongoose");
const User = require("../models/user.model");
const Provider = require("../models/providerprofile.model");
const StoreProfile = require("../models/storeProfile.model");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function registerTestProvider() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ DB Connected");

        const testEmail = "royalmess@example.com";

        // 1. Cleanup existing test data if any
        await User.findOneAndDelete({ email: testEmail });
        console.log("🧹 Cleaned up old test provider if existed.");

        const payload = {
            fullName: "Royal Mess Service",
            email: testEmail,
            password: "provider123",
            mobile: "9988776655",
            messName: "The Royal Tiffin",
            cuisines: ["North Indian", "Rajasthani"],
            monthlyPrice: 3200,
            weeklyPrice: 850,
            location: {
                address: "Vijay Nagar, Scheme No. 54",
                city: "Indore",
                pincode: "452010",
                coordinates: [75.8953, 22.7533]
            },
            bankDetails: {
                accountHolderName: "Royal Mess",
                accountNumber: "1234567890",
                ifscCode: "SBIN0001234"
            }
        };

        // We simulate the controller logic to verify models work together
        const hashedPassword = await bcrypt.hash(payload.password, 10);

        // Create User
        const newUser = await User.create({
            fullName: payload.fullName,
            email: payload.email,
            password: hashedPassword,
            mobile: payload.mobile,
            role: 'provider',
            isVerified: true,
            status: 'active'
        });

        // Create Provider Profile
        await Provider.create({
            user: newUser._id,
            messName: payload.messName,
            phone: payload.mobile,
            location: {
                type: "Point",
                coordinates: payload.location.coordinates,
                address: payload.location.address,
                city: payload.location.city,
                pincode: payload.location.pincode
            },
            bankDetails: payload.bankDetails,
            isOnboardingComplete: true,
            onboardingStep: 4
        });

        // Create Store Profile
        await StoreProfile.create({
            provider: newUser._id,
            mess_name: payload.messName,
            contact_number: payload.mobile,
            cuisines: payload.cuisines,
            monthlyPrice: payload.monthlyPrice,
            weeklyPrice: payload.weeklyPrice,
            address: {
                street: payload.location.address,
                city: payload.location.city,
                state: "Madhya Pradesh",
                pincode: payload.location.pincode
            },
            is_active: true
        });

        console.log("\n🚀 PERFECT PROVIDER REGISTERED!");
        console.log(`📧 Email: ${testEmail}`);
        console.log(`🥘 Mess: ${payload.messName}`);
        console.log(`✅ All profile flags set to ACTIVE/COMPLETE`);

        process.exit(0);

    } catch (error) {
        console.error("❌ Registration Failed:", error);
        process.exit(1);
    }
}

registerTestProvider();
