import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../../context/SubscriptionContext';

const CustomerDashboard = () => {
    const { hasActiveSubscription, subscription } = useSubscription();
    // For manual testing, you can force isActive to true if needed, or rely on context
    const isActive = hasActiveSubscription();

    const [trackerState] = useState(2); // 1: Prep, 2: Cooking, 3: Packed, 4: Out, 5: Delivered

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8 animate-[fadeIn_0.5s_ease-out] pb-20 px-4">

            {/* Active Subscription View */}
            {isActive ? (
                <>
                    {/* Welcome Header */}
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-black text-[#2D241E] leading-tight">Hello, Student! 👋</h1>
                            <p className="text-[#5C4D42] font-medium">Your tiffin is being prepared with love.</p>
                        </div>
                        <div className="hidden md:block">
                            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-2 shadow-sm border border-green-200">
                                <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                                Subscription Active
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Col: Live Status */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Live Tracker Card */}
                            <section className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden group border border-white/60 shadow-xl">
                                {/* bg blobs */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/50 rounded-full blur-3xl pointer-events-none"></div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <span className="text-xs font-black text-orange-500 uppercase tracking-widest mb-1 block">Live Status</span>
                                            <h2 className="text-2xl font-black text-[#2D241E]">Lunch is Cooking 🍳</h2>
                                        </div>
                                        <div className="bg-white/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/60 text-right">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Estimated Arrival</p>
                                            <p className="text-lg font-black text-[#2D241E]">12:45 PM</p>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="relative h-3 bg-gray-100 rounded-full mb-8 overflow-hidden">
                                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-primary w-[45%] rounded-full shadow-[0_0_15px_rgba(234,88,12,0.5)] animate-pulse"></div>
                                    </div>

                                    {/* Steps */}
                                    <div className="flex justify-between px-2 relative">
                                        {['Prep', 'Cooking', 'Packed', 'On Way', 'Delivered'].map((step, idx) => (
                                            <div key={step} className="flex flex-col items-center gap-2 z-10">
                                                <div className={`size-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${idx + 1 <= trackerState ? 'border-primary bg-white text-primary scale-110 shadow-lg' : 'border-gray-100 bg-gray-50 text-gray-300'}`}>
                                                    <span className="material-symbols-outlined text-[18px] font-bold">
                                                        {idx === 0 ? 'kitchen' : idx === 1 ? 'skillet' : idx === 2 ? 'package_2' : idx === 3 ? 'moped' : 'check'}
                                                    </span>
                                                </div>
                                                <span className={`text-[10px] font-bold uppercase tracking-wider ${idx + 1 <= trackerState ? 'text-[#2D241E]' : 'text-gray-300'}`}>{step}</span>
                                            </div>
                                        ))}
                                        {/* Connecting Line (Visual only, behind dots) */}
                                        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>
                                    </div>
                                </div>
                            </section>

                            {/* Today's Menu */}
                            <div className="glass-panel p-6 rounded-[2rem] border border-white/60">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-black text-[#2D241E]">Today's Menu</h3>
                                    <Link to="/customer/menu" className="text-primary text-sm font-bold hover:underline">View Full Week</Link>
                                </div>
                                <div className="flex gap-4 overflow-x-auto pb-2">
                                    {/* Lunch */}
                                    <div className="min-w-[200px] bg-orange-50/50 p-4 rounded-2xl border border-orange-100 flex-1 relative overflow-hidden">
                                        <span className="bg-white/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-black uppercase text-orange-600 absolute top-3 right-3">Lunch</span>
                                        <div className="size-10 rounded-full bg-white flex items-center justify-center text-xl mb-3 shadow-sm">🍛</div>
                                        <h4 className="font-bold text-[#2D241E]">Paneer Masala Thali</h4>
                                        <p className="text-xs text-[#5C4D42] mt-1">3 Rotis, Jeera Rice, Dal Fry</p>
                                    </div>
                                    {/* Dinner */}
                                    <div className="min-w-[200px] bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex-1 relative overflow-hidden opacity-60">
                                        <span className="bg-white/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-black uppercase text-blue-600 absolute top-3 right-3">Dinner</span>
                                        <div className="size-10 rounded-full bg-white flex items-center justify-center text-xl mb-3 shadow-sm">🌙</div>
                                        <h4 className="font-bold text-[#2D241E]">Light Khichdi Kadhi</h4>
                                        <p className="text-xs text-[#5C4D42] mt-1">With Papad & Pickle</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Right Col: Wallet & Actions */}
                        <div className="space-y-6">

                            {/* Wallet Card */}
                            <div className="bg-[#1a1a1a] text-white p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="material-symbols-outlined text-8xl">account_balance_wallet</span>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Total Balance</p>
                                    <h2 className="text-4xl font-black mb-6">₹ 450<span className="text-lg text-white/60">.00</span></h2>

                                    <div className="flex gap-3">
                                        <button className="flex-1 py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
                                            + Add Money
                                        </button>
                                        <button className="px-4 py-3 bg-white/10 text-white rounded-xl font-bold text-sm hover:bg-white/20 transition-colors backdrop-blur-md">
                                            History
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions Grid */}
                            <div>
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 px-2">Quick Actions</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <Link to="/customer/pause" className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all group">
                                        <div className="size-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-lg">pause</span>
                                        </div>
                                        <p className="font-bold text-[#2D241E] text-sm">Skip Meal</p>
                                    </Link>
                                    <Link to="/customer/support" className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group">
                                        <div className="size-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-lg">support_agent</span>
                                        </div>
                                        <p className="font-bold text-[#2D241E] text-sm">Support</p>
                                    </Link>
                                </div>
                            </div>

                            {/* Streak/Reward (Gamification) */}
                            <div className="glass-panel p-5 rounded-[2rem] flex items-center gap-4 border-2 border-orange-100 bg-orange-50/30">
                                <div className="size-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl font-black">
                                    🔥
                                </div>
                                <div>
                                    <h4 className="font-black text-[#2D241E]">12 Day Streak!</h4>
                                    <p className="text-xs text-[#5C4D42] font-medium">You saved ₹120 this month via easy-ti.</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-10 animate-[scaleIn_0.3s_ease-out]">
                    <div className="bg-orange-50 rounded-full p-4 mb-4 relative">
                        <div className="absolute inset-0 bg-orange-200 rounded-full blur-xl opacity-50"></div>
                        <span className="material-symbols-outlined text-5xl text-primary relative z-10">lunch_dining</span>
                    </div >
                    <h2 className="text-2xl font-black text-[#2D241E] mb-2 text-center">Welcome to Smart Tiffin!</h2>
                    <p className="text-[#5C4D42] text-base mb-6 max-w-md text-center leading-relaxed">
                        You don't have an active subscription yet. Discover healthy, homemade meals near you and start your journey.
                    </p>
                    <Link to="/customer/find-mess" className="group relative px-6 py-3 bg-[#111716] text-white rounded-xl font-bold shadow-xl overflow-hidden hover:scale-105 transition-transform duration-300">
                        <span className="relative z-10 flex items-center gap-2">
                            Find a Mess
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 w-full max-w-4xl px-4">
                        <div className="glass-panel p-4 rounded-xl text-center">
                            <span className="material-symbols-outlined text-2xl text-primary mb-2">verified</span>
                            <h3 className="font-bold text-[#2D241E] text-sm mb-1">Top Rated Food</h3>
                            <p className="text-[10px] leading-tight text-[#5C4D42]">Curated list of hygiene-verified mess providers.</p>
                        </div>
                        <div className="glass-panel p-4 rounded-xl text-center">
                            <span className="material-symbols-outlined text-2xl text-primary mb-2">pause_circle</span>
                            <h3 className="font-bold text-[#2D241E] text-sm mb-1">Flexible Plans</h3>
                            <p className="text-[10px] leading-tight text-[#5C4D42]">Pause or cancel anytime with easy refund policies.</p>
                        </div>
                        <div className="glass-panel p-4 rounded-xl text-center">
                            <span className="material-symbols-outlined text-2xl text-primary mb-2">local_shipping</span>
                            <h3 className="font-bold text-[#2D241E] text-sm mb-1">Live Tracking</h3>
                            <p className="text-[10px] leading-tight text-[#5C4D42]">Know exactly when your tiffin will reach you.</p>
                        </div>
                    </div>
                </div >
            )}
        </div>
    );
};

export default CustomerDashboard;
