const mongoose = require("mongoose");

const streakSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    lastOrderDate: {
        type: Date
    },
    totalOrders: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("Streak", streakSchema);