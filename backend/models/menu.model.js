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

  // Meal items array (e.g. ["Roti (4)", "Paneer Sabji", "Dal Fry", "Steamed Rice"])
  items: [{
    name: { type: String, required: true },
    color: { type: String, default: "green" } // green, orange, yellow, etc.
  }],

  // Nutritional info
  calories: { type: Number, default: 0 },

  // Menu label (e.g. "STANDARD LUNCH", "PREMIUM DINNER")
  menuLabel: { type: String },

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

  // For weekly planning - which day this menu is for
  menuDate: { type: Date },

  availableDays: [{
    type: String,
    enum: [
      "Monday", "Tuesday", "Wednesday",
      "Thursday", "Friday", "Saturday", "Sunday"
    ]
  }],

  isAvailable: { type: Boolean, default: true },
  isPublished: { type: Boolean, default: true }, // Default to Published
  isHoliday: { type: Boolean, default: false },

  approvalStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Approved" // Default to Approved
  }

}, { timestamps: true });

// Simplified index for performance
menuSchema.index({ provider: 1, mealType: 1, menuDate: 1 });



module.exports = mongoose.model("Menu", menuSchema);
