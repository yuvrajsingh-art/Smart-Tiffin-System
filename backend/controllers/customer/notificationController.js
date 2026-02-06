const Notification = require("../../models/notification.model");

/**
 * Get all notifications for the authenticated user
 * GET /api/customer/notifications
 */
exports.getNotifications = async (req, res) => {
    try {
        const customerId = req.user._id;

        // Fetch user-specific and global notifications
        const notifications = await Notification.find({
            $or: [
                { recipient: customerId },
                { recipient: null } // Global broadcasts
            ]
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                notifications
            }
        });

    } catch (error) {
        console.error("Fetch Notifications Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch notifications" });
    }
};

/**
 * Mark a notification as read
 * PUT /api/customer/notifications/:id/read
 */
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const customerId = req.user._id;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, recipient: customerId },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        res.json({ success: true, message: "Marked as read" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update notification" });
    }
};

/**
 * Mark all notifications as read
 * PUT /api/customer/notifications/mark-all-read
 */
exports.markAllAsRead = async (req, res) => {
    try {
        const customerId = req.user._id;

        await Notification.updateMany(
            { recipient: customerId, isRead: false },
            { isRead: true }
        );

        res.json({ success: true, message: "All notifications marked as read" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update notifications" });
    }
};
