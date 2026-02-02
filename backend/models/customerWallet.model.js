const mongoose = require("mongoose");

const customerWalletSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    
    balance: {
        type: Number,
        default: 0,
        min: 0
    },
    
    totalAdded: {
        type: Number,
        default: 0
    },
    
    totalSpent: {
        type: Number,
        default: 0
    },
    
    monthlySavings: {
        type: Number,
        default: 0
    },
    
    streakRewards: {
        type: Number,
        default: 0
    }
    
}, { timestamps: true });

module.exports = mongoose.model("CustomerWallet", customerWalletSchema);