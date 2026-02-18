const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    created_by: {
        type: String,
        enum: ["admin", "provider", "customer"],
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

    lunchTime: {
        type: String,
        default: "12:30 PM"
    },

    dinnerTime: {
        type: String,
        default: "08:30 PM"
    },

    deliveryAddress: {
        street: String,
        city: String,
        pincode: String,
        phone: String
    },

    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending"
    },

    paymentMethod: {
        type: String,
        enum: ["UPI", "Cash", "Card", "Wallet"],
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "active", "cancelled", "cancellation_requested", "expired"],
        default: "pending"
    },

    adminApproval: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "approved"
    },

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
    skippedMeals: [{
        date: String, // YYYY-MM-DD
        mealType: {
            type: String,
            enum: ["lunch", "dinner"]
        },
        refundAmount: Number,
        skippedAt: {
            type: Date,
            default: Date.now
        }
    }],
    totalAmount: Number,
    mealTypes: [{
        type: String,
        enum: ["breakfast", "lunch", "dinner"]
    }],
    upgradedAt: Date,
    cancelledAt: Date,
    cancellationReason: String,
    refundAmount: Number, // Amount to be refunded upon cancellation
    transactionId: String // For UPI payments

}, { timestamps: true });

// Virtual field to calculate remaining days
subscriptionSchema.virtual('remainingDays').get(function() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(this.endDate);
    endDate.setHours(0, 0, 0, 0);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
});

// Ensure virtuals are included in JSON
subscriptionSchema.set('toJSON', { virtuals: true });
subscriptionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("subscription", subscriptionSchema);
