const Notification = require("../models/notification.model");

let io = null;

exports.setSocketIO = (socketIO) => {
    io = socketIO;
};

exports.createNotification = async (userId, title, message, type = "Info", metadata = {}) => {
    try {
        console.log('🔔 Creating notification:', { userId, title, message, type });
        
        const notification = await Notification.create({
            recipient: userId,
            title,
            message,
            type,
            metadata
        });

        console.log('✅ Notification created in DB:', notification._id);

        // Emit real-time notification
        if (io && userId) {
            console.log('📡 Emitting notification to room: user_' + userId);
            io.to(`user_${userId}`).emit('notification', {
                _id: notification._id,
                title: notification.title,
                message: notification.message,
                type: notification.type,
                isRead: false,
                metadata: notification.metadata,
                createdAt: notification.createdAt
            });
            console.log('✅ Notification emitted successfully');
        } else {
            console.log('⚠️ Socket.io not available or no userId');
        }

        return notification;
    } catch (error) {
        console.error("❌ Failed to create notification:", error);
        return null;
    }
};

exports.createBulkNotifications = async (userIds, title, message, type = "Info", metadata = {}) => {
    try {
        const notifications = userIds.map(userId => ({
            recipient: userId,
            title,
            message,
            type,
            metadata
        }));

        const created = await Notification.insertMany(notifications);

        // Emit to all users
        if (io) {
            userIds.forEach((userId, index) => {
                io.to(`user_${userId}`).emit('notification', {
                    _id: created[index]._id,
                    title,
                    message,
                    type,
                    isRead: false,
                    metadata,
                    createdAt: created[index].createdAt
                });
            });
        }

        return created;
    } catch (error) {
        console.error("Failed to create bulk notifications:", error);
        return null;
    }
};
