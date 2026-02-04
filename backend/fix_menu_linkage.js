const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Subscription = require('./models/subscription.model');
const Menu = require('./models/menu.model');
const User = require('./models/user.model');

const fixMenu = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB Atlas");

        // 1. Find the subscription to get provider
        const sub = await Subscription.findOne({});
        if (!sub) {
            console.log("No subscriptions found to fix.");
            process.exit(1);
        }

        const providerId = sub.provider;
        console.log("Fixing menu for Provider ID:", providerId);

        // 2. Clear and Seed Menu for THIS provider
        await Menu.deleteMany({ provider: providerId });

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const today = new Date();

        for (let i = -2; i < 5; i++) { // From 2 days ago to 5 days ahead
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            date.setHours(0, 0, 0, 0);

            const dayName = days[date.getDay()];

            // Lunch
            await Menu.create({
                provider: providerId,
                name: `${dayName} Lunch Special`,
                price: 150,
                category: "Thali",
                type: "Veg",
                menuDate: date,
                mealType: "lunch",
                mainDish: "Paneer Masala",
                sabjiDry: "Aloo Jeera",
                dal: "Dal Tadka",
                rice: "Jeera Rice",
                bread: { type: "Roti", count: 4 },
                isAvailable: true,
                isPublished: true,
                approvalStatus: "Approved"
            });

            // Dinner
            await Menu.create({
                provider: providerId,
                name: `${dayName} Dinner Thali`,
                price: 150,
                category: "Thali",
                type: "Veg",
                menuDate: date,
                mealType: "dinner",
                mainDish: "Mixed Veg",
                sabjiDry: "Bhindi Masala",
                dal: "Dal Fry",
                rice: "Steamed Rice",
                bread: { type: "Roti", count: 4 },
                isAvailable: true,
                isPublished: true,
                approvalStatus: "Approved"
            });
        }

        console.log("Menu Seeded Successfully for the active provider!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixMenu();
