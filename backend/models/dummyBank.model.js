const mongoose = require("mongoose");

const dummyBankSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    bankName: {
        type: String,
        required: true,
        default: "Smart Tiffin Bank"
    },

    accountNumber: {
        type: String,
        required: true,
        unique: true
    },

    ifscCode: {
        type: String,
        required: true,
        default: "STBN0001"
    },

    balance: {
        type: Number,
        default: 0,
        min: 0
    },

    vpa: {
        type: String, // Virtual Payment Address for UPI
    },

    isPrimary: {
        type: Boolean,
        default: true
    },

    isMaster: {
        type: Boolean,
        default: false
    },

    masterUTR: {
        type: String, // Only used for Master Bank to validate transactions
        default: "STB999888777"
    }

}, { timestamps: true });

module.exports = mongoose.model("DummyBank", dummyBankSchema);
