const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null // Null means 'All' (Global Broadcast)
        },
        title: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ["Info", "Warning", "Success", "Alert"],
            default: "Info"
        },
        isRead: {
            type: Boolean,
            default: false
        },
        metadata: {
            type: Object, // For linking to OrderID, etc.
            default: {}
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
