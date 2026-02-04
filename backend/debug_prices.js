const mongoose = require('mongoose');
const dotenv = require('dotenv');
const StoreProfile = require('./models/storeProfile.model');

dotenv.config();

const checkStatus = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const stores = await StoreProfile.find({});
        console.log(`Total stores: ${stores.length}`);
        stores.forEach(s => {
            console.log(`ID: ${s._id}, Name: ${s.mess_name}, Monthly: ${s.monthlyPrice}, Weekly: ${s.weeklyPrice}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkStatus();
