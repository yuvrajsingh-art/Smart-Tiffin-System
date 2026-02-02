const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    // Operational Settings
  isActive: { type: Boolean, default: false },
  autoAccept: { type: Boolean, default: false },
  preparationTime: { type: Number, default: 30 }, // minutes
  serviceRadius: { type: Number, default: 5 }, // km

    // STEP 1 – IDENTITY
    messName: { type: String, required: true },
    description: { type: String },
    ownerName: { type: String },
    phone: { type: String },
    profileImage: { type: String },
    bannerImage: { type: String },

    // STEP 2 – LEGAL
    fssaiNumber: { type: String },
    fssaiCertificate: { type: String },
    legalStatus: {
      type: String,
      enum: ["pending", "verified", "suspended", "rejected"],
      default: "pending"
    },

    // STEP 3 – OPERATIONS

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [lng, lat]
        index: "2dsphere"
      },
      address: { type: String, required: true },
      city: { type: String, required: true, index: true },
      pincode: { type: String, required: true }
    },
    deliveryRadius: Number,
    orderCutoffTime: String,

    // STEP 4 – BANKING
    bankDetails: {
      accountHolderName: String,
      accountNumber: String,
      ifscCode: String
    },

    onboardingStep: {
      type: Number,
      default: 1
    },

    isOnboardingComplete: {
      type: Boolean,
      default: false
    },
    // DASHBOARD FIELDS
    kitchenStatus: {
      type: Boolean,
      default: true // ON
    },

    rating: {
      type: Number,
      default: 0
    },

    totalReviews: {
      type: Number,
      default: 0
    },
    commission_rate: { type: Number, default: 15 },
    documents: {
      aadharCard: String,
      panCard: String,
      cancelledCheque: String,
      fssaiCert: String
    },
  },

  { timestamps: true }
);
providerSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Provider", providerSchema);
