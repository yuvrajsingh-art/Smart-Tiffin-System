const mongoose = require('mongoose');
const Menu = mongoose.models.Menu || require('../models/menu.model');
const StoreProfile = mongoose.models.StoreProfile || require('../models/storeProfile.model');
const fs = require('fs');
require('dotenv').config({ path: '../.env' });

async function checkMenus() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Smart-Tiffin-System');

        const store = await StoreProfile.findOne({ mess_name: /Indore Deluxe/i });
        if (!store) {
            fs.writeFileSync('menu_debug.txt', "Store not found");
            return;
        }

        const menus = await Menu.find({ provider: store.provider }).sort({ menuDate: 1 });
        const output = menus.map(m => ({
            date: m.menuDate.toISOString().split('T')[0],
            mealType: m.mealType,
            isPublished: m.isPublished,
            approvalStatus: m.approvalStatus,
            mainDish: m.mainDish
        }));

        fs.writeFileSync('menu_debug.txt', JSON.stringify(output, null, 2));
    } catch (err) {
        fs.writeFileSync('menu_debug.txt', err.message);
    } finally {
        await mongoose.disconnect();
    }
}

checkMenus();
