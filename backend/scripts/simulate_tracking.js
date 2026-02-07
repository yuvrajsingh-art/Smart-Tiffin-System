
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/user.model');

// Connect DB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('DB Error:', err);
        process.exit(1);
    }
};

const simulate = async () => {
    await connectDB();

    try {
        // 1. Find a Customer
        const customer = await User.findOne({ role: 'customer' });
        if (!customer) throw new Error("No customer found");

        console.log(`Found Customer: ${customer.fullName} (${customer.email})`);

        // 2. Generate Token
        const token = jwt.sign({ id: customer._id, role: customer.role }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        const api = axios.create({
            baseURL: 'http://localhost:5000/api/customer/track',
            headers: { Authorization: `Bearer ${token}` }
        });

        // 3. Initialize Order
        console.log("\n🚀 Initializing Test Order...");
        try {
            const initRes = await api.post('/initialize-test');
            console.log("✅ Order Initialized:", initRes.data.order.status);
        } catch (e) {
            console.log("⚠️  Order Init Note:", e.response?.data?.message || e.message);
        }

        // 4. Advance Status Loop
        const steps = ['cooking', 'prepared', 'out_for_delivery', 'delivered'];

        for (const step of steps) {
            console.log(`\n⏳ Waiting 5 seconds before moving to next step...`);
            await new Promise(r => setTimeout(r, 5000));

            try {
                const res = await api.post('/advance-test');
                if (res.data.success) {
                    console.log(`✅ Status Updated: ${res.data.nextStatus.toUpperCase()}`);
                } else {
                    console.log(`ℹ️  Update Info: ${res.data.message}`);
                }
            } catch (e) {
                console.error("❌ Update Failed:", e.response?.data?.message || e.message);
            }
        }

        console.log("\n✨ Simulation Complete!");
        process.exit(0);

    } catch (error) {
        console.error("Simulation Error:", error);
        process.exit(1);
    }
};

simulate();
