import React from 'react';
import { useNotifications } from '../../context/NotificationContext';

/**
 * Example Component - How to use Notifications in any component
 * 
 * This shows how to:
 * 1. Access notification data
 * 2. Display unread count
 * 3. Mark notifications as read
 * 4. Refresh notifications
 */

const NotificationExample = () => {
    const { 
        notifications,      // Array of all notifications
        unreadCount,        // Number of unread notifications
        markAsRead,         // Function to mark single notification as read
        markAllAsRead,      // Function to mark all as read
        refreshNotifications // Function to manually refresh
    } = useNotifications();

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">
                Notifications ({unreadCount} unread)
            </h2>

            {/* Refresh Button */}
            <button
                onClick={refreshNotifications}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Refresh Notifications
            </button>

            {/* Mark All as Read */}
            {unreadCount > 0 && (
                <button
                    onClick={markAllAsRead}
                    className="mb-4 ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Mark All as Read
                </button>
            )}

            {/* Notifications List */}
            <div className="space-y-3">
                {notifications.length === 0 ? (
                    <p className="text-gray-500">No notifications</p>
                ) : (
                    notifications.map((notif) => (
                        <div
                            key={notif._id}
                            className={`p-4 border rounded-lg ${
                                !notif.isRead && !notif.read
                                    ? 'bg-blue-50 border-blue-300'
                                    : 'bg-white border-gray-200'
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">
                                        {notif.title}
                                    </h3>
                                    <p className="text-gray-600 mt-1">
                                        {notif.message}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-2">
                                        {new Date(notif.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                {/* Mark as Read Button */}
                                {!notif.isRead && !notif.read && (
                                    <button
                                        onClick={() => markAsRead(notif._id)}
                                        className="ml-4 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Mark Read
                                    </button>
                                )}
                            </div>

                            {/* Notification Type Badge */}
                            <span
                                className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                                    notif.type === 'Success'
                                        ? 'bg-green-100 text-green-800'
                                        : notif.type === 'Warning'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : notif.type === 'Alert'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-blue-100 text-blue-800'
                                }`}
                            >
                                {notif.type}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationExample;

/**
 * USAGE IN OTHER COMPONENTS:
 * 
 * 1. Import the hook:
 *    import { useNotifications } from '../../context/NotificationContext';
 * 
 * 2. Use in component:
 *    const { notifications, unreadCount } = useNotifications();
 * 
 * 3. Display unread count in header:
 *    <span>Notifications ({unreadCount})</span>
 * 
 * 4. Show notification list:
 *    {notifications.map(n => <div key={n._id}>{n.title}</div>)}
 * 
 * 5. Mark as read:
 *    <button onClick={() => markAsRead(notificationId)}>Mark Read</button>
 */
