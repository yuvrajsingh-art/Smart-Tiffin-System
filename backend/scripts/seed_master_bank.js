const mongoose = require("mongoose");
const DummyBank = require("../models/dummyBank.model");
require("dotenv").config();

const seedMasterBank = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Check if Master Bank already exists
        let masterBank = await DummyBank.findOne({ isMaster: true });
        
        if (masterBank) {
            console.log("✅ Master Bank already exists:");
            console.log(`   Bank Name: ${masterBank.bankName}`);
            console.log(`   Account: ${masterBank.accountNumber}`);
            console.log(`   Balance: ₹${masterBank.balance}`);
            console.log(`   Master UTR: ${masterBank.masterUTR}`);
        } else {
            // Create Master Bank
            masterBank = await DummyBank.create({
                user: "690000000000000000000000",
                bankName: "Smart Tiffin Treasury",
                accountNumber: "STB-MASTER-001",
                ifscCode: "STBN0001",
                balance: 10000000, // 1 Crore
                vpa: "treasury@stbank",
                isPrimary: true,
                isMaster: true,
                masterUTR: "STB999888777"
            });
            
            console.log("✅ Master Bank created successfully:");
            console.log(`   Bank Name: ${masterBank.bankName}`);
            console.log(`   Account: ${masterBank.accountNumber}`);
            console.log(`   Balance: ₹${masterBank.balance}`);
            console.log(`   Master UTR: ${masterBank.masterUTR}`);
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

seedMasterBank();
