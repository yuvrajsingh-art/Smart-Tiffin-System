import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

/**
 * Reusable Statistic Card Component
 */
const StatCard = ({ title, value, subtext, icon, color }) => (
    <div className="glass-panel p-5 rounded-2xl flex items-start justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
        <div className="relative z-10">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
            <p className="text-xs text-gray-400 font-medium">{subtext}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} text-white shadow-lg`}>
            <span className="material-symbols-outlined">{icon}</span>
        </div>
    </div>
);

/**
 * Menu Display Card (Preview)
 */
const MenuCard = () => (
    <div className="glass-panel p-0 rounded-3xl overflow-hidden group">
        <div className="h-48 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
            <img
                src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop"
                alt="Lunch"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-4 left-4 z-20">
                <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider mb-2 inline-block">Today's Lunch</span>
                <h3 className="text-white text-xl font-bold">Paneer Butter Masala Thali</h3>
            </div>
        </div>
        <div className="p-5">
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-gray-400 text-[18px]">schedule</span>
                    <span>12:30 PM - 02:00 PM</span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-amber-500 text-[18px]">star</span>
                    <span className="font-bold text-gray-900">4.8</span>
                </div>
            </div>

            <div className="flex gap-3">
                <Link to="/student/menu" className="flex-1">
                    <Button className="w-full !py-2.5 text-sm">View Full Menu</Button>
                </Link>
                <Link to="/student/track" className="flex-1">
                    <Button variant="outline" className="w-full !py-2.5 text-sm">Track Order</Button>
                </Link>
            </div>
        </div>
    </div>
);

const StudentDashboard = () => {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out]">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-[fadeIn_0.5s_ease-out]">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Good Afternoon, Sumit! ☀️</h2>
                    <p className="text-gray-500 font-medium mt-1 text-lg">Your tiffin is being prepared with love.</p>
                </div>

                <Link to="/student/wallet" className="group">
                    <div className="glass-panel px-6 py-3 rounded-2xl flex items-center gap-3 hover:bg-emerald-50/50 transition-colors">
                        <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Balance</p>
                            <p className="text-xl font-bold text-gray-900">₹ 1,250</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-[fadeIn_0.6s_ease-out]">
                <StatCard
                    title="Meal Plan"
                    value="Gold"
                    subtext="Valid till 30 Jan"
                    icon="workspace_premium"
                    color="bg-amber-500"
                />
                <StatCard
                    title="Meals Left"
                    value="24"
                    subtext="Lunch & Dinner"
                    icon="restaurant"
                    color="bg-orange-500"
                />
                <StatCard
                    title="Skipped"
                    value="02"
                    subtext="Saved ₹160"
                    icon="timelapse"
                    color="bg-blue-500"
                />
                <StatCard
                    title="Rating"
                    value="4.8"
                    subtext="Your Avg Feedback"
                    icon="star"
                    color="bg-purple-500"
                />
            </div>

            {/* Main Content: Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-[fadeIn_0.7s_ease-out]">

                {/* Left Column (Menu) - Spans 8 Cols */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <span className="material-symbols-outlined text-orange-500">lunch_dining</span>
                            Today's Special
                        </h3>
                        <Link to="/student/menu" className="text-sm font-bold text-primary hover:bg-orange-50 px-3 py-1 rounded-lg transition-colors">
                            View Full Menu &rarr;
                        </Link>
                    </div>
                    <MenuCard />
                </div>

                {/* Right Column (Actions) - Spans 4 Cols */}
                <div className="lg:col-span-4 space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-400">bolt</span>
                        Quick Actions
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                        {/* Track Order */}
                        <Link to="/student/track" className="glass-panel p-4 rounded-2xl flex items-center gap-4 group cursor-pointer">
                            <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-2xl">local_shipping</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">Track Order</h4>
                                <p className="text-xs text-gray-500 font-medium">Live status</p>
                            </div>
                            <span className="material-symbols-outlined text-gray-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
                        </Link>

                        {/* Pause Subscription */}
                        <Link to="/student/pause" className="glass-panel p-4 rounded-2xl flex items-center gap-4 group cursor-pointer">
                            <div className="w-12 h-12 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-2xl">pause_circle</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-lg group-hover:text-red-600 transition-colors">Pause Plan</h4>
                                <p className="text-xs text-gray-500 font-medium">Skip meals</p>
                            </div>
                            <span className="material-symbols-outlined text-gray-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
                        </Link>

                        {/* Feedback */}
                        <Link to="/student/feedback" className="glass-panel p-4 rounded-2xl flex items-center gap-4 group cursor-pointer">
                            <div className="w-12 h-12 rounded-xl bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-2xl">rate_review</span>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-lg group-hover:text-purple-600 transition-colors">Feedback</h4>
                                <p className="text-xs text-gray-500 font-medium">Rate Service</p>
                            </div>
                            <span className="material-symbols-outlined text-gray-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
                        </Link>
                    </div>

                    {/* Promo / Banner Area */}
                    <div className="glass-panel p-5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden group">
                        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                        <h4 className="font-bold text-lg mb-1 relative z-10">Refer a Friend 🎁</h4>
                        <p className="text-gray-300 text-xs mb-3 relative z-10">Get ₹100 in your wallet instantly!</p>
                        <button className="text-xs font-bold text-white bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm relative z-10">
                            Invite Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
