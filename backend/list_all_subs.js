const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Subscription = require('./models/subscription.model');

dotenv.config();

const checkStatus = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const subs = await Subscription.find({});
        console.log(`Total subscriptions in DB: ${subs.length}`);
        subs.forEach(s => {
            console.log(`ID: ${s._id}, Customer: ${s.customer}, Status: ${s.status}, EndDate: ${s.endDate}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkStatus();
