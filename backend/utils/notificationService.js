const Notification = require("../models/notification.model");

/**
 * Utility to create a notification for a user
 * @param {string} userId - Recipient User ID
 * @param {string} title - Notification Title
 * @param {string} message - Notification Body
 * @param {string} type - Info, Warning, Success, Alert
 * @param {object} metadata - Optional extra data
 */
exports.createNotification = async (userId, title, message, type = "Info", metadata = {}) => {
    try {
        const notification = await Notification.create({
            recipient: userId,
            title,
            message,
            type,
            metadata
        });
        return notification;
    } catch (error) {
        console.error("Failed to create notification:", error);
        // We don't throw here to avoid breaking the calling flow (e.g. if a refund succeeds but notification fails)
        return null;
    }
};
