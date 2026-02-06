const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));

async function createAdmin() {

  const email = "admin@gmail.com";

  const admin = await User.findOne({ email });
  if (admin) {
    console.log("❌ Admin already exists");
    process.exit();
  }

  const password = await bcrypt.hash("admin123", 10);

  await User.create({
    fullName: "Admin",
    email: "admin@gmail.com",
    password: password,
    mobile: "9999999999",   // 👈 REQUIRED
    role: "admin",          // 👈 IMPORTANT
    isVerified: true
  });


  console.log("✅ Admin Created Successfully");
  console.log("Email: admin@gmail.com");
  console.log("Password: admin123");

  process.exit();
}

createAdmin();
