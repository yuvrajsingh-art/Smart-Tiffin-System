import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSubscription } from '../../context/SubscriptionContext';
import BackgroundBlobs from '../../components/common/BackgroundBlobs';
import PageHeader from '../../components/common/PageHeader';

const Notifications = () => {
    const { hasActiveSubscription } = useSubscription();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const { data } = await axios.get('/api/customer/notifications');
            if (data.success) {
                setNotifications(data.data.notifications);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasActiveSubscription()) {
            fetchNotifications();
        }
    }, [hasActiveSubscription()]);

    const markAsRead = async (id) => {
        try {
            const { data } = await axios.put(`/api/customer/notifications/${id}/read`);
            if (data.success) {
                setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            }
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const markAllRead = async () => {
        try {
            const { data } = await axios.put('/api/customer/notifications/mark-all-read');
            if (data.success) {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            }
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'Success': return 'check_circle';
            case 'Alert': return 'priority_high';
            case 'Warning': return 'warning';
            case 'Wallet': return 'account_balance_wallet';
            default: return 'notifications';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Success': return 'bg-green-50 text-green-600';
            case 'Alert': return 'bg-red-50 text-red-600';
            case 'Warning': return 'bg-yellow-50 text-yellow-600';
            case 'Wallet': return 'bg-blue-50 text-blue-600';
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

    if (!hasActiveSubscription()) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-[fadeIn_0.5s_ease-out] px-4">
                <div className="size-24 bg-gray-100 rounded-full flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined text-4xl text-gray-400">lock</span>
                </div>
                <div>
                    <h2 className="text-2xl font-black text-[#2D241E]">Feature Locked</h2>
                    <p className="text-[#5C4D42] mt-2 max-w-md mx-auto font-medium">
                        You need an active subscription to access notifications.
                    </p>
                </div>
                <Link to="/customer/find-mess" className="px-8 py-3 bg-[#2D241E] text-white rounded-xl font-bold shadow-lg hover:translate-y-px transition-all">
                    Find a Mess
                </Link>
            </div>
        );
    }

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out] px-4 relative">
            <BackgroundBlobs />

            <PageHeader
                title="Notifications"
                rightElement={
                    unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            className="text-xs font-black text-primary hover:underline uppercase tracking-widest"
                        >
                            Mark all as read
                        </button>
                    )
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                <div className="glass-panel p-5 rounded-2xl border border-white/60 flex items-center gap-4 hover:translate-y-[-2px] transition-all cursor-default">
                    <div className="size-12 rounded-xl bg-white/80 shadow-sm flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">notifications</span>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">Total</p>
                        <p className="text-xl font-black text-[#2D241E]">{notifications.length}</p>
                    </div>
                </div>

                <div className="glass-panel p-5 rounded-2xl border border-white/60 flex items-center gap-4 hover:translate-y-[-2px] transition-all cursor-default">
                    <div className="size-12 rounded-xl bg-white/80 shadow-sm flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">mark_chat_unread</span>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">Unread</p>
                        <p className="text-xl font-black text-primary">{unreadCount}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="font-black text-[#2D241E] opacity-40 uppercase tracking-[0.2em] text-[10px] mb-4 px-2">
                    Recent Updates
                </h2>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : notifications.length > 0 ? (
                    notifications.map((item) => (
                        <div
                            key={item._id}
                            onClick={() => !item.isRead && markAsRead(item._id)}
                            className={`group glass-panel p-5 rounded-[2rem] border border-white/60 flex items-start gap-5 hover:bg-white transition-all cursor-pointer relative overflow-hidden ${!item.isRead ? 'ring-1 ring-primary/20 bg-orange-50/30' : ''}`}
                        >
                            {!item.isRead && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>}

                            <div className={`size-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0 ${getTypeColor(item.type)}`}>
                                <span className="material-symbols-outlined">{getIcon(item.type)}</span>
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={`font-black text-base ${!item.isRead ? 'text-[#2D241E]' : 'text-[#2D241E]/70'}`}>
                                        {item.title}
                                    </h3>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight tabular-nums">
                                        {formatTime(item.createdAt)}
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-[#5C4D42] leading-relaxed opacity-80">
                                    {item.message}
                                </p>
                            </div>

                            {!item.isRead && (
                                <div className="size-2.5 bg-primary rounded-full animate-pulse shrink-0 mt-2"></div>
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
    );
};

export default Notifications;
