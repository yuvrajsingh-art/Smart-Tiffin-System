const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const Order = require('../models/order.model');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const checkOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        let log = `Checking orders between ${startOfDay.toISOString()} and ${endOfDay.toISOString()}\n`;

        const orders = await Order.find({
            orderDate: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        log += `Found ${orders.length} orders for today.\n`;
        if (orders.length > 0) {
            log += 'Sample Order Summary:\n';
            log += `- Order ID: ${orders[0]._id}\n`;
            log += `- Status: ${orders[0].status}\n`;
            log += `- Provider ID: ${orders[0].provider}\n`;
            log += `- Customer ID: ${orders[0].customer}\n`;
            log += `- Order Date: ${orders[0].orderDate}\n`;
        } else {
            // Check total orders
            const totalOrders = await Order.countDocuments();
            log += `Total orders in DB (all time): ${totalOrders}\n`;
        }

        fs.writeFileSync('order_check_log.txt', log);
        console.log('Log written to order_check_log.txt');

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkOrders();
