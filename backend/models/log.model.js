const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    event: { type: String, required: true }, // e.g., 'PROVIDER_VERIFIED', 'SETTINGS_UPDATED'
    detail: { type: String },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, default: 'admin' },
    icon: { type: String, default: 'info' },
    color: { type: String, default: 'text-indigo-500' },
    time: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Log", logSchema);
