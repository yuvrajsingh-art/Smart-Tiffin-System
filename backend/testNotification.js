// Quick Test Script - Create Test Notification
// Run this in backend folder: node testNotification.js

const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-tiffin')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err));

const Notification = require('./models/notification.model');
const User = require('./models/user.model');

async function createTestNotification() {
    try {
        // Find first customer
        const customer = await User.findOne({ role: 'customer' });
        
        if (!customer) {
            console.log('❌ No customer found. Please create a customer first.');
            process.exit(1);
        }

        console.log('✅ Found customer:', customer.fullName, customer._id);

        // Create test notification
        const notification = await Notification.create({
            recipient: customer._id,
            title: 'Test Notification',
            message: 'This is a test notification created at ' + new Date().toLocaleTimeString(),
            type: 'Info',
            metadata: { test: true }
        });

        console.log('✅ Test notification created:', notification._id);
        console.log('📋 Notification details:', {
            title: notification.title,
            message: notification.message,
            recipient: notification.recipient,
            createdAt: notification.createdAt
        });

        // Count total notifications for this user
        const count = await Notification.countDocuments({ recipient: customer._id });
        console.log(`📊 Total notifications for ${customer.fullName}: ${count}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

createTestNotification();
