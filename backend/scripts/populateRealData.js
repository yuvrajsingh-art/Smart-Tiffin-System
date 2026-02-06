const mongoose = require("mongoose");
const User = require("../models/user.model");
const Provider = require("../models/providerprofile.model");
const StoreProfile = require("../models/storeProfile.model");
const Menu = require("../models/menu.model");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function populateData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ DB Connected");

        const providers = [
            {
                fullName: "Indore Deluxe Tiffin",
                email: "indoredeluxe@example.com",
                password: "provider123",
                mobile: "9111122233",
                messName: "Indore Deluxe",
                cuisines: ["North Indian", "Punjabi", "Thali"],
                prices: { monthly: 3500, weekly: 950 },
                location: { address: "Vijay Nagar", city: "Indore", pincode: "452010", coords: [75.8953, 22.7533] }
            },
            {
                fullName: "Maa Ki Rasoi",
                email: "maakirasoi@example.com",
                password: "provider123",
                mobile: "9222233344",
                messName: "Maa Ki Rasoi (Satvik)",
                cuisines: ["Gujarati", "Jain", "Thali"],
                prices: { monthly: 3000, weekly: 800 },
                location: { address: "Bhanwarkua", city: "Indore", pincode: "452001", coords: [75.8665, 22.6917] }
            },
            {
                fullName: "Kitchen Garden",
                email: "kitchengarden@example.com",
                password: "provider123",
                mobile: "9333344455",
                messName: "Kitchen Garden Healthy",
                cuisines: ["Continental", "Vegan"],
                prices: { monthly: 4500, weekly: 1200 },
                location: { address: "New Palasia", city: "Indore", pincode: "452001", coords: [75.8821, 22.7244] }
            }
        ];

        for (const p of providers) {
            // 1. Cleanup
            await User.findOneAndDelete({ email: p.email });
            console.log(`🧹 Cleaned up ${p.email}`);

            const hashedPassword = await bcrypt.hash(p.password, 10);

            // 2. Create User
            const user = await User.create({
                fullName: p.fullName,
                email: p.email,
                password: hashedPassword,
                mobile: p.mobile,
                role: 'provider',
                isVerified: true,
                status: 'active'
            });

            // 3. Create Provider Profile
            await Provider.create({
                user: user._id,
                messName: p.messName,
                phone: p.mobile,
                location: {
                    type: "Point",
                    coordinates: p.location.coords,
                    address: p.location.address,
                    city: p.location.city,
                    pincode: p.location.pincode
                },
                isOnboardingComplete: true,
                onboardingStep: 4,
                isActive: true
            });

            // 4. Create Store Profile
            await StoreProfile.create({
                provider: user._id,
                mess_name: p.messName,
                contact_number: p.mobile,
                cuisines: p.cuisines,
                monthlyPrice: p.prices.monthly,
                weeklyPrice: p.prices.weekly,
                address: {
                    street: p.location.address,
                    city: p.location.city,
                    state: "Madhya Pradesh",
                    pincode: p.location.pincode
                },
                is_active: true
            });

            // 5. Create Menus (Today, Tomorrow, Day After)
            const menuNames = ["Standard Thali", "Premium Thali", "Exec Thali"];
            const mainDishes = ["Paneer Masala", "Mix Veg", "Aloo Matar", "Kadhai Paneer"];
            const dals = ["Dal Tadka", "Dal Makhani", "Dal Fry"];
            const rices = ["Jeera Rice", "Steam Rice", "Veg Pulao"];

            for (let i = 0; i < 3; i++) {
                const date = new Date();
                date.setDate(date.getDate() + i);
                date.setHours(0, 0, 0, 0);

                await Menu.create({
                    provider: user._id,
                    name: `${p.messName} - ${menuNames[i]}`,
                    price: 120 + (i * 10),
                    category: "Thali",
                    type: "Veg",
                    menuDate: date,
                    mealType: "lunch",
                    mainDish: mainDishes[i % mainDishes.length],
                    sabjiDry: "Seasonal Sabji",
                    dal: dals[i % dals.length],
                    rice: rices[i % rices.length],
                    bread: { type: "Butter Roti", count: 4 },
                    accompaniments: { salad: true, pickle: true, papad: i % 2 === 0 },
                    isPublished: true,
                    publishedAt: new Date(),
                    approvalStatus: "Approved"
                });
            }
            console.log(`✅ Fully Populated: ${p.messName}`);
        }

        console.log("\n🚀 DB POPULATION COMPLETE!");
        process.exit(0);

    } catch (error) {
        console.error("❌ Population Failed:", error);
        process.exit(1);
    }
}

populateData();
