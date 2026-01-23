const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tiffin",
    },

    menuDate: {
      type: Date,
      required: true,
    },

    dayOfWeek: String,

    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner"],
      required: true,
    },

    items: [
      {
        name: { type: String, required: true },
        description: String,
        quantity: String
      }
    ],

    portionSize: {
      type: String,
      enum: ["small", "medium", "large"],
      default: "medium",
    },

    category: {
      type: String,
      enum: ["regular", "diet", "premium"],
      default: "regular",
    },

    tags: [String],

    calories: Number,

    isVeg: {
      type: Boolean,
      default: true,
    },

    maxOrders: {
      type: Number,
      default: 100,
    },

    orderCutoffTime: Date,

    image: String,

    note: String,

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

//  One menu per provider per date per meal
menuSchema.index(
  { provider: 1, menuDate: 1, mealType: 1 },
  { unique: true }
);

//  Auto calculate dayOfWeek
menuSchema.pre("save", function (next) {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  this.dayOfWeek = days[this.menuDate.getDay()];
  next();
});

module.exports = mongoose.model("Menu", menuSchema);
