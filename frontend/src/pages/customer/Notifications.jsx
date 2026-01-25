import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../../context/SubscriptionContext';

const Notifications = () => {
    const { hasActiveSubscription } = useSubscription();
    const [filter, setFilter] = useState('All');

    // Mock Notifications Data
    const notifications = [
        {
            id: 1,
            title: "Meal Delivered",
            message: "Your Lunch (Paneer Thali) has been delivered by Krishna Veg Mess.",
            time: "Today, 12:45 PM",
            type: "success",
            icon: "check_circle",
            unread: true
        },
        {
            id: 2,
            title: "Refund Processed",
            message: "₹120 has been credited to your wallet for the paused meal on Jan 22.",
            time: "Today, 10:15 AM",
            type: "wallet",
            icon: "account_balance_wallet",
            unread: true
        },
        {
            id: 3,
            title: "Plan Upgrade Success",
            message: "Welcome to Premium Non-Veg! Your new plan is now active.",
            time: "Yesterday, 06:30 PM",
            type: "upgrade",
            icon: "auto_awesome",
            unread: false
        },
        {
            id: 4,
            title: "Weekly Menu Updated",
            message: "Krishna Veg Mess has updated their menu for the next week. Check it out!",
            time: "2 days ago",
            type: "info",
            icon: "restaurant_menu",
            unread: false
        },
        {
            id: 5,
            title: "Payment Received",
            message: "Successfully added ₹2,000 to your wallet via UPI.",
            time: "23 Jan, 11:00 AM",
            type: "wallet",
            icon: "add_card",
            unread: false
        }
    ];

    const stats = [
        { label: 'Total', value: notifications.length, icon: 'notifications' },
        { label: 'Unread', value: notifications.filter(n => n.unread).length, icon: 'mark_chat_unread', color: 'text-primary' },
        { label: 'Important', value: '2', icon: 'priority_high', color: 'text-red-500' },
    ];

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

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out] px-4 relative">

            {/* Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="blob blob-1 blob-primary opacity-30 scale-75"></div>
                <div className="blob blob-2 blob-secondary opacity-30 scale-75"></div>
            </div>

            {/* Header */}
            <div className="flex flex-col gap-1 mb-8 pt-4">
                <Link to="/customer/dashboard" className="text-xs font-bold text-[#5C4D42] hover:text-primary flex items-center gap-1 w-fit transition-colors">
                    <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Dashboard
                </Link>
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-black text-[#2D241E]">Notifications</h1>
                    <button className="text-xs font-black text-primary hover:underline uppercase tracking-widest">
                        Mark all as read
                    </button>
                </div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {stats.map((stat, i) => (
                    <div key={i} className="glass-panel p-5 rounded-2xl border border-white/60 flex items-center gap-4 hover:translate-y-[-2px] transition-all cursor-default">
                        <div className="size-12 rounded-xl bg-white/80 shadow-sm flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">{stat.icon}</span>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">{stat.label}</p>
                            <p className={`text-xl font-black ${stat.color || 'text-[#2D241E]'}`}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Notification List */}
            <div className="space-y-4">
                <h2 className="font-black text-[#2D241E] opacity-40 uppercase tracking-[0.2em] text-[10px] mb-4 px-2">
                    Recent Updates
                </h2>

                {notifications.map((item) => (
                    <div key={item.id} className={`group glass-panel p-5 rounded-[2rem] border border-white/60 flex items-start gap-5 hover:bg-white transition-all cursor-pointer relative overflow-hidden ${item.unread ? 'ring-1 ring-primary/20 bg-orange-50/30' : ''}`}>

                        {/* Status Indicator Bar */}
                        {item.unread && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>}

                        <div className={`size-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0 ${item.type === 'success' ? 'bg-green-50 text-green-600' :
                                item.type === 'wallet' ? 'bg-blue-50 text-blue-600' :
                                    item.type === 'upgrade' ? 'bg-orange-50 text-primary' :
                                        'bg-gray-50 text-gray-500'
                            }`}>
                            <span className="material-symbols-outlined">{item.icon}</span>
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className={`font-black text-base ${item.unread ? 'text-[#2D241E]' : 'text-[#2D241E]/70'}`}>
                                    {item.title}
                                </h3>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight tabular-nums">
                                    {item.time}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-[#5C4D42] leading-relaxed opacity-80">
                                {item.message}
                            </p>
                        </div>

                        {item.unread && (
                            <div className="size-2.5 bg-primary rounded-full animate-pulse shrink-0 mt-2"></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Empty State Mock (if needed) */}
            {notifications.length === 0 && (
                <div className="text-center py-20 opacity-40">
                    <span className="material-symbols-outlined text-6xl mb-4">notifications_off</span>
                    <p className="font-black">No notifications yet</p>
                </div>
            )}
        </div>
    );
};

export default Notifications;
