const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Plan name is required"],
        trim: true
    },
    type: {
        type: String,
        enum: ["Veg", "Non-Veg", "Diet", "Jain"],
        required: true
    },
    period: {
        type: String,
        enum: ["Monthly", "Weekly", "Trial"],
        default: "Monthly"
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: "from-emerald-400 to-emerald-600"
    },
    badge: {
        type: String, // e.g., "Popular", "Best Value", "Premium"
        default: ""
    },
    isStandard: {
        type: Boolean,
        default: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null // Null for standard platform plans
    },
    isActive: {
        type: Boolean,
        default: false // Plans are inactive until approved
    },
    verificationStatus: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    },
    rejectionReason: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.models.Plan || mongoose.model("Plan", planSchema);
