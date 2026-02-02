const mongoose = require("mongoose");

const addOnSchema = new mongoose.Schema({
  name: String,
  price: Number,
  isActive: {
    type: Boolean,
    default: true
  }
});

const menuSchema = new mongoose.Schema(
  {
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
    spiceLevel: { type: String, enum: ["Low", "Medium", "High"] },


    isAvailable: { type: Boolean, default: true },
    availableSlots: [{ type: String, enum: ["Lunch", "Dinner"] }],
    availableDays: [{
      type: String,
      enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      default: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    }],
    // Date + Meal
    menuDate: {
      type: Date,
      required: true
    },

    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner"],
      default: "lunch"
    },

    // MAIN ITEMS
    mainDish: String,              // Paneer Butter Masala
    sabjiDry: String,              // Aloo Gobi Matar
    dal: String,                   // Dal Tadka Yellow
    rice: String,                 // Jeera Rice

    // BREAD
    bread: {
      type: {
        type: String,   // Butter Roti
        required: true
      },
      count: {
        type: Number,   // 4
        required: true
      }
    },


    // ACCOMPANIMENTS
    accompaniments: {
      salad: { type: Boolean, default: false },
      pickle: { type: Boolean, default: false },
      papad: { type: Boolean, default: false },
      raita: { type: Boolean, default: false }
    },

    // SPECIAL THALI
    isSpecialThali: {
      type: Boolean,
      default: false
    },

    specialThaliPrice: Number,

    // ADD-ONS / UPSELLS
    addOns: [addOnSchema],

    // STATUS
    operationalStatus: {
      type: String,
      enum: ["open", "soldout"],
      default: "open"
    },

    isPublished: {
      type: Boolean,
      default: false
    },
    publishedAt: Date,

    // Admin Control
    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending"
    },
    adminRemarks: String
  },
  { timestamps: true }
);
menuSchema.index(
  { provider: 1, menuDate: 1, mealType: 1 },
  { unique: true }
);


module.exports = mongoose.model("Menu", menuSchema);
