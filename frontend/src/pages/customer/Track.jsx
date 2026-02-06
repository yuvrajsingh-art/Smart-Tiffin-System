import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAuth } from '../../context/UserContext';
import { useSocket } from '../../context/SocketContext';
import {
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
            if (showLoading) {
                toast.error(errorMsg, { duration: 3000 });
            }
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
                toast.success(`Order Status: ${data.status.replace('_', ' ')}`, {
                    icon: '🛵',
                    style: {
                        borderRadius: '1rem',
                        background: '#111716',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 'bold',
                    }
                });
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
                    <span className="material-symbols-outlined text-5xl text-gray-200">route</span>
                </div>
                <h2 className="text-2xl font-black text-[#2D241E]">No Active Deliveries</h2>
                <p className="text-[#5C4D42] mt-3 max-w-md font-medium opacity-60">You don't have any orders out for delivery right now.</p>
            </div>
        );
    }

    const { order, eta, distance, timeline, deliveryPartner } = trackingData;

    return (
        <div className="w-full min-h-[calc(100vh-80px)] bg-[#FDFCFB] flex flex-col lg:flex-row animate-[fadeIn_0.5s_ease-out]">

            {/* LEFT: COMMAND CENTER (65%) */}
            <div className="flex-[0.65] p-6 lg:p-10 flex flex-col h-[60vh] lg:h-auto">
                <div className="flex-1 bg-white rounded-[3.5rem] border border-gray-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.06)] overflow-hidden relative group">
                    <LiveTrackingMap
                        eta={eta}
                        distance={distance}
                        deliveryPartner={deliveryPartner}
                        orderStatus={order.status}
                        mapData={trackingData.mapData}
                    />

                    {/* MINIMAL LIVE INDICATOR */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[1001]">
                        <div className="bg-white/90 backdrop-blur-md px-8 py-3.5 rounded-full shadow-2xl border border-white/50 flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="size-2.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(244,114,22,0.8)]"></span>
                                <span className="text-[10px] font-black text-[#2D241E] uppercase tracking-widest">Live Pursuit</span>
                            </div>
                            <div className="w-px h-4 bg-gray-200"></div>
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{order.status.replace('_', ' ')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT: DETAIL INTELLIGENCE (35%) */}
            <div className="flex-[0.35] bg-white border-l border-gray-100 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.02)] relative z-10">
                <div className="p-10 flex-1 overflow-y-auto no-scrollbar space-y-12">

                    {/* SECTION 1: IDENTITY & STATUS */}
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-2 leading-none">Subscription Feed</h3>
                                <h2 className="text-3xl font-black text-[#2D241E] tracking-tight">#{order.orderNumber}</h2>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">ETA</p>
                                <p className="text-2xl font-black text-primary tracking-tighter">{eta} MIN</p>
                            </div>
                        </div>

                        <div className="bg-primary/5 border border-primary/10 rounded-[2rem] p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="size-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border border-primary/5">
                                    <span className="material-symbols-outlined text-2xl">local_shipping</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-[#2D241E]/40 uppercase tracking-widest leading-none mb-1">Current Protocol</p>
                                    <h4 className="text-sm font-black text-[#2D241E] uppercase tracking-tight">{order.status.replace('_', ' ')}</h4>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-primary/20 text-3xl">trending_flat</span>
                        </div>
                    </div>

                    {/* SECTION 2: DELIVERY PARTNER */}
                    <div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-6 leading-none border-b border-gray-50 pb-4">Fleet Specialist</h3>
                        <div className="flex items-center gap-6">
                            <div className="size-16 rounded-[1.5rem] overflow-hidden border-2 border-white shadow-lg shrink-0">
                                <img src={deliveryPartner.image} className="w-full h-full object-cover" alt="Rider" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-lg font-black text-[#2D241E] leading-none mb-2">{deliveryPartner.name}</h4>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-md">⭐ {deliveryPartner.rating}</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ECO-TIFFIN RIDER</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <a href={`tel:${deliveryPartner.phone}`} className="size-10 bg-[#111716] text-white rounded-xl flex items-center justify-center hover:bg-black transition-all shadow-md">
                                    <span className="material-symbols-outlined text-lg">call</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: JOURNEY LOG */}
                    <div>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-8 leading-none border-b border-gray-50 pb-4">Mission Timeline</h3>
                        <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                            <OrderTimeline timeline={timeline} onRefresh={() => fetchTracking(false)} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Track;
