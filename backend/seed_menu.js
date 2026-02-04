const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/user.model");
const Menu = require("./models/menu.model");

dotenv.config();

const seedMenu = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        // 1. Find the Seed Provider
        const providerUser = await User.findOne({ email: "provider_seed@example.com" });
        if (!providerUser) {
            console.error("Seed provider not found! Run seed_store.js first.");
            process.exit(1);
        }

        console.log("Found Provider:", providerUser._id);

        // 2. Prepare Menu Data for 7 Days (mocking dates)
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const menuData = [
            {
                day: "Mon",
                lunch: { main: "Paneer Butter Masala", sabji: "Aloo Jeera", dal: "Dal Tadka", rotis: 3, rice: "Jeera Rice" },
                dinner: { main: "Mix Veg", sabji: "Dry Gobi", dal: "Dal Fry", rotis: 3, rice: "Steam Rice" }
            },
            {
                day: "Tue",
                lunch: { main: "Veg Kofta", sabji: "Bhindi Masala", dal: "Dal Makhani", rotis: 3, rice: "Pulao" },
                dinner: { main: "Sev Bhaji", sabji: "Aloo Matar", dal: "Tadka Dal", rotis: 3, rice: "Rice" }
            },
            {
                day: "Wed",
                lunch: { main: "Rajma Masala", sabji: "Cabbage", dal: "Fry Dal", rotis: 3, rice: "Jeera Rice" },
                dinner: { main: "Egg Curry", sabji: "Paneer Bhurji", dal: "-", rotis: 3, rice: "Rice" }
            },
            {
                day: "Thu",
                lunch: { main: "Kadhi Pakoda", sabji: "Aloo Fry", dal: "Plain Dal", rotis: 3, rice: "Khichdi" },
                dinner: { main: "Soyabean Curry", sabji: "Capsicum", dal: "Dal Tadka", rotis: 3, rice: "Rice" }
            },
            {
                day: "Fri",
                lunch: { main: "Chole Masala", sabji: "Bhature (2)", dal: "-", rotis: 0, rice: "Jeera Rice" },
                dinner: { main: "Matar Paneer", sabji: "Dry Aloo", dal: "Dal Fry", rotis: 3, rice: "Pulao" }
            },
            {
                day: "Sat",
                lunch: { main: "Veg Biryani", sabji: "Raita", dal: "Mirchi Salan", rotis: 0, rice: "-" },
                dinner: { main: "Baingan Bharta", sabji: "Jhunkar", dal: "Thecha", rotis: 2, rice: "Bhakri" }
            },
            {
                day: "Sun",
                lunch: { main: "Puran Poli Thali", sabji: "Katachi Amti", dal: "Rice", rotis: 0, rice: "Rice" },
                dinner: { main: "Masala Khichdi", sabji: "Kadhi", dal: "Papad", rotis: 0, rice: "-" }
            }
        ];

        // Clear existing menu for this provider to match clean state
        await Menu.deleteMany({ provider: providerUser._id });

        // Insert new menu items
        for (let i = 0; i < days.length; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i); // Current date + i days

            // Lunch Entry
            await Menu.create({
                provider: providerUser._id,
                name: `${days[i]} Lunch Special`,
                price: 120,
                category: "Thali",
                type: "Veg",
                menuDate: date,
                mealType: "lunch",
                mainDish: menuData[i].lunch.main,
                sabjiDry: menuData[i].lunch.sabji,
                dal: menuData[i].lunch.dal,
                rice: menuData[i].lunch.rice,
                bread: { type: "Roti", count: menuData[i].lunch.rotis },
                isAvailable: true,
                isPublished: true,
                approvalStatus: "Approved"
            });

            // Dinner Entry
            await Menu.create({
                provider: providerUser._id,
                name: `${days[i]} Dinner Special`,
                price: 120,
                category: "Thali",
                type: "Veg",
                menuDate: date,
                mealType: "dinner",
                mainDish: menuData[i].dinner.main,
                sabjiDry: menuData[i].dinner.sabji,
                dal: menuData[i].dinner.dal,
                rice: menuData[i].dinner.rice,
                bread: { type: "Roti", count: menuData[i].dinner.rotis },
                isAvailable: true,
                isPublished: true,
                approvalStatus: "Approved"
            });
        }

        console.log("Menu Seeded Successfully for 7 days!");
        process.exit();

    } catch (error) {
        console.error("Error seeding menu:", error);
        process.exit(1);
    }
};

seedMenu();
