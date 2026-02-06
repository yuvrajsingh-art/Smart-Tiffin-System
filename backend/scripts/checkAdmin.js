const mongoose = require("mongoose");
const User = require("./models/user.model");
require("dotenv").config();

const checkAdmin = async () => {
    try {
        console.log("Connecting to:", process.env.MONGO_URI.split('@')[1]); // Log only the host part for security
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Database Connected.");

        const email = "admin@smarttiffin.com";
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`❌ User with email "${email}" NOT found in this database.`);
            console.log("Tip: Run 'node createAdmin.js' to create the user.");
        } else {
            console.log(`✅ User found!`);
            console.log(`- FullName: ${user.fullName}`);
            console.log(`- Role: ${user.role}`);
            console.log(`- Password Hashed: ${user.password.substring(0, 10)}...`);

            if (user.role !== 'admin') {
                console.log("⚠️ Warning: User exists but is NOT an admin.");
            }
        }
    } catch (error) {
        console.error("❌ Diagnostic Error:", error.message);
    } finally {
        mongoose.connection.close();
    }
};

checkAdmin();
