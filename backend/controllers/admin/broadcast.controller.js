/**
 * =============================================================================
 * BROADCAST CONTROLLER
 * =============================================================================
 * Handles broadcast messaging operations
 * =============================================================================
 */

const User = require("../../models/user.model");
const Notification = require("../../models/notification.model");
const Settings = require("../../models/settings.model");

const { sendSuccess, sendError } = require("../../utils/responseHelper");
const { createLog, getOrCreateSettings } = require("./helpers");

/**
 * Send broadcast message to all users
 * @route POST /api/admin/broadcast
 * @body {String} message - Broadcast message (max 500 chars)
 */
exports.broadcastMessage = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || !message.trim()) {
            return sendError(res, 400, "Message is required");
        }

        // Validate message length
        if (message.length > 500) {
            return sendError(res, 400, "Message must be less than 500 characters");
        }

        // Update settings
        const settings = await getOrCreateSettings();
        settings.activeBroadcast = {
            message: message.trim(),
            createdAt: new Date(),
            isActive: true
        };
        await settings.save();

        // Create notifications for all users
        const users = await User.find({});
        const notifications = users.map(user => ({
            recipient: user._id,
            title: 'System Broadcast',
            message: message.trim(),
            type: 'Alert',
            isRead: false
        }));

        await Notification.insertMany(notifications);

        // Emit real-time event
        if (req.io) {
            req.io.emit('broadcast-msg', { message: message.trim() });
        }

        // Log action
        await createLog(
            'SYSTEM_BROADCAST',
            `Admin sent a global alert: ${message.substring(0, 30)}...`,
            req.user.id,
            'campaign',
            'text-blue-500'
        );

        return sendSuccess(res, 200, `Broadcast sent to ${users.length} users and saved to system.`);
    } catch (error) {
        console.error("Broadcast Error:", error.message);
        return sendError(res, 500, "Failed to send broadcast", error);
    }
};

/**
 * Clear active broadcast
 * @route DELETE /api/admin/broadcast
 */
exports.clearBroadcast = async (req, res) => {
    try {
        const settings = await Settings.findOne();
        if (settings && settings.activeBroadcast) {
            settings.activeBroadcast.isActive = false;
            await settings.save();
        }

        return sendSuccess(res, 200, "Broadcast cleared");
    } catch (error) {
        console.error("Clear Broadcast Error:", error.message);
        return sendError(res, 500, "Failed to clear broadcast", error);
    }
};
