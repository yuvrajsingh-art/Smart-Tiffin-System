const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/user.model');
const Order = require('../models/order.model');

dotenv.config({ path: path.join(__dirname, '../.env') });

const verifyAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to DB');

        console.log('\n--- ADMIN ROLE CHECK ---');
        const admin = await User.findOne({ role: 'admin' });
        if (admin) {
            console.log(`✅ Admin User Found: ${admin.email}`);
            console.log(`   ID: ${admin._id}`);
        } else {
            console.log('❌ FATAL: No Admin User found!');
        }

        console.log('\n--- SYSTEM HEALTH CHECK (Admin View) ---');
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();

        console.log(`✅ System Stats Accessible:`);
        console.log(`   - Total Users: ${totalUsers}`);
        console.log(`   - Total Orders: ${totalOrders}`);

        if (totalUsers > 0 && totalOrders > 0) {
            console.log('✅ Data exists for Admin Dashboard.');
        } else {
            console.log('⚠️ System seems empty.');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verifyAdmin();
