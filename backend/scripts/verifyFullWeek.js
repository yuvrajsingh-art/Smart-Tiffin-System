const mongoose = require('mongoose');
const menuController = require('../controllers/customer/menuController');
const StoreProfile = mongoose.models.StoreProfile || require('../models/storeProfile.model');
const fs = require('fs');
require('dotenv').config({ path: '../.env' });

async function verify() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Smart-Tiffin-System');
        const store = await StoreProfile.findOne({ mess_name: /Indore Deluxe/i });

        // Mock req/res
        const req = { params: { providerId: store.provider.toString() } };
        const res = {
            json: (data) => fs.writeFileSync('final_menu_verify.txt', JSON.stringify(data, null, 2)),
            status: () => ({ json: (err) => fs.writeFileSync('final_menu_verify.txt', JSON.stringify(err)) })
        };

        await menuController.getPublicMenu(req, res);
        console.log("Verification output written to final_menu_verify.txt");
    } catch (err) {
        fs.writeFileSync('final_menu_verify.txt', err.message);
    } finally {
        await mongoose.disconnect();
    }
}

verify();
