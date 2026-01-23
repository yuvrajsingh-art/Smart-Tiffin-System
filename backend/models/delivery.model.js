const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    // kis order ki delivery
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tiffin",
      required: true,
      unique: true, // one delivery per order
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    deliveryDate: {
      type: Date,
      required: true,
    },

    // Current delivery status
    status: {
      type: String,
      enum: [
        "Pending",
        "Prepared",
        "OutForDelivery",
        "Delivered",
        "Delayed",
        "Cancelled",
      ],
      default: "Pending",
    },

    // Tracking timeline
    timeline: [
      {
        status: String,
        time: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],

    // Optional
    expectedDeliveryTime: String, // "13:30"
    deliveredAt: Date,

    remark: String, // delay reason etc
  },
  { timestamps: true }
);

module.exports = mongoose.model("Delivery", deliverySchema);
