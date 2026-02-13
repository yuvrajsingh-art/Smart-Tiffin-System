import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { FaBell, FaCheckDouble } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';

const NotificationBell = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    // Debug logs
    useEffect(() => {
        console.log('🔔 NotificationBell - Notifications:', notifications);
        console.log('🔔 NotificationBell - Unread Count:', unreadCount);
    }, [notifications, unreadCount]);

    const getNotificationIcon = (type) => {
        const icons = {
            Success: '✅',
            Info: 'ℹ️',
            Warning: '⚠️',
            Alert: '🚨'
        };
        return icons[type] || 'ℹ️';
    };

    const formatTime = (date) => {
        const now = new Date();
        const notifDate = new Date(date);
        const diffMs = now - notifDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
                <FaBell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Notification Panel */}
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Notifications
                                {unreadCount > 0 && (
                                    <span className="ml-2 text-sm text-gray-500">
                                        ({unreadCount} new)
                                    </span>
                                )}
                            </h3>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                        title="Mark all as read"
                                    >
                                        <FaCheckDouble size={16} />
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <FaX size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="overflow-y-auto flex-1">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <FaBell size={48} className="mx-auto mb-3 text-gray-300" />
                                    <p>No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif._id}
                                            className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                                                !notif.isRead && !notif.read ? 'bg-blue-50' : ''
                                            }`}
                                            onClick={() => {
                                                if (!notif.isRead && !notif.read) {
                                                    markAsRead(notif._id);
                                                }
                                            }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl flex-shrink-0">
                                                    {getNotificationIcon(notif.type)}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className="font-semibold text-gray-900 text-sm">
                                                            {notif.title}
                                                        </h4>
                                                        {!notif.isRead && !notif.read && (
                                                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {notif.message}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-2">
                                                        {formatTime(notif.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationBell;
