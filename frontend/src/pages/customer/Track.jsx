import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAuth } from '../../context/UserContext';
import { useSocket } from '../../context/SocketContext';
import { TrackSkeleton } from '../../components/common';

const Track = () => {
    const { hasActiveSubscription } = useSubscription();
    const { token } = useAuth();
    const { socket } = useSocket();

    const [loading, setLoading] = useState(true);
    const [trackingData, setTrackingData] = useState(null);
    const [error, setError] = useState(null);

    const fetchTracking = async (showLoading = true) => {
        if (!token) return;
        if (showLoading) setLoading(true);
        try {
            const res = await axios.get('/api/customer/track/live', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setTrackingData(res.data.data);
                setError(null);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || "No active order to track";
            console.error("Error fetching tracking", err);
            setError(errorMsg);
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    useEffect(() => {
        if (hasActiveSubscription()) {
            fetchTracking();
        } else {
            setLoading(false);
        }
    }, [token, hasActiveSubscription]);

    useEffect(() => {
        if (socket) {
            socket.on('orderStatusUpdate', (data) => {
                setTrackingData(prev => ({
                    ...prev,
                    order: { ...prev.order, status: data.status },
                    timeline: data.timeline,
                }));
                toast.success(`Order Updated: ${data.status.replace('_', ' ')}`);
            });
            return () => socket.off('orderStatusUpdate');
        }
    }, [socket]);

    if (!hasActiveSubscription()) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 bg-[#F8F9FA]">
                <div className="size-20 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mb-6 border border-primary/10 shadow-inner">
                    <span className="material-symbols-outlined text-primary text-4xl">lock_open</span>
                </div>
                <h2 className="text-2xl font-black text-[#2D241E]">Tracking Locked</h2>
                <p className="text-[#5C4D42] mt-2 max-w-sm font-medium opacity-70">Please subscribe to a plan to access real-time delivery tracking.</p>
                <Link to="/customer/find-mess" className="mt-8 px-10 py-3.5 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all">Find a Mess</Link>
            </div>
        );
    }

    if (loading) return <div className="p-6 bg-[#F8F9FA]"><TrackSkeleton /></div>;

    if (error || !trackingData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 bg-[#F8F9FA]">
                <div className="size-24 bg-white rounded-[3rem] flex items-center justify-center mb-8 border border-gray-100 shadow-xl">
                    <span className="material-symbols-outlined text-5xl text-gray-200">local_shipping</span>
                </div>
                <h2 className="text-2xl font-black text-[#2D241E]">No Active Deliveries</h2>
                <p className="text-[#5C4D42] mt-3 max-w-md font-medium opacity-60">You don't have any orders out for delivery right now.</p>
                <Link to="/customer/dashboard" className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all">Go to Dashboard</Link>
            </div>
        );
    }

    const { order, eta, deliveryPartner } = trackingData;

    // Helper to map API status to Dashboard Steps (1-5)
    const getStepFromStatus = (status) => {
        switch (status) {
            case 'confirmed': return 1;
            case 'cooking': return 2;
            case 'prepared': return 3;
            case 'out_for_delivery': return 4;
            case 'delivered': return 5;
            default: return 1;
        }
    };
    const currentStep = getStepFromStatus(order.status);

    return (
        <div className="min-h-screen bg-[#FDFCFB] p-4 md:p-8 flex justify-center">

            {/* Main Content Width */}
            <div className="w-full max-w-2xl space-y-8 animate-[fadeIn_0.5s_ease-out]">

                {/* header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <div>
                        <h1 className="text-2xl font-black text-[#2D241E]">Live Tracking</h1>
                        <p className="text-sm text-[#5C4D42] font-medium opacity-60">Order #{order.orderNumber}</p>
                    </div>
                </div>

                {/* 1. DASHBOARD STYLE TRACKER CARD */}
                <section className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden group border border-white/60 shadow-[0_20px_40px_-10px_rgba(255,87,36,0.1)]">
                    {/* bg blobs */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-orange-100/50 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <span className="text-xs font-black text-orange-500 uppercase tracking-widest mb-2 block">Live Status</span>
                                <h2 className="text-3xl font-black text-[#2D241E] capitalize">{order.status.replace(/_/g, ' ')} 🍳</h2>
                            </div>
                            <div className="bg-white/60 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/60 text-right shadow-sm">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estimated Arrival</p>
                                <div className="flex items-baseline justify-end gap-1">
                                    <p className="text-2xl font-black text-[#2D241E]">{eta}</p>
                                    <span className="text-xs font-bold text-gray-400">mins</span>
                                </div>
                            </div>
                        </div>

                        {/* Horizontal Progress Bar */}
                        <div className="relative h-3 bg-gray-100 rounded-full mb-10 overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-primary rounded-full shadow-[0_0_15px_rgba(234,88,12,0.5)] transition-all duration-1000 ease-out"
                                style={{ width: `${(currentStep / 5) * 100}%` }}
                            ></div>
                        </div>

                        {/* Steps Icons */}
                        <div className="flex justify-between px-2 relative">
                            {['Prep', 'Cooking', 'Packed', 'On Way', 'Delivered'].map((step, idx) => (
                                <div key={step} className="flex flex-col items-center gap-3 z-10 w-16">
                                    <div className={`size-12 rounded-full flex items-center justify-center border-[3px] transition-all duration-500 ${idx + 1 <= currentStep ? 'border-primary bg-white text-primary scale-110 shadow-lg shadow-orange-100' : 'border-gray-100 bg-gray-50 text-gray-300'
                                        }`}>
                                        <span className="material-symbols-outlined text-[20px] font-bold">
                                            {idx === 0 ? 'kitchen' : idx === 1 ? 'skillet' : idx === 2 ? 'package_2' : idx === 3 ? 'moped' : 'check'}
                                        </span>
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider text-center ${idx + 1 <= currentStep ? 'text-[#2D241E]' : 'text-gray-300'
                                        }`}>{step}</span>
                                </div>
                            ))}
                            {/* Connecting Line (Behind dots) */}
                            <div className="absolute top-6 left-4 right-4 h-[2px] bg-gray-100 -z-10"></div>
                        </div>
                    </div>
                </section>

                {/* 2. DELIVERY PARTNER CARD (Styled to match) */}
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <img src={deliveryPartner.image} alt={deliveryPartner.name} className="size-16 rounded-full object-cover border-4 border-white shadow-md" />
                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                                4.9 ★
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Your Valet</p>
                            <h3 className="text-xl font-bold text-[#2D241E]">{deliveryPartner.name}</h3>
                            <p className="text-xs text-gray-500 font-medium">Vaccinated • {deliveryPartner.phone}</p>
                        </div>
                    </div>

                    <a href={`tel:${deliveryPartner.phone}`} className="size-14 bg-[#1E1E1E] text-white rounded-full flex items-center justify-center hover:bg-primary hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 group">
                        <span className="material-symbols-outlined text-2xl group-hover:animate-shake">call</span>
                    </a>
                </div>

            </div>
        </div>
    );
};

export default Track;
