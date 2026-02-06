const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/user.model');

async function checkDB() {
    try {
        console.log("⏳ Connecting to DB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const latestUser = await User.findOne().sort({ createdAt: -1 });
        if (latestUser) {
            console.log("🔍 Latest User in DB:");
            console.log("Name:", latestUser.fullName);
            console.log("Email:", latestUser.email);
            console.log("Role:", latestUser.role);
            console.log("Created At:", latestUser.createdAt);
        } else {
            console.log("⚠️ No users found in DB.");
        }

    } catch (error) {
        console.error("❌ DB Query Failed:", error.message);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

checkDB();
