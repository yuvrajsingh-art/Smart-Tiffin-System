import React, { useState, useEffect } from 'react';
import { useSubscription } from '../../context/SubscriptionContext';
import { Link } from 'react-router-dom';

const Track = () => {
    const { hasActiveSubscription } = useSubscription();
    const [eta, setEta] = useState(15);
    const [showDetails, setShowDetails] = useState(true); // Collapsible state

    // Mock live countdown
    useEffect(() => {
        const timer = setInterval(() => {
            setEta(prev => Math.max(0, prev - 1));
        }, 60000); // Decrease every minute
        return () => clearInterval(timer);
    }, []);

    if (!hasActiveSubscription()) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-[fadeIn_0.5s_ease-out] px-4">
                <div className="size-24 bg-gray-100 rounded-full flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined text-4xl text-gray-400">lock</span>
                </div>
                <div>
                    <h2 className="text-2xl font-black text-[#2D241E]">Feature Locked</h2>
                    <p className="text-[#5C4D42] mt-2 max-w-md mx-auto font-medium">
                        Delivery tracking is only available for active subscribers. Please subscribe to a plan first.
                    </p>
                </div>
                <Link to="/customer/find-mess" className="px-8 py-3 bg-[#2D241E] text-white rounded-xl font-bold shadow-lg hover:translate-y-px transition-all">
                    Find a Mess
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-[fadeIn_0.5s_ease-out] pb-20 px-4 relative">

            {/* Background Blobs (Standardized) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="blob blob-1 blob-primary opacity-30 scale-75"></div>
                <div className="blob blob-2 blob-secondary opacity-30 scale-75"></div>
            </div>

            {/* Header */}
            {/* Header */}
            <div className="flex items-center justify-between relative z-10">
                <div>
                    <Link to="/customer/dashboard" className="text-xs font-bold text-[#5C4D42] hover:text-primary flex items-center gap-1 mb-2 transition-colors">
                        <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Dashboard
                    </Link>
                    <h2 className="text-3xl font-black text-[#2D241E] tracking-tight">Track Order</h2>
                    <p className="text-xs font-bold text-[#5C4D42] opacity-60 uppercase tracking-widest mt-1">Lunch • Today</p>
                </div>
                <div className="glass-panel px-4 py-2 rounded-xl shadow-sm border border-white/60">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Order ID</span>
                    <span className="font-black text-[#2D241E] text-base">#ORD-2891</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Map & Status */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Visual Map Placeholder */}
                    <div className="relative h-72 md:h-96 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white group">
                        <img
                            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop"
                            alt="Map View"
                            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-[2s] contrast-125"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2D241E]/90 via-transparent to-black/10"></div>

                        {/* Radar Effect */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                            <div className="size-[300px] border border-primary/20 rounded-full animate-[ping_3s_linear_infinite]"></div>
                            <div className="size-[200px] border border-primary/30 rounded-full animate-[ping_3s_linear_infinite_0.5s] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                        </div>

                        {/* Live Floating Elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="relative group/marker cursor-pointer">
                                <div className="size-16 bg-primary/30 rounded-full animate-ping absolute inset-0"></div>
                                <div className="size-16 bg-white rounded-full flex items-center justify-center shadow-2xl relative z-10 border-4 border-white transition-transform group-hover/marker:scale-110">
                                    <span className="material-symbols-outlined text-3xl text-primary">two_wheeler</span>
                                </div>
                                {/* Marker Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-[#2D241E] text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    Rajesh is on the way!
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2D241E]"></div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Stats */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white flex justify-between items-end bg-gradient-to-t from-black/50 to-transparent">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
                                    <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Estimated Arrival</p>
                                </div>
                                <h3 className="text-5xl font-black tracking-tighter">{eta}<span className="text-2xl ml-1 align-baseline opacity-80">mins</span></h3>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">Distance</p>
                                <h3 className="text-3xl font-black">1.2 km</h3>
                            </div>
                        </div>
                    </div>

                    {/* Collapsible Order Details */}
                    <div className="glass-panel rounded-[2rem] border border-white/60 overflow-hidden transition-all duration-300">
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="w-full flex items-center justify-between p-6 hover:bg-white/40 transition-colors"
                        >
                            <h3 className="font-black text-[#2D241E] text-lg flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">receipt_long</span>
                                Order Details
                            </h3>
                            <span className={`material-symbols-outlined text-[#2D241E] transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`}>expand_more</span>
                        </button>

                        {showDetails && (
                            <div className="px-6 pb-6 animate-[fadeIn_0.2s]">
                                <div className="flex gap-4 items-center p-4 bg-white/50 rounded-2xl border border-white hover:border-orange-100 transition-colors">
                                    <div className="size-20 rounded-xl overflow-hidden shrink-0 shadow-sm">
                                        <img src="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=200" className="w-full h-full object-cover" alt="Food" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-[#2D241E] text-lg">Paneer Butter Masala Thali</h4>
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-wider">Paid</span>
                                        </div>
                                        <p className="text-sm text-[#5C4D42] opacity-80 mt-1">3 Rotis, Dal Fry, Jeera Rice, Salad, Pickle</p>
                                        <div className="flex gap-2 mt-3">
                                            <span className="text-[10px] bg-orange-50 text-orange-700 px-2 py-0.5 rounded border border-orange-100 font-bold">Medium Spicy</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                {/* Right Column: Timeline & Driver */}
                <div className="space-y-6">

                    {/* Driver Card */}
                    <div className="glass-panel p-6 rounded-[2rem] border border-white/60 bg-gradient-to-br from-white/80 to-orange-50/50 shadow-lg relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-6xl">delivery_dining</span>
                        </div>

                        <div className="flex gap-4 items-center mb-6 relative z-10">
                            <div className="size-16 rounded-full p-1 border-2 border-primary relative shadow-md">
                                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200" className="w-full h-full object-cover rounded-full" alt="Driver" />
                                <div className="absolute bottom-0 right-0 size-5 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <div>
                                <h4 className="font-black text-[#2D241E] text-xl leading-none">Rajesh Kumar</h4>
                                <div className="flex items-center gap-1 mt-1.5">
                                    <span className="bg-[#2D241E] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">4.9 ★</span>
                                    <span className="text-xs font-bold text-[#5C4D42] opacity-60">• Delivery Partner</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 relative z-10">
                            <button className="py-3 rounded-xl bg-[#2D241E] text-white font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group/btn">
                                <span className="material-symbols-outlined text-lg group-hover/btn:animate-shake">call</span>
                                Call
                            </button>
                            <button className="py-3 rounded-xl bg-white text-[#2D241E] border border-gray-200 font-bold text-sm shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-lg">chat</span>
                                Message
                            </button>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="glass-panel p-8 rounded-[2rem] border border-white/60 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-black text-[#2D241E] text-lg">Timeline</h3>
                            <button onClick={() => window.location.reload()} className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">refresh</span> Refresh
                            </button>
                        </div>

                        <div className="relative ml-2 space-y-0 pb-2">
                            {/* Connecting Line Vertical */}
                            <div className="absolute top-4 bottom-4 left-[7px] w-0.5 bg-gray-100 rounded-full"></div>
                            {/* Active Line Progress (Mock) */}
                            <div className="absolute top-4 h-[60%] left-[7px] w-0.5 bg-gradient-to-b from-green-500 to-primary rounded-full"></div>

                            {/* Steps */}
                            {[
                                { title: 'Order Placed', time: '10:30 AM', active: true, done: true, icon: 'receipt_long' },
                                { title: 'Preparing Food', time: '11:15 AM', active: true, done: true, icon: 'skillet' },
                                { title: 'Out for Delivery', time: '12:45 PM', active: true, done: false, pulse: true, icon: 'moped' },
                                { title: 'Delivered', time: 'Est. 01:00 PM', active: false, done: false, icon: 'home' }
                            ].map((step, idx) => (
                                <div key={idx} className={`relative pl-10 pb-10 last:pb-0 group ${step.active ? '' : 'opacity-50'}`}>
                                    {/* Icon Marker */}
                                    <div className={`absolute -left-0 top-0 size-4 rounded-full border-2 border-white shadow-sm z-10 transition-all duration-500 ${step.done ? 'bg-green-500 scale-110' : step.pulse ? 'bg-primary animate-pulse scale-125' : 'bg-gray-200'}`}></div>

                                    <div className={`p-4 rounded-2xl border transition-all duration-300 ${step.pulse ? 'bg-orange-50 border-orange-100 shadow-md translate-x-2' : 'bg-transparent border-transparent'}`}>
                                        <h4 className={`text-sm font-black flex items-center gap-2 ${step.active ? 'text-[#2D241E]' : 'text-gray-400'}`}>
                                            {step.title}
                                            {step.pulse && <span className="flex size-2 rounded-full bg-primary animate-ping"></span>}
                                        </h4>
                                        <p className="text-[10px] font-bold text-[#5C4D42] opacity-60 mt-1 font-mono">{step.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
};

export default Track;
