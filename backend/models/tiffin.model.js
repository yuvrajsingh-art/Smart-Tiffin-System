const mongoose = require("mongoose");

const tiffinSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    planName: {
      type: String,
      required: true,
    },

    planType: {
      type: String,
      enum: ["weekly", "monthly"],
      required: true,
    },

    totalDays: {
      type: Number,
      required: true,
    },

    mealTypes: [
      {
        type: String,
        enum: ["breakfast", "lunch", "dinner"],
      },
    ],

    price: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tiffin", tiffinSchema);



