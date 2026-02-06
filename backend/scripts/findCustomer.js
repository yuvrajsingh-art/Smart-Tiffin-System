const mongoose = require('mongoose');
const User = require('../models/user.model');
require('dotenv').config({ path: '../.env' });

async function findCustomer() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Smart-Tiffin-System');
        const user = await User.findOne({ role: 'customer' });
        if (user) {
            console.log(`FOUND_CUSTOMER: ${user.email}`);
        } else {
            console.log("NO_CUSTOMER_FOUND");
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

findCustomer();
