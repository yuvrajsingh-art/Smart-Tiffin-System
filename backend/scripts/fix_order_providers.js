const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Order = require('../models/order.model');

dotenv.config({ path: path.join(__dirname, '../.env') });

const fixOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const validProviderId = '6985a73ce2c554614b48ef02'; // Sunita Vyas

        console.log(`Updating orders to Provider: ${validProviderId}`);

        const result = await Order.updateMany(
            { status: { $ne: 'delivered' } }, // Update all non-delivered orders
            { $set: { provider: validProviderId } }
        );

        console.log(`Updated ${result.modifiedCount} orders.`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

fixOrders();
