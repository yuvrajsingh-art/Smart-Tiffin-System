import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAuth } from '../../context/UserContext';
import {
    BackgroundBlobs,
    PageHeader
} from '../../components/common';
import {
    LiveTrackingMap,
    DeliveryPartnerCard,
    OrderTimeline
} from '../../components/customer';
import { TrackSkeleton } from '../../components/common';

const Track = () => {
    const { hasActiveSubscription } = useSubscription();
    const { token } = useAuth();

    const [loading, setLoading] = useState(true);
    const [trackingData, setTrackingData] = useState(null);
    const [error, setError] = useState(null);
    const [showDetails, setShowDetails] = useState(true);

    const fetchTracking = async () => {
        if (!token) return;
        try {
            const res = await axios.get('/api/customer/track/live', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setTrackingData(res.data.data);
                setError(null);
            }
        } catch (err) {
            console.error("Error fetching tracking", err);
            setError(err.response?.data?.message || "No active order to track");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasActiveSubscription()) {
            fetchTracking();
            const interval = setInterval(fetchTracking, 30000);
            return () => clearInterval(interval);
        }
    }, [token, hasActiveSubscription]);

    if (!hasActiveSubscription()) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-[fadeIn_0.5s_ease-out] px-4">
                <BackgroundBlobs />
                <div className="size-24 bg-gray-100 rounded-full flex items-center justify-center shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-200 to-transparent"></div>
                    <span className="material-symbols-outlined text-4xl text-gray-400 relative z-10">lock</span>
                </div>
                <div>
                    <h2 className="text-2xl font-black text-[#2D241E]">Feature Locked</h2>
                    <p className="text-[#5C4D42] mt-2 max-w-md mx-auto font-medium leading-relaxed">
                        Delivery tracking is only available for active subscribers. Please subscribe to a plan first.
                    </p>
                </div>
                <Link to="/customer/find-mess" className="px-8 py-3 bg-[#111716] text-white rounded-xl font-bold shadow-xl hover:scale-105 transition-all">
                    Find a Mess
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="w-full pb-20 px-4">
                <PageHeader title="Live Tracking" />
                <TrackSkeleton />
            </div>
        );
    }

    if (error || !trackingData) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-[fadeIn_0.5s_ease-out] px-4">
                <BackgroundBlobs />
                <div className="size-24 bg-orange-50 rounded-full flex items-center justify-center shadow-inner border order-orange-100">
                    <span className="material-symbols-outlined text-4xl text-primary">moped</span>
                </div>
                <div>
                    <h2 className="text-2xl font-black text-[#2D241E]">No Active Delivery</h2>
                    <p className="text-[#5C4D42] mt-2 max-w-md mx-auto font-medium leading-relaxed">
                        {error || "Your next meal isn't out for delivery yet. Check back during meal hours!"}
                    </p>
                </div>
                <Link to="/customer/dashboard" className="px-8 py-3 bg-[#2D241E] text-white rounded-xl font-bold shadow-xl hover:scale-105 transition-all">
                    Go to Dashboard
                </Link>
            </div>
        );
    }

    const { order, eta, distance, timeline, deliveryPartner } = trackingData;

    return (
        <div className="w-full mx-auto space-y-6 animate-[fadeIn_0.5s_ease-out] pb-20 px-4 relative">
            <BackgroundBlobs />
            <PageHeader
                title="Live Tracking"
                rightElement={
                    <div className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full flex items-center gap-2 border border-green-200 shadow-sm">
                        <span className="size-2 bg-green-600 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest">{order.status.replace('_', ' ')}</span>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <LiveTrackingMap
                        eta={eta}
                        distance={distance}
                        deliveryPartner={deliveryPartner}
                    />

                    <div className="glass-panel rounded-[2rem] border border-white/60 overflow-hidden transition-all duration-300 shadow-sm bg-white/20">
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="w-full flex items-center justify-between p-6 hover:bg-white/40 transition-colors"
                        >
                            <h3 className="font-black text-[#2D241E] text-sm uppercase tracking-widest flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">receipt_long</span>
                                Order Summary
                            </h3>
                            <span className={`material-symbols-outlined text-[#2D241E] transition-transform duration-500 ${showDetails ? 'rotate-180' : ''}`}>expand_circle_down</span>
                        </button>

                        {showDetails && (
                            <div className="px-6 pb-6 animate-[slideDown_0.3s_ease-out]">
                                <div className="flex gap-5 items-center p-5 bg-white/80 rounded-3xl border border-white shadow-sm">
                                    <div className="size-20 rounded-2xl overflow-hidden shrink-0 shadow-md">
                                        <img src={order.meal.image} className="w-full h-full object-cover transform hover:scale-110 transition-transform" alt="Food" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-black text-[#2D241E] text-lg leading-tight">{order.meal.name}</h4>
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">{order.paymentStatus}</span>
                                        </div>
                                        <p className="text-xs font-bold text-[#5C4D42] opacity-60 line-clamp-1">{order.meal.items}</p>
                                        <div className="flex gap-2 mt-3">
                                            <span className="text-[9px] bg-orange-50 text-orange-700 px-2.5 py-1 rounded-md border border-orange-100 font-black uppercase tracking-wider shadow-sm">{order.meal.spiceLevel}</span>
                                            <span className="text-[9px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-100 font-black uppercase tracking-wider shadow-sm">{order.meal.mealType}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <DeliveryPartnerCard deliveryPartner={deliveryPartner} />
                    <OrderTimeline timeline={timeline} onRefresh={fetchTracking} />
                </div>
            </div>
        </div>
    );
};

export default Track;
