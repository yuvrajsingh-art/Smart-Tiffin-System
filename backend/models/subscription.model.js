const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    created_by: {
        type: String,
        enum: ["admin", "provider"],
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    planName: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ["weekly", "monthly"],
        required: true
    },
    category: {
        type: String,
        enum: ["veg", "non-veg", "jain"],
        required: true
    },
    description: String,

    variance_from_standard: Number,

    durationInDays: {
        type: Number,
        required: true
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },
   

    mealType: {
        type: String,
        enum: ["Lunch", "Dinner", "Both"],
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending"
    },

    paymentMethod: {
        type: String,
        enum: ["UPI", "Cash", "Card"],
    },
    status:
        { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },

    adminApproval: {
         type: String, 
         enum: ["pending", "approved", "rejected"], 
         default: "approved" },

    pauseFrom: Date,
    pauseTo: Date,
    pauseReason: String,
    
    // New fields for subscription management
    pausedDates: [String], // Array of date strings (YYYY-MM-DD)
    planType: {
        type: String,
        enum: ["veg", "non-veg", "jain"],
        default: "veg"
    },
    totalAmount: Number,
    mealTypes: [{
        type: String,
        enum: ["breakfast", "lunch", "dinner"]
    }],
    upgradedAt: Date,
    cancelledAt: Date,
    cancellationReason: String

}, { timestamps: true });

module.exports = mongoose.model("subscription", subscriptionSchema);
