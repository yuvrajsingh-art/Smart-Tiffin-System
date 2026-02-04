const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Subscription = require('./models/subscription.model');
const User = require('./models/user.model');

dotenv.config();

const checkStatus = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const user = await User.findOne({ role: 'customer' });
        if (!user) {
            console.log('No customer found');
            process.exit(0);
        }

        console.log(`Checking subscriptions for user: ${user.fullName} (${user._id})`);

        const subs = await Subscription.find({ customer: user._id });
        console.log(`Total subscriptions: ${subs.length}`);
        subs.forEach(s => {
            console.log(`ID: ${s._id}, Status: ${s.status}, EndDate: ${s.endDate}`);
        });

        const active = await Subscription.findOne({
            customer: user._id,
            status: "approved",
            endDate: { $gte: new Date() }
        });

        if (active) {
            console.log('ACTIVE SUBSCRIPTION FOUND! This will cause 400.');
            console.log(active);
        } else {
            console.log('No active subscription found.');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkStatus();
