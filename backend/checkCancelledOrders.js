const mongoose = require('mongoose');
require('dotenv').config();

const Order = require('./models/order.model');

async function checkCancelledOrders() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Find cancelled orders
        const cancelledOrders = await Order.find({ 
            status: 'cancelled' 
        })
        .sort({ updatedAt: -1 })
        .limit(5)
        .lean();

        console.log('\n🔍 Recent Cancelled Orders:');
        console.log('='.repeat(80));
        
        cancelledOrders.forEach((order, index) => {
            console.log(`\n${index + 1}. Order ID: ${order._id}`);
            console.log(`   Meal Type: ${order.mealType}`);
            console.log(`   Status: ${order.status}`);
            console.log(`   Cancelled By: ${order.cancelledBy || 'NOT SET ❌'}`);
            console.log(`   Created At: ${order.createdAt}`);
            console.log(`   Cancelled At: ${order.cancelledAt || 'NOT SET ❌'}`);
            console.log(`   Updated At: ${order.updatedAt}`);
        });

        console.log('\n' + '='.repeat(80));
        
        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

checkCancelledOrders();
