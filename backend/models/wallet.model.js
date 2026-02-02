const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    
    totalEarnings: {
        type: Number,
        default: 0
    },
    
    withdrawableBalance: {
        type: Number,
        default: 0
    },
    
    lockedAmount: {
        type: Number,
        default: 0
    },
    
    monthlyChange: {
        type: Number,
        default: 0 // percentage change
    }
    
}, { timestamps: true });

module.exports = mongoose.model("Wallet", walletSchema);