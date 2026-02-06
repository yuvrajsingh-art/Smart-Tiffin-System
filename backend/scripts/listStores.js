const mongoose = require('mongoose');
const StoreProfile = mongoose.models.StoreProfile || require('../models/storeProfile.model');
require('dotenv').config({ path: '../.env' });

async function listStores() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Smart-Tiffin-System');
        const stores = await StoreProfile.find({}, 'mess_name');
        console.log(JSON.stringify(stores, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

listStores();
