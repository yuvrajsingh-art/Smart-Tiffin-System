const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/user.model');
const ProviderProfile = require('../models/providerprofile.model');
const Subscription = require('../models/subscription.model');
const Order = require('../models/order.model');

dotenv.config({ path: path.join(__dirname, '../.env') });

const verifySystem = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to DB');

        console.log('\n--- 1. PROVIDER CHECK ---');
        // Find our main provider "Sunita"
        const providerUser = await User.findOne({ email: 'maakirasoi@example.com' }); // Adjust email if needed, identifying by known ID from previous logs
        // From previous log: 6985a73ce2c554614b48ef02
        const providerId = '6985a73ce2c554614b48ef02';

        const providerProfile = await ProviderProfile.findOne({ user: providerId });
        if (providerProfile) {
            console.log(`✅ Provider Found: ${providerProfile.ownerName}`);
            console.log(`   Mess Name: "${providerProfile.messName}" (This should be displayed to customer)`);
            console.log(`   ID: ${providerId}`);
        } else {
            console.log('❌ Provider Profile NOT FOUND for ID: ' + providerId);
        }

        console.log('\n--- 2. CUSTOMER CHECK ---');
        // From previous log: 6989736055b23cd3b244425f (Sumit)
        const customerId = '6989736055b23cd3b244425f';
        const customer = await User.findById(customerId);
        if (customer) {
            console.log(`✅ Customer Found: ${customer.fullName}`);
        } else {
            console.log('❌ Customer NOT FOUND');
        }

        console.log('\n--- 3. SUBSCRIPTION CHECK ---');
        const sub = await Subscription.findOne({
            customer: customerId,
            provider: providerId,
            status: 'approved'
        });
        if (sub) {
            console.log(`✅ Active Subscription Found: ${sub.planName}`);
            console.log(`   Status: ${sub.status}`);
        } else {
            console.log('⚠️ No Active Subscription found between these users.');
        }

        console.log('\n--- 4. ORDER CHECK (Today) ---');
        const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
        const orders = await Order.find({
            provider: providerId,
            orderDate: { $gte: startOfDay }
        });

        if (orders.length > 0) {
            console.log(`✅ Today's Orders Found: ${orders.length}`);
            orders.forEach(o => {
                console.log(`   - Order #${o.orderNumber} | Status: ${o.status} | Customer: ${o.customer}`);
            });
        } else {
            console.log('❌ No orders found for this provider today.');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verifySystem();
