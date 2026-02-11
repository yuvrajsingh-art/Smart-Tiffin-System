import React, { useState, useEffect } from 'react';
import ProviderApi from '../../../services/ProviderApi';
import ProviderSidebar from './ProviderSidebar';
import ProviderHeader from './ProviderHeader';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const response = await ProviderApi.get('/notifications');
            if (response.data && response.data.data) {
                setNotifications(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            const response = await ProviderApi.put(`/notifications/${id}/read`);
            if (response.data.success) {
                setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
            }
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const markAllRead = async () => {
        try {
            const response = await ProviderApi.put('/notifications/mark-all-read');
            if (response.data.success) {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            }
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'order': return 'shopping_bag';
            case 'payment': return 'account_balance_wallet';
            case 'alert': return 'warning';
            case 'success': return 'check_circle';
            default: return 'notifications';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'order': return 'bg-blue-50 text-blue-600';
            case 'payment': return 'bg-green-50 text-green-600';
            case 'alert': return 'bg-red-50 text-red-600';
            case 'success': return 'bg-green-50 text-green-600';
            default: return 'bg-gray-50 text-gray-500';
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHrs = (now - date) / (1000 * 60 * 60);

        if (diffInHrs < 24 && now.getDate() === date.getDate()) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="flex h-screen bg-[#FFFBF5]">
            <ProviderSidebar />
            <div className="flex-1 flex flex-col">
                <ProviderHeader title="Notifications" subtitle="Stay updated with your business" />
                
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-5xl mx-auto">
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
                                <div className="size-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                    <span className="material-symbols-outlined">notifications</span>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider font-bold text-gray-400">Total</p>
                                    <p className="text-xl font-black text-gray-800">{notifications.length}</p>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
                                <div className="size-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                    <span className="material-symbols-outlined">mark_chat_unread</span>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider font-bold text-gray-400">Unread</p>
                                    <p className="text-xl font-black text-orange-600">{unreadCount}</p>
                                </div>
                            </div>

                            {unreadCount > 0 && (
                                <div className="flex items-center justify-center">
                                    <button
                                        onClick={markAllRead}
                                        className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-colors"
                                    >
                                        Mark all as read
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="space-y-4">
                            <h2 className="font-black text-gray-800 opacity-40 uppercase tracking-wider text-xs mb-4 px-2">
                                Recent Updates
                            </h2>

                            {loading ? (
                                <div className="flex justify-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                                </div>
                            ) : notifications.length > 0 ? (
                                notifications.map((item) => (
                                    <div
                                        key={item._id}
                                        onClick={() => !item.read && markAsRead(item._id)}
                                        className={`bg-white p-5 rounded-2xl border flex items-start gap-5 hover:shadow-md transition-all cursor-pointer relative overflow-hidden ${
                                            !item.read ? 'border-orange-200 bg-orange-50/30' : 'border-gray-100'
                                        }`}
                                    >
                                        {!item.read && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500"></div>}

                                        <div className={`size-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0 ${getTypeColor(item.type)}`}>
                                            <span className="material-symbols-outlined">{getIcon(item.type)}</span>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className={`font-black text-base ${!item.read ? 'text-gray-800' : 'text-gray-600'}`}>
                                                    {item.title || 'Notification'}
                                                </h3>
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">
                                                    {formatTime(item.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-gray-600 leading-relaxed">
                                                {item.message}
                                            </p>
                                        </div>

                                        {!item.read && (
                                            <div className="size-2.5 bg-orange-500 rounded-full animate-pulse shrink-0 mt-2"></div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 opacity-40">
                                    <span className="material-symbols-outlined text-6xl mb-4">notifications_off</span>
                                    <p className="font-black">No notifications yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notification;
