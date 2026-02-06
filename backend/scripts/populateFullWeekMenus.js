const mongoose = require('mongoose');
const Menu = mongoose.models.Menu || require('../models/menu.model');
const StoreProfile = mongoose.models.StoreProfile || require('../models/storeProfile.model');
require('dotenv').config({ path: '../.env' });

async function populateMenus() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Smart-Tiffin-System');
        console.log("Connected to DB");

        const stores = await StoreProfile.find({ mess_name: { $in: [/Indore Deluxe/i, /Annapurna/i, /Satvik/i] } });
        console.log(`Found ${stores.length} stores.`);

        const days = [];
        const today = new Date(); // Feb 6 (Friday)
        const currentDay = today.getDay();
        const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
        const monday = new Date(today);
        monday.setDate(today.getDate() + mondayOffset);
        monday.setHours(0, 0, 0, 0);

        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            days.push(date);
        }

        const mealTypes = ['lunch', 'dinner'];

        for (const store of stores) {
            console.log(`Populating for ${store.mess_name}...`);
            for (const date of days) {
                for (const mealType of mealTypes) {
                    await Menu.findOneAndUpdate(
                        { provider: store.provider, menuDate: date, mealType },
                        {
                            provider: store.provider,
                            menuDate: date,
                            mealType,
                            name: `${store.mess_name} ${mealType.toUpperCase()}`,
                            price: 120,
                            category: "Thali",
                            type: "Veg",
                            mainDish: `${mealType === 'lunch' ? 'Special Thali' : 'Mini Meal'} - ${store.mess_name}`,
                            bread: { type: "Roti", count: 4 },
                            isPublished: true,
                            approvalStatus: "Approved"
                        },
                        { upsert: true, new: true }
                    );
                }
            }
        }

        console.log("All menus populated for the week! 🎉");

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

populateMenus();
