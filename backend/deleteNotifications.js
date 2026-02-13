// Delete All Notifications Script
// Run: node deleteNotifications.js

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-tiffin')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err));

const Notification = require('./models/notification.model');

async function deleteAllNotifications() {
    try {
        const result = await Notification.deleteMany({});
        console.log(`✅ Deleted ${result.deletedCount} notifications`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

deleteAllNotifications();
