import React, { useState } from 'react';
import { useSubscription } from '../../context/SubscriptionContext';
import { Link } from 'react-router-dom';

const History = () => {
    const { hasActiveSubscription } = useSubscription();
    const [activeTab, setActiveTab] = useState('Meals'); // Meals, Wallet, Plans
    const [filter, setFilter] = useState('All');

    if (!hasActiveSubscription()) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-[fadeIn_0.5s_ease-out] px-4">
                <div className="size-24 bg-gray-100 rounded-full flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined text-4xl text-gray-400">lock</span>
                </div>
                <div>
                    <h2 className="text-2xl font-black text-[#2D241E]">History Locked</h2>
                    <p className="text-[#5C4D42] mt-2 max-w-md mx-auto font-medium">
                        Order history and transaction logs are only available for active subscribers.
                    </p>
                </div>
                <Link to="/customer/find-mess" className="px-8 py-3 bg-[#2D241E] text-white rounded-xl font-bold shadow-lg hover:translate-y-px transition-all">
                    Find a Mess
                </Link>
            </div>
        );
    }

    // Mock Data
    const mealsHistory = [
        { id: 'M1', date: "Today, 12:30 PM", type: "Lunch", item: "Paneer Thali", mess: "Krishna Veg Mess", status: "Delivered", icon: "lunch_dining", orderId: "#ST-1024" },
        { id: 'M2', date: "Yesterday, 8:00 PM", type: "Dinner", item: "Veg Pulao", mess: "Krishna Veg Mess", status: "Delivered", icon: "dinner_dining", orderId: "#ST-1021" },
        { id: 'M3', date: "22 Jan, 12:30 PM", type: "Lunch", item: "Chicken Curry", mess: "Delhi Tadka", status: "Skipped", icon: "block", orderId: "#ST-1018" },
        { id: 'M4', date: "21 Jan, 8:00 PM", type: "Dinner", item: "Aloo Paratha", mess: "Krishna Veg Mess", status: "Delivered", icon: "dinner_dining", orderId: "#ST-1015" },
    ];

    const walletHistory = [
        { id: 'W1', date: "Today, 10:00 AM", title: "Money Added", amount: "+₹2,000", type: "Credit", status: "Success", icon: "add_card" },
        { id: 'W2', date: "22 Jan, 01:00 PM", title: "Meal Refund", amount: "+₹120", type: "Credit", status: "Success", icon: "account_balance_wallet" },
        { id: 'W3', date: "20 Jan, 09:00 AM", title: "Plan Upgrade", amount: "-₹800", type: "Debit", status: "Success", icon: "upgrade" },
        { id: 'W4', date: "15 Jan, 08:30 PM", title: "Guest Tiffin", amount: "-₹150", type: "Debit", status: "Success", icon: "group" },
    ];

    const plansHistory = [
        { id: 'P1', date: "Today", title: "Plan Upgraded", detail: "Standard Veg → Premium Non-Veg", status: "Completed", icon: "auto_awesome" },
        { id: 'P2', date: "22 Jan", title: "Meal Paused", detail: "Lunch skipped for Jan 24-25", status: "Scheduled", icon: "pause_circle" },
        { id: 'P3', date: "01 Jan", title: "New Subscription", detail: "Krishna Veg Mess (Standard Veg)", status: "Active", icon: "verified" },
    ];

    const stats = {
        Meals: [
            { label: 'Total Meals', value: '42', icon: 'restaurant' },
            { label: 'Skipped', value: '3', icon: 'block', color: 'text-red-500' },
            { label: 'Current Mess', value: 'Krishna Veg', icon: 'location_on' },
        ],
        Wallet: [
            { label: 'Balance', value: '₹1,450', icon: 'payments' },
            { label: 'Cashback', value: '₹240', icon: 'redeem', color: 'text-green-600' },
            { label: 'Spent', value: '₹4,200', icon: 'analytics' },
        ],
        Plans: [
            { label: 'Active Plan', value: 'Premium', icon: 'star', color: 'text-orange-500' },
            { label: 'Expiring', value: 'in 6 days', icon: 'timer' },
            { label: 'Loyalty', value: 'Silver', icon: 'military_tech' },
        ]
    };

    const tabs = [
        { name: 'Meals', icon: 'restaurant_menu' },
        { name: 'Wallet', icon: 'account_balance_wallet' },
        { name: 'Plans', icon: 'settings_suggest' }
    ];

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
                <h1 className="text-3xl font-black text-[#2D241E]">Activity History</h1>
            </div>

            {/* Navigation Tabs (Glass) */}
            <div className="flex p-1.5 bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl mb-8 max-w-md">
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => { setActiveTab(tab.name); setFilter('All'); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all duration-300 ${activeTab === tab.name
                                ? 'bg-[#2D241E] text-white shadow-lg shadow-black/10'
                                : 'text-[#5C4D42] hover:bg-white/50'
                            }`}
                    >
                        <span className="material-symbols-outlined text-base">{tab.icon}</span>
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {stats[activeTab].map((stat, i) => (
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

            {/* Main Content Area */}
            <div className="space-y-4">
                {/* Section Header with Filter (Only for Meals for now) */}
                <div className="flex justify-between items-center mb-2 px-2">
                    <h2 className="font-black text-[#2D241E] opacity-40 uppercase tracking-[0.2em] text-[10px]">
                        Recent {activeTab} Activity
                    </h2>
                    {activeTab === 'Meals' && (
                        <div className="flex gap-2">
                            {['All', 'Delivered', 'Skipped'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${filter === f ? 'bg-primary text-white shadow-md' : 'bg-white/40 text-gray-400 hover:bg-white'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Unified List Rendering */}
                {activeTab === 'Meals' && mealsHistory.filter(m => filter === 'All' || m.status === filter).map(item => (
                    <div key={item.id} className="group glass-panel p-5 rounded-[2rem] border border-white/60 flex items-center justify-between hover:bg-white transition-all cursor-pointer">
                        <div className="flex items-center gap-5">
                            <div className={`size-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${item.status === 'Skipped' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-600'
                                }`}>
                                <span className="material-symbols-outlined">{item.icon}</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-black text-[#2D241E] text-base">{item.item}</h3>
                                    <span className="text-[10px] font-bold text-gray-300">({item.orderId})</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                    <span className="text-primary">{item.mess}</span>
                                    <span>•</span>
                                    <span className="uppercase">{item.type}</span>
                                    <span>•</span>
                                    <span>{item.date}</span>
                                </div>
                            </div>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider outline outline-1 ${item.status === 'Skipped' ? 'bg-red-50 text-red-500 outline-red-100' : 'bg-green-50 text-green-600 outline-green-100'
                            }`}>
                            {item.status}
                        </span>
                    </div>
                ))}

                {activeTab === 'Wallet' && walletHistory.map(item => (
                    <div key={item.id} className="group glass-panel p-5 rounded-[2rem] border border-white/60 flex items-center justify-between hover:bg-white transition-all">
                        <div className="flex items-center gap-5">
                            <div className={`size-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${item.type === 'Credit' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-primary'
                                }`}>
                                <span className="material-symbols-outlined">{item.icon}</span>
                            </div>
                            <div>
                                <h3 className="font-black text-[#2D241E] text-base mb-1">{item.title}</h3>
                                <p className="text-xs font-bold text-gray-400">{item.date}</p>
                            </div>
                        </div>
                        <p className={`font-black text-lg ${item.type === 'Credit' ? 'text-green-600' : 'text-[#2D241E]'}`}>
                            {item.amount}
                        </p>
                    </div>
                ))}

                {activeTab === 'Plans' && plansHistory.map(item => (
                    <div key={item.id} className="group glass-panel p-5 rounded-[2rem] border border-white/60 flex items-center justify-between hover:bg-white transition-all">
                        <div className="flex items-center gap-5">
                            <div className="size-14 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl shadow-sm border border-gray-100">
                                <span className="material-symbols-outlined text-[#2D241E]">{item.icon}</span>
                            </div>
                            <div>
                                <h3 className="font-black text-[#2D241E] text-base mb-1">{item.title}</h3>
                                <p className="text-xs font-bold text-gray-400 mb-1">{item.detail}</p>
                                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{item.date}</p>
                            </div>
                        </div>
                        <span className="px-4 py-1.5 rounded-full bg-[#2D241E] text-white text-[10px] font-black uppercase tracking-wider">
                            {item.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default History;

