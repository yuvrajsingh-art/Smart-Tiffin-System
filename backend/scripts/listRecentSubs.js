const mongoose = require('mongoose');
const Subscription = require('../models/subscription.model');
const User = require('../models/user.model');
require('dotenv').config({ path: '../.env' });

async function listRecentSubs() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Smart-Tiffin-System');
        const subs = await Subscription.find({}).sort({ createdAt: -1 }).limit(5).populate('customer', 'fullName email');
        console.log(JSON.stringify(subs, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

listRecentSubs();
