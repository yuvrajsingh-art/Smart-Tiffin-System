const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const User = require('../models/user.model');
const ProviderProfile = require('../models/providerprofile.model');
const CustomerSubscription = require('../models/subscription.model'); // Adjust path
const Order = require('../models/order.model');

dotenv.config({ path: path.join(__dirname, '../.env') });

const debugData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        let log = '';

        // 1. List All Users
        const users = await User.find({}, 'fullName email role _id');
        log += '=== USERS ===\n';
        users.forEach(u => log += `${u.role.toUpperCase()}: ${u.fullName} (${u.email}) - ${u._id}\n`);

        // 2. List All Subscriptions
        const subscriptions = await CustomerSubscription.find({});
        log += '\n=== SUBSCRIPTIONS ===\n';
        subscriptions.forEach(s => log += `Customer: ${s.customer} | Provider: ${s.provider} | Status: ${s.status}\n`);

        // 3. List Today's Orders
        const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
        const orders = await Order.find({ orderDate: { $gte: startOfDay } });
        log += '\n=== TODAY ORDERS ===\n';
        orders.forEach(o => log += `Order: ${o._id} | Customer: ${o.customer} | Provider: ${o.provider} | Status: ${o.status}\n`);

        fs.writeFileSync('debug_data_log.txt', log);
        console.log('Log written to debug_data_log.txt');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

debugData();
