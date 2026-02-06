const mongoose = require("mongoose");
const User = require("../models/user.model");
const Provider = require("../models/providerprofile.model");
const StoreProfile = require("../models/storeProfile.model");
const Menu = require("../models/menu.model");
const Subscription = require("../models/subscription.model");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function cleanAndPopulate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ DB Connected");

        // ==========================================
        // 1. HARD CLEANUP (Provider related only)
        // ==========================================
        console.log("🧹 Starting Hard Cleanup...");

        // Delete all provider users
        const deletedProviders = await User.deleteMany({ role: "provider" });
        console.log(`   - Deleted ${deletedProviders.deletedCount} Provider Users`);

        // Delete all profiles
        await Provider.deleteMany({});
        console.log("   - Deleted all ProviderProfiles");
        await StoreProfile.deleteMany({});
        console.log("   - Deleted all StoreProfiles");

        // Delete all menus
        await Menu.deleteMany({});
        console.log("   - Deleted all Menus");

        // Delete all subscriptions
        await Subscription.deleteMany({});
        console.log("   - Deleted all Subscriptions");

        // Reset Test Customer Flags
        await User.findOneAndUpdate(
            { email: "customer@gmail.com" },
            { hasActiveSubscription: false, activeSubscription: null }
        );
        console.log("   - Reset Test Customer flags");

        // ==========================================
        // 2. ENHANCED PROVIDER DATA
        // ==========================================
        const providers = [
            {
                fullName: "Rajesh Sharma",
                email: "indoredeluxe@example.com",
                password: "provider123",
                mobile: "9111122233",
                messName: "Indore Deluxe Tiffin",
                description: "Authentic Indori taste with premium ingredients. Hygiene and health are our top priorities.",
                cuisines: ["North Indian", "Punjabi", "Thali"],
                prices: { monthly: 3600, weekly: 999 },
                location: { address: "Flat 202, Silver Oaks, Vijay Nagar", city: "Indore", pincode: "452010", coords: [75.8953, 22.7533] },
                image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?auto=format&fit=crop&w=800&q=80"
            },
            {
                fullName: "Sunita Vyas",
                email: "maakirasoi@example.com",
                password: "provider123",
                mobile: "9222233344",
                messName: "Maa Ki Rasoi (Satvik)",
                description: "Ghar jaisa swad, bina pyaaz lahsun ke. Pure Veg and Satvik meals prepared with motherly love.",
                cuisines: ["Gujarati", "Jain", "Thali"],
                prices: { monthly: 2900, weekly: 750 },
                location: { address: "Sector B, Bhanwarkua", city: "Indore", pincode: "452001", coords: [75.8665, 22.6917] },
                image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80"
            },
            {
                fullName: "Vikram Malhotra",
                email: "kitchengarden@example.com",
                password: "provider123",
                mobile: "9333344455",
                messName: "Kitchen Garden Healthy",
                description: "Focus on nutrition and balance. Salads, sprouts, and low-oil Continental options for fitness enthusiasts.",
                cuisines: ["Continental", "Vegan"],
                prices: { monthly: 4800, weekly: 1350 },
                location: { address: "Lane 4, New Palasia", city: "Indore", pincode: "452001", coords: [75.8821, 22.7244] },
                image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80"
            }
        ];

        const hashedPassword = await bcrypt.hash("provider123", 10);

        for (const p of providers) {
            // Create User
            const user = await User.create({
                fullName: p.fullName,
                email: p.email,
                password: hashedPassword,
                mobile: p.mobile,
                role: 'provider',
                isVerified: true,
                status: 'active',
                address: p.location.address
            });

            // Create Provider Profile
            await Provider.create({
                user: user._id,
                messName: p.messName,
                ownerName: p.fullName,
                phone: p.mobile,
                description: p.description,
                location: {
                    type: "Point",
                    coordinates: p.location.coords,
                    address: p.location.address,
                    city: p.location.city,
                    pincode: p.location.pincode
                },
                isOnboardingComplete: true,
                onboardingStep: 4,
                isActive: true,
                rating: 4.5,
                totalReviews: Math.floor(Math.random() * 50) + 10
            });

            // Create Store Profile
            await StoreProfile.create({
                provider: user._id,
                mess_name: p.messName,
                contact_number: p.mobile,
                description: p.description,
                cuisines: p.cuisines,
                monthlyPrice: p.prices.monthly,
                weeklyPrice: p.prices.weekly,
                address: {
                    street: p.location.address,
                    city: p.location.city,
                    state: "Madhya Pradesh",
                    pincode: p.location.pincode
                },
                location: {
                    type: "Point",
                    coordinates: p.location.coords
                },
                store_image: p.image,
                is_active: true,
                rating: 4.5
            });

            // Create 3-Day Menu (Lunch + Dinner)
            const dishes = [
                { lunch: "Special Thali (Paneer Masala + Mix Veg)", dinner: "Dal Fry + Jeera Rice Combo" },
                { lunch: "Rajma Chawal + Raita", dinner: "Kadhai Paneer + 4 Roti" },
                { lunch: "Veg Pulao + Kadhi Pakoda", dinner: "Aloo Gobi + Dal Tadka" }
            ];

            for (let i = 0; i < 3; i++) {
                const date = new Date();
                date.setDate(date.getDate() + i);
                date.setHours(0, 0, 0, 0);

                // Lunch
                await Menu.create({
                    provider: user._id,
                    name: `${p.messName} Lunch`,
                    price: 150,
                    category: "Thali",
                    type: "Veg",
                    menuDate: date,
                    mealType: "lunch",
                    mainDish: dishes[i].lunch,
                    bread: { type: "Butter Roti", count: 4 },
                    accompaniments: { salad: true, pickle: true, raita: true },
                    isPublished: true,
                    publishedAt: new Date(),
                    approvalStatus: "Approved"
                });

                // Dinner
                await Menu.create({
                    provider: user._id,
                    name: `${p.messName} Dinner`,
                    price: 130,
                    category: "Combo",
                    type: "Veg",
                    menuDate: date,
                    mealType: "dinner",
                    mainDish: dishes[i].dinner,
                    bread: { type: "Tawa Roti", count: 3 },
                    accompaniments: { salad: true, pickle: true },
                    isPublished: true,
                    publishedAt: new Date(),
                    approvalStatus: "Approved"
                });
            }
            console.log(`✅ Fully Setup: ${p.messName}`);
        }

        // ==========================================
        // 3. RE-LINK TEST CUSTOMER
        // ==========================================
        const customer = await User.findOne({ email: "customer@gmail.com" });
        const firstProvider = await User.findOne({ email: "indoredeluxe@example.com" });

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 30);

        const sub = await Subscription.create({
            customer: customer._id,
            provider: firstProvider._id,
            created_by: "customer",
            planName: "Monthly Deluxe Plan",
            price: 3600,
            type: "monthly",
            category: "veg",
            durationInDays: 30,
            startDate,
            endDate,
            mealType: "Both",
            mealTypes: ["lunch", "dinner"],
            status: "approved",
            adminApproval: "approved",
            paymentStatus: "Paid",
            deliveryAddress: { street: "C-21 Mall", city: "Indore", pincode: "452010" }
        });

        await User.findByIdAndUpdate(customer._id, {
            hasActiveSubscription: true,
            activeSubscription: sub._id
        });
        console.log("✅ Linked Customer with fresh subscription.");

        console.log("\n🚀 DATABASE RE-POPULATED SUCCESSFULLY!");
        process.exit(0);

    } catch (error) {
        console.error("❌ Process Failed:", error);
        process.exit(1);
    }
}

cleanAndPopulate();
