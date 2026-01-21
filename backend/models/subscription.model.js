const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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

    status: {
        type: String,
        enum: ["Active", "Paused", "Cancelled", "Expired"],
        default: "Active"
    },

    pauseFrom: Date,
    pauseTo: Date

}, { timestamps: true });

module.exports = mongoose.model("subscription", subscriptionSchema);
