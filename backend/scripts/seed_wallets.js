const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from one level up (backend folder)
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/user.model');
const CustomerWallet = require('../models/customerWallet.model');

const seedWallets = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI not found in env');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");

        const customers = await User.find({ role: 'customer' });
        console.log(`Found ${customers.length} customers`);

        for (const customer of customers) {
            let wallet = await CustomerWallet.findOne({ customer: customer._id });
            if (!wallet) {
                wallet = new CustomerWallet({
                    customer: customer._id,
                    balance: 10000
                });
                await wallet.save();
                console.log(`Created wallet for ${customer.fullName} (₹10,000)`);
            } else if (wallet.balance < 1000) {
                wallet.balance = 10000;
                await wallet.save();
                console.log(`Topped up wallet for ${customer.fullName} to ₹10,000`);
            }
        }

        console.log("Seeding complete.");
        process.exit(0);
    } catch (error) {
        console.error("Seeding Error:", error);
        process.exit(1);
    }
};

seedWallets();
