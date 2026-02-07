const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    label: {
        type: String,
        enum: ['Home', 'Work', 'Hostel', 'Other'],
        default: 'Home'
    },
    line: {
        type: String,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    }
});

const customerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    dietPreference: {
        type: String,
        enum: ["Pure Veg", "Non-Veg", "Jain"],
        default: "Pure Veg"
    },
    foodPreferences: {
        spiceLevel: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },
        sweetTooth: { type: Boolean, default: false }, // Wants sweets/desert often?
        allergies: [{ type: String }] // e.g. "Peanuts", "Mushrooms"
    },
    addresses: [addressSchema],

    // Subscription linkage
    activeSubscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subscription',
        default: null
    },
    hasActiveSubscription: {
        type: Boolean,
        default: false
    },

    // Preferences/Engagement
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider' // Assuming Provider is User model or StoreProfile?
    }],

    // Metadata
    totalOrders: {
        type: Number,
        default: 0
    },
    totalSpent: {
        type: Number,
        default: 0
    },
    securitySettings: {
        enhancedEncryption: { type: Boolean, default: false },
        loginAlerts: { type: Boolean, default: true }
    }
}, { timestamps: true });

// Pre-find hook to populate user details if needed? 
// Usually we do the reverse (find Customer and populate User)

module.exports = mongoose.model('Customer', customerSchema);
