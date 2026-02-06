const mongoose = require("mongoose");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function resetAdminPassword() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ DB Connected");

        const adminEmail = "admin@gmail.com";
        const newPassword = "admin123";
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const result = await User.findOneAndUpdate(
            { email: adminEmail },
            {
                password: hashedPassword,
                isVerified: true,
                status: 'active'
            },
            { new: true }
        );

        if (result) {
            console.log(`✅ Admin Password Reset Successful!`);
            console.log(`📧 Email: ${adminEmail}`);
            console.log(`🔑 New Password: ${newPassword}`);
        } else {
            console.log(`❌ Admin user not found with email: ${adminEmail}`);
        }

        process.exit(0);

    } catch (error) {
        console.error("❌ Reset Failed:", error);
        process.exit(1);
    }
}

resetAdminPassword();
