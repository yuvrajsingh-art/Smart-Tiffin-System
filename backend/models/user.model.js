const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  mobile: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["customer", "provider", "admin"],
    required: true
  },
  profile_image: String,
  // 🔹 Manual Address
  address: {
    type: String
  },

  // 🔹 Location (GPS based)
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: "2dsphere"
    }
  },

  isVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String, enum: ["active", "banned"], default: "active"
  },

  // Profile fields
  dietPreference: {
    type: String,
    enum: ["Pure Veg", "Non-Veg", "Jain"],
    default: "Pure Veg"
  },

  // Subscription tracking (for easy DB queries)
  activeSubscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'subscription',
    default: null
  },
  hasActiveSubscription: {
    type: Boolean,
    default: false
  },

  deletedAt: Date,
  deletionReason: String
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

