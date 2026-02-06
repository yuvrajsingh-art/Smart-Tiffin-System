const mongoose = require("mongoose");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function resetCustomerPassword() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ DB Connected");

        const customerEmail = "customer@gmail.com";
        const newPassword = "customer123";
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const result = await User.findOneAndUpdate(
            { email: customerEmail },
            {
                password: hashedPassword,
                isVerified: true,
                status: 'active'
            },
            { new: true }
        );

        if (result) {
            console.log(`✅ Customer Password Reset Successful!`);
            console.log(`📧 Email: ${customerEmail}`);
            console.log(`🔑 New Password: ${newPassword}`);
        } else {
            console.log(`❌ Customer user not found with email: ${customerEmail}`);
        }

        process.exit(0);

    } catch (error) {
        console.error("❌ Reset Failed:", error);
        process.exit(1);
    }
}

resetCustomerPassword();
