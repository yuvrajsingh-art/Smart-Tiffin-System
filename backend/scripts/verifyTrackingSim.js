const axios = require('axios');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: 'backend/.env' }); // Adjusted for running from root

// CONFIG
const BASE_URL = 'http://localhost:5000/api';
const EMAIL = 'customer@gmail.com';
const PASSWORD = 'password123';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const simulateTracking = async () => {
    try {
        console.log("🚀 Starting Tracking Simulation...");

        // 0. Connect and Reset Password (to ensure login works)
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Smart-Tiffin-System');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(PASSWORD, salt);

        const user = await User.findOneAndUpdate(
            { email: EMAIL },
            { password: hashedPassword },
            { new: true }
        );

        if (!user) {
            console.error("❌ User not found in DB! Please run seed script.");
            process.exit(1);
        }
        console.log("✅ Password reset for simulation.");

        // 1. Login
        console.log("🔑 Logging in...");
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            email: EMAIL,
            password: PASSWORD
        });
        const token = loginRes.data.token;
        console.log("✅ Logged in!");

        // 2. Initialize Test Order
        console.log("📦 Initializing Test Order...");
        const initRes = await axios.post(
            `${BASE_URL}/customer/track/initialize-test`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("✅ Order Initialized:", initRes.data.message);

        // 3. Cycle Statuses
        const steps = 5;
        for (let i = 0; i < steps; i++) {
            console.log(`⏳ Waiting 5 seconds...`);
            await sleep(5000);

            console.log(`🔄 Advancing Status (${i + 1}/${steps})...`);
            try {
                const advRes = await axios.post(
                    `${BASE_URL}/customer/track/advance-test`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (advRes.data.success) {
                    console.log(`✅ Status Advanced: ${advRes.data.nextStatus.toUpperCase()}`);
                } else {
                    console.log(`⚠️  ${advRes.data.message}`);
                }
            } catch (err) {
                console.error("❌ Advance Failed:", err.response?.data?.message || err.message);
            }
        }

        console.log("🎉 Simulation Complete! Check Frontend.");

    } catch (error) {
        console.error("❌ Simulation Error:", error.response?.data?.message || error.message);
    } finally {
        await mongoose.disconnect();
    }
};

simulateTracking();
