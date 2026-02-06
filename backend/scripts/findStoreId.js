const mongoose = require('mongoose');
const StoreProfile = mongoose.models.StoreProfile || require('../models/storeProfile.model');
require('dotenv').config({ path: '../.env' });

async function findStore() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Smart-Tiffin-System');
        const store = await StoreProfile.findOne({ mess_name: /Indore Deluxe/i });
        if (store) {
            console.log("ID:", store._id);
            console.log("Provider ID:", store.provider);
        } else {
            console.log("Not found");
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

findStore();
