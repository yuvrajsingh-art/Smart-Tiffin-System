const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  rider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },



  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subscription"
  },
  order_type: {
    type: String,
    enum: ["subscription", "one-time"],
    required: true
  },
  meal_type: {
    type: String,
    enum: ["lunch", "dinner"],
    required: true
  },
  // Items Snapshot
 items: [
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu"
    },
    name: String,
    price: Number,
    quantity: Number
  }
],

  // Financials
  itemTotal: Number,
  taxes: Number,
  deliveryFee: Number,
  platformFee: Number,
  grandTotal: Number,
  paymentId: String,


  status: {
    type: String,
    enum: [
      "Placed",
      "Accepted",
      "Preparing",
      "Ready",
      "Picked_Up",
      "Delivered",
      "Cancelled"
    ],
    default: "placed",
    index: true
  },

  cancellationReason: String,

  delivery_location: {
    lat: Number,
    lng: Number,
    address_text: String
  },
  otp: String,

  // Subscription
  isSubscription: { type: Boolean, default: false },
  scheduledFor: Date,

  timeline: [{ status: String, time: Date }],
  // Timestamps
  preparedAt: Date,
  deliveredAt: Date
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
