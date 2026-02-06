const mongoose = require('mongoose');
const Subscription = require('../models/subscription.model');
const fs = require('fs');
require('dotenv').config({ path: '../.env' });

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Smart-Tiffin-System');
        const subs = await Subscription.find({}).sort({ createdAt: -1 }).limit(10).populate('customer', 'fullName email');

        const output = subs.map(s => ({
            id: s._id,
            email: s.customer?.email,
            name: s.customer?.fullName,
            price: s.price,
            totalAmount: s.totalAmount,
            duration: s.durationInDays,
            status: s.status,
            createdAt: s.createdAt
        }));

        fs.writeFileSync('debug_output.txt', JSON.stringify(output, null, 2));
        console.log("Output written to debug_output.txt");
    } catch (err) {
        fs.writeFileSync('debug_output.txt', err.message);
    } finally {
        await mongoose.disconnect();
    }
}

run();
