const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '../.env') });

const DummyBank = require('../models/dummyBank.model');

const syncMasterBank = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const masterBank = await DummyBank.findOne({ isMaster: true });
        if (masterBank) {
            console.log("Found Master Bank. Updating masterUTR...");
            masterBank.masterUTR = "STB999888777";
            await masterBank.save();
            console.log("Master Bank updated successfully!");
        } else {
            console.log("Master Bank not found. Creating new one...");
            await DummyBank.create({
                user: "690000000000000000000000",
                bankName: "Smart Tiffin Treasury",
                accountNumber: "STB-MASTER-001",
                vpa: "treasury@stbank",
                balance: 10000000,
                isMaster: true,
                isPrimary: true,
                masterUTR: "STB999888777"
            });
            console.log("Master Bank created successfully!");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error syncing Master Bank:", error);
        process.exit(1);
    }
};

syncMasterBank();
