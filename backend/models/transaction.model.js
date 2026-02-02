const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    
    transactionType: {
        type: String,
        enum: ["Order Payment", "Payout to Bank", "Penalty", "Refund", "Commission Deduction"],
        required: true
    },
    
    referenceId: {
        type: String, // Order ID or Reference like "Order #ST-29384" or "Ref: HDFC_8821"
        required: true
    },
    
    amount: {
        type: Number,
        required: true // positive for income, negative for deduction
    },
    
    status: {
        type: String,
        enum: ["Success", "Processed", "Failed", "Pending"],
        default: "Pending"
    },
    
    description: {
        type: String
    },
    
    bankDetails: {
        accountNumber: String,
        ifscCode: String,
        bankName: String
    },
    
    // For tracking order related transactions
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
    
    // For tracking subscription related transactions
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subscription"
    }
    
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);