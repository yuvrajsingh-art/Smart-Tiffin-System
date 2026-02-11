const mongoose = require("mongoose");

const storeProfileSchema = new mongoose.Schema({
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    // Store Profile
    mess_name: {
        type: String,
        required: true,
        trim: true
    },

    contact_number: {
        type: String,
        required: true,
        trim: true
    },

    cuisines: [{
        type: String
    }],

    // Kitchen Timings
    lunch_start: {
        type: String,
        required: true,
        default: "11:00 AM"
    },

    lunch_end: {
        type: String,
        required: true,
        default: "03:00 PM"
    },

    dinner_start: {
        type: String,
        required: true,
        default: "07:00 PM"
    },

    dinner_end: {
        type: String,
        required: true,
        default: "11:00 PM"
    },

    // Vacation Mode
    vacation_mode: {
        type: Boolean,
        default: false
    },

    vacation_reason: {
        type: String
    },

    vacation_start_date: {
        type: Date
    },

    vacation_end_date: {
        type: Date
    },

    // Delivery Zone
    delivery_radius_km: {
        type: Number,
        default: 5,
        min: 1,
        max: 50
    },

    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            default: [0, 0] // [longitude, latitude]
        }
    },

    // Additional Store Info
    description: {
        type: String,
        maxlength: 500
    },

    // New real data fields
    monthlyPrice: { type: Number, default: 3500 },
    weeklyPrice: { type: Number, default: 900 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    features: [{ type: String }], // e.g. ["Hygiene Verified"]

    store_image: {
        type: String // URL to store image
    },

    // Operating Status
    is_active: {
        type: Boolean,
        default: true
    },

    // Store Address
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        landmark: String
    }

}, { timestamps: true });

// Create geospatial index for location-based queries
storeProfileSchema.index({ location: "2dsphere" });
// Create indexes for efficient searching
storeProfileSchema.index({ mess_name: 1 });
storeProfileSchema.index({ "address.city": 1 });
storeProfileSchema.index({ mess_name: "text", description: "text", "address.city": "text" });

module.exports = mongoose.model("StoreProfile", storeProfileSchema);