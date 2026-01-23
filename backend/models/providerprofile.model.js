const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    kitchenName: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    address: {
      fullAddress: String,
      city: String,
      state: String,
      pincode: String
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },

    services: {
      breakfast: { type: Boolean, default: false },
      lunch: { type: Boolean, default: false },
      dinner: { type: Boolean, default: false }
    },

    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

providerSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Provider", providerSchema);
