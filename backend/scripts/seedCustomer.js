const mongoose = require('mongoose');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

async function seedCustomer() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Smart-Tiffin-System');

        const email = 'customer@gmail.com';
        // Create user
        await User.deleteOne({ email });

        const hashedPassword = await bcrypt.hash('password', 10);

        const user = new User({
            fullName: 'Test Customer',
            email: email,
            password: hashedPassword,
            mobile: '9876543210',
            role: 'customer',
            address: '123 Test St, Indore',
            dietPreference: 'Pure Veg'
        });

        await user.save();

        console.log(`✅ Created Customer: ${user.fullName} (${user._id})`);

    } catch (err) {
        console.error("❌ Seeding Failed:", err.message);
        console.error(err.stack);
    } finally {
        await mongoose.disconnect();
    }
}

seedCustomer();
