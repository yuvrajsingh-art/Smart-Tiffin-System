const mongoose = require("mongoose");
const User = require("./models/user.model");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Apna MongoDB URL yahan ensure karo
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smart-tiffin";

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database Connected...");

    const adminEmail = "admin@smarttiffin.com";
    const adminPassword = "admin123"; // Baad mein change kar lena

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin pehle se bana hua hai!");
      process.exit();
    }

    // Create Admin
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const newAdmin = await User.create({
      fullName: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      mobile: "9999999999",
      role: "admin",
      address: "Headquarters",
      isVerified: true
    });

    console.log("✅ New Admin Created Successfully!");
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();