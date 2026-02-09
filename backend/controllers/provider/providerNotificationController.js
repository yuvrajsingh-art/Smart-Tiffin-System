const Notification = require("../../models/notification.model");

/**
 * Get notifications for provider (their own + global broadcasts)
 * GET /api/provider/notifications
 */
exports.getProviderNotifications = async (req, res) => {
    try {
        const providerId = req.user.id;

        // Get notifications for this provider OR global broadcasts (recipient: null)
        const notifications = await Notification.find({
            $or: [
                { recipient: providerId },
                { recipient: null }
            ]
        })
            .sort({ createdAt: -1 })
            .limit(50);

        // Transform to match frontend expected format
        const formattedNotifications = notifications.map(n => ({
            _id: n._id,
            title: n.title,
            message: n.message,
            type: n.type,
            read: n.isRead,
            createdAt: n.createdAt,
            metadata: n.metadata
        }));

        res.status(200).json({
            success: true,
            data: formattedNotifications
        });
    } catch (error) {
        console.error("Error fetching provider notifications:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications"
        });
    }
};

/**
 * Mark notification as read
 * PATCH /api/provider/notifications/:id/read
 */
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Notification marked as read"
        });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update notification"
        });
    }
};

/**
 * Mark all notifications as read
 * PATCH /api/provider/notifications/mark-all-read
 */
exports.markAllAsRead = async (req, res) => {
    try {
        const providerId = req.user.id;

        await Notification.updateMany(
            {
                $or: [
                    { recipient: providerId },
                    { recipient: null }
                ],
                isRead: false
            },
            { isRead: true }
        );

        res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });
    } catch (error) {
        console.error("Error marking all as read:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update notifications"
        });
    }
};
