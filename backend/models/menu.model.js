const mongoose = require("mongoose");

const addOnSchema = new mongoose.Schema({
  name: String,
  price: Number,
  isActive: {
    type: Boolean,
    default: true
  }
});
const menuSchema = new mongoose.Schema({
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  image: String,

  category: {
    type: String,
    enum: ["Thali", "Bowl", "Combo", "Bread", "Curry"],
    required: true
  },

  type: {
    type: String,
    enum: ["Veg", "Non-Veg", "Egg"],
    required: true
  },

  mealType: {
    type: String,
    enum: ["lunch", "dinner"],
    required: true
  },

  availableDays: [{
    type: String,
    enum: [
      "Monday","Tuesday","Wednesday",
      "Thursday","Friday","Saturday","Sunday"
    ],
    required: true
  }],

  isAvailable: { type: Boolean, default: true },
  isPublished: { type: Boolean, default: false },

  approvalStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  }

}, { timestamps: true });

menuSchema.index(
  { provider: 1, mealType: 1, availableDays: 1 },
  { unique: true }
);



module.exports = mongoose.model("Menu", menuSchema);
