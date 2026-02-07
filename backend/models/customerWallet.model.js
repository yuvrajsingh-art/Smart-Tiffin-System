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
        default: 0
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
    },

    transactionPin: {
        type: String, // Hashed PIN
        default: null
    },

    settings: {
        autoRecharge: {
            type: Boolean,
            default: false
        },
        thresholdAmount: {
            type: Number,
            default: 200
        },
        rechargeAmount: {
            type: Number,
            default: 500
        },
        lowBalanceAlert: {
            type: Boolean,
            default: true
        }
    }

}, { timestamps: true });

module.exports = mongoose.model("CustomerWallet", customerWalletSchema);