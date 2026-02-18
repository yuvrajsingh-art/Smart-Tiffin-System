const Notification = require("../../models/notification.model");

/**
 * Get notifications for provider (their own + global broadcasts)
 * GET /api/provider/notifications
 */
exports.getProviderNotifications = async (req, res) => {
    try {
        const providerId = req.user._id || req.user.id;

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
        const providerId = req.user._id || req.user.id;

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

/**
 * Send bulk notification to customers
 * POST /api/provider-notifications/bulk
 */
exports.sendBulkNotification = async (req, res) => {
    try {
        const providerId = req.user._id || req.user.id;
        const { title, message, customerIds } = req.body;

        if (!title || !message) {
            return res.status(400).json({
                success: false,
                message: "Title and message are required"
            });
        }

        // If customerIds provided, send to specific customers, otherwise send to all provider's customers
        const Subscription = require("../../models/subscription.model");
        
        let targetCustomers = [];
        if (customerIds && customerIds.length > 0) {
            targetCustomers = customerIds;
        } else {
            // Get all active customers of this provider
            const subscriptions = await Subscription.find({
                provider: providerId,
                status: { $in: ["approved", "active"] }
            }).distinct("customer");
            targetCustomers = subscriptions;
        }

        if (targetCustomers.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No customers found to send notification"
            });
        }

        // Create notifications for all customers
        const notifications = targetCustomers.map(customerId => ({
            recipient: customerId,
            title,
            message,
            type: "Info",
            isRead: false,
            metadata: { sentBy: "provider", providerId }
        }));

        await Notification.insertMany(notifications);

        res.status(200).json({
            success: true,
            message: `Notification sent to ${targetCustomers.length} customer(s)`,
            count: targetCustomers.length
        });
    } catch (error) {
        console.error("Error sending bulk notification:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send notification"
        });
    }
};
