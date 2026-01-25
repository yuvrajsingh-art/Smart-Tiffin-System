import React, { useState } from 'react';
import { useSubscription } from '../../context/SubscriptionContext';
import { Link } from 'react-router-dom';

const History = () => {
    const { hasActiveSubscription } = useSubscription();
    const [filter, setFilter] = useState('All');

    if (!hasActiveSubscription()) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-[fadeIn_0.5s_ease-out]">
                <div className="size-24 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-gray-400">lock</span>
                </div>
                <div>
                    <h2 className="text-2xl font-black text-[#2D241E]">History Locked</h2>
                    <p className="text-[#5C4D42] mt-2 max-w-md mx-auto">
                        Order history is only available for active subscribers.
                    </p>
                </div>
                <Link to="/customer/find-mess" className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-[#e05d00] transition-colors">
                    Find a Mess
                </Link>
            </div>
        );
    }

    // Mock History Data
    const history = [
        { id: 1, date: "Today, 12:30 PM", type: "Lunch", item: "Paneer Thali", status: "Delivered", price: "₹120", icon: "lunch_dining" },
        { id: 2, date: "Yesterday, 8:00 PM", type: "Dinner", item: "Veg Pulao", status: "Delivered", price: "₹90", icon: "dinner_dining" },
        { id: 3, date: "22 Oct, 12:30 PM", type: "Lunch", item: "Chicken Curry", status: "Skipped", price: "-", icon: "block" },
        { id: 4, date: "21 Oct, 8:00 PM", type: "Dinner", item: "Aloo Paratha", status: "Delivered", price: "₹80", icon: "dinner_dining" },
    ];

    const filteredHistory = history.filter(item => {
        if (filter === 'All') return true;
        return item.status === filter;
    });

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out] px-4 md:px-6">

            {/* Header */}
            <div className="flex flex-col gap-1 mb-8 pt-4">
                <Link to="/customer/dashboard" className="text-xs font-bold text-[#5C4D42] hover:text-primary flex items-center gap-1 w-fit transition-colors">
                    <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Dashboard
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-[#2D241E] leading-tight">Order History</h1>
                    <p className="text-xs font-bold text-[#5C4D42] opacity-60 uppercase tracking-widest">Past Meals</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {['All', 'Delivered', 'Skipped'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${filter === f
                            ? 'bg-[#2D241E] text-white border-[#2D241E] shadow-md'
                            : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* History List */}
            <div className="space-y-4">
                {filteredHistory.map((item) => (
                    <div key={item.id} className="group p-5 bg-white/60 backdrop-blur-md rounded-[2rem] flex items-center justify-between border border-white hover:bg-white hover:border-orange-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                        <div className="flex items-center gap-5">
                            <div className={`size-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-transform group-hover:scale-110 ${item.status === 'Skipped' ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-600'
                                }`}>
                                <span className="material-symbols-outlined">{item.icon}</span>
                            </div>
                            <div>
                                <h3 className="font-black text-[#2D241E] text-base mb-1">{item.item}</h3>
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                    <span className="uppercase tracking-wider">{item.type}</span>
                                    <span>•</span>
                                    <span>{item.date}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 inline-block ${item.status === 'Skipped' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                }`}>
                                {item.status}
                            </span>
                            <p className="font-black text-[#2D241E] text-lg">{item.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default History;
