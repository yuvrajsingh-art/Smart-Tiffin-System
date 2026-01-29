const mongoose = require("mongoose");
const { Schema } = mongoose;

const RiderSchema = new Schema({
  name: String,
  phone: String,

  isOnline: { type: Boolean, default: false },
  currentOrder: { type: Schema.Types.ObjectId, ref: "Order", default: null },

  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: [Number]
  }
});

RiderSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Rider", RiderSchema);
