import React, { useState, useEffect } from 'react';
import { useSubscription } from '../../context/SubscriptionContext';
import { Link } from 'react-router-dom';

const Track = () => {
    const { hasActiveSubscription } = useSubscription();
    const [eta, setEta] = useState(15);

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
        <div className="max-w-7xl mx-auto space-y-6 animate-[fadeIn_0.5s_ease-out] pb-20 px-4">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-[#2D241E] tracking-tight">Track Order</h2>
                    <p className="text-sm font-bold text-[#5C4D42] opacity-60">Lunch • Today</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">ID</span>
                    <span className="font-black text-[#2D241E]">#ORD-2891</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Map & Status */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Visual Map Placeholder */}
                    <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white group">
                        <img
                            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop"
                            alt="Map View"
                            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2D241E]/80 to-transparent"></div>

                        {/* Live Floating Elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="relative">
                                <div className="size-20 bg-primary/20 rounded-full animate-ping absolute inset-0"></div>
                                <div className="size-20 bg-white rounded-full flex items-center justify-center shadow-2xl relative z-10 border-4 border-white">
                                    <span className="material-symbols-outlined text-4xl text-primary">moped</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Stats */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex justify-between items-end">
                            <div>
                                <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">Estimated Arrival</p>
                                <h3 className="text-4xl font-black">{eta} mins</h3>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">Distance</p>
                                <h3 className="text-2xl font-black">1.2 km</h3>
                            </div>
                        </div>
                    </div>

                    {/* Order Items Summary */}
                    <div className="glass-panel p-6 rounded-[2rem] border border-white/60">
                        <h3 className="font-black text-[#2D241E] mb-4 text-lg">Order Details</h3>
                        <div className="flex gap-4 items-center p-3 hover:bg-white rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                            <div className="size-16 rounded-xl overflow-hidden shrink-0">
                                <img src="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=200" className="w-full h-full object-cover" alt="Food" />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#2D241E]">Paneer Butter Masala Thali</h4>
                                <p className="text-xs text-[#5C4D42] opacity-80">3 Rotis, Dal Fry, Jeera Rice, Salad</p>
                            </div>
                            <div className="ml-auto">
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-wider">Paid</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column: Timeline & Driver */}
                <div className="space-y-6">

                    {/* Driver Card */}
                    <div className="glass-panel p-6 rounded-[2rem] border border-white/60 bg-gradient-to-br from-white to-orange-50/30">
                        <div className="flex gap-4 items-center mb-6">
                            <div className="size-14 rounded-full p-1 border-2 border-primary relative">
                                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200" className="w-full h-full object-cover rounded-full" alt="Driver" />
                                <div className="absolute bottom-0 right-0 size-4 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <div>
                                <h4 className="font-black text-[#2D241E] text-lg leading-none">Rajesh Kumar</h4>
                                <p className="text-xs font-bold text-[#5C4D42] mt-1 opacity-60">Delivery Partner • 4.9 ⭐</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex-1 py-3 rounded-xl bg-[#2D241E] text-white font-bold text-sm shadow-lg hover:translate-y-px transition-all flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-sm">call</span> Call
                            </button>
                            <button className="flex-1 py-3 rounded-xl bg-white text-[#2D241E] border border-gray-200 font-bold text-sm shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-sm">chat</span> Message
                            </button>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="glass-panel p-8 rounded-[2rem] border border-white/60 relative overflow-hidden">
                        <h3 className="font-black text-[#2D241E] mb-6 text-lg">Timeline</h3>

                        <div className="relative border-l-2 border-dashed border-gray-200 ml-3.5 space-y-8 pb-2">
                            {/* Steps */}
                            {[
                                { title: 'Order Placed', time: '10:30 AM', active: true, done: true },
                                { title: 'Preparing Food', time: '11:15 AM', active: true, done: true },
                                { title: 'Out for Delivery', time: '12:45 PM', active: true, done: false, pulse: true },
                                { title: 'Delivered', time: 'Est. 01:00 PM', active: false, done: false }
                            ].map((step, idx) => (
                                <div key={idx} className={`relative pl-8 ${step.active ? '' : 'grayscale opacity-40'}`}>
                                    <div className={`absolute -left-[9px] top-1 size-4 rounded-full border-2 border-white shadow-sm z-10 ${step.done ? 'bg-green-500' : step.pulse ? 'bg-primary animate-pulse' : 'bg-gray-200'}`}></div>
                                    <h4 className={`text-sm font-bold ${step.active ? 'text-[#2D241E]' : 'text-gray-400'}`}>{step.title}</h4>
                                    <p className="text-[10px] font-bold text-[#5C4D42] opacity-50 mt-0.5">{step.time}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Track;
