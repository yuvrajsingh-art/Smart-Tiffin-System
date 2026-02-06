const mongoose = require('mongoose');
const StoreProfile = mongoose.models.StoreProfile || require('../models/storeProfile.model');
const fs = require('fs');
require('dotenv').config({ path: '../.env' });

async function listStores() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Smart-Tiffin-System');
        const stores = await StoreProfile.find({}, 'mess_name provider');
        fs.writeFileSync('stores_debug.txt', JSON.stringify(stores, null, 2));
    } catch (err) {
        fs.writeFileSync('stores_debug.txt', err.message);
    } finally {
        await mongoose.disconnect();
    }
}

listStores();
