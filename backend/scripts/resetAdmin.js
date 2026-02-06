const mongoose = require("mongoose");
const User = require("./models/user.model");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Database Connected.");

        const email = "sumit@smarttiffin.com";
        const newPassword = "@Admin123";

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const result = await User.findOneAndUpdate(
            { email },
            {
                password: hashedPassword,
                role: 'admin',
                fullName: 'Super Admin',
                isVerified: true
            },
            { upsert: true, new: true }
        );

        console.log(`✅ Admin password for ${email} has been set to: ${newPassword}`);
        console.log("User Data:", result);

    } catch (error) {
        console.error("❌ Reset Error:", error.message);
    } finally {
        mongoose.connection.close();
    }
};

resetAdmin();
