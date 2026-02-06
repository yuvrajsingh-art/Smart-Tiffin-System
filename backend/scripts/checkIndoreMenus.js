const mongoose = require('mongoose');
const Menu = mongoose.models.Menu || require('../models/menu.model');
const StoreProfile = mongoose.models.StoreProfile || require('../models/storeProfile.model');
require('dotenv').config({ path: '../.env' });

async function checkMenus() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Smart-Tiffin-System');

        const store = await StoreProfile.findOne({ mess_name: /Indore Deluxe/i });
        if (!store) {
            console.log("Store not found");
            return;
        }

        console.log("Store found:", store.mess_name, "Provider ID:", store.provider);

        const menus = await Menu.find({ provider: store.provider });
        console.log(`Found ${menus.length} menus for this provider.`);

        menus.forEach(m => {
            console.log(`Date: ${m.menuDate.toISOString().split('T')[0]}, Type: ${m.mealType}, Published: ${m.isPublished}, Approval: ${m.approvalStatus}`);
        });

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkMenus();
