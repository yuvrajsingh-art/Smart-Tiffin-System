import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAuth } from '../../context/UserContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';

// Modular Components
import LiveTracker from '../../components/customer/LiveTracker';
import TodaysMenuCard from '../../components/customer/TodaysMenuCard';
import WalletCard from '../../components/customer/WalletCard';

const CustomerDashboard = () => {
    const { hasActiveSubscription, subscription } = useSubscription();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const userName = user?.name || dashboardData?.userName || 'Customer';

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data } = await axios.get('/api/customer/dashboard');
                if (data.success) {
                    setDashboardData(data.data);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                toast.error("Failed to load dashboard. Please refresh.", { duration: 3000 });
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const isActive = hasActiveSubscription();
    const isImpersonating = localStorage.getItem('impersonationMode') === 'true';

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="w-full mx-auto flex flex-col gap-6 animate-[fadeIn_0.5s_ease-out] pb-20 px-4 relative">

            {/* Impersonation Banner */}
            {isImpersonating && (
                <div className="bg-[#2D241E] text-white px-4 py-3 rounded-xl flex items-center justify-between shadow-xl mb-2 animate-[slideInDown_0.5s]">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-orange-500 animate-pulse">visibility</span>
                        <div className="text-xs font-medium">
                            <span className="font-bold text-orange-400 uppercase tracking-wider block text-[10px]">Admin View</span>
                            Viewing as <span className="font-bold text-xl">{userName}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem('impersonationMode');
                            localStorage.setItem('userRole', 'admin');
                            window.history.back();
                        }}
                        className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
                    >
                        Exit View <span className="material-symbols-outlined text-[14px]">logout</span>
                    </button>
                </div>
            )}

            {/* Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="blob blob-1 blob-primary opacity-30 scale-75"></div>
                <div className="blob blob-2 blob-secondary opacity-30 scale-75"></div>
            </div>

            {/* Active Subscription View */}
            {isActive ? (
                <>
                    {/* Welcome Header */}
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-2xl font-black text-[#2D241E] leading-tight">Hello, {userName.split(' ')[0]}! 👋</h1>
                            <p className="text-[#5C4D42] font-medium text-sm">Your tiffin is being prepared with love.</p>
                        </div>
                        <div className="hidden md:block">
                            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-2 shadow-sm border border-green-200">
                                <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                                Subscription Active
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Left Col: Live Status & Menu */}
                        <div className="lg:col-span-2 space-y-6">
                            <LiveTracker dashboardData={dashboardData} />
                            <TodaysMenuCard
                                todaysMenu={dashboardData?.todaysMenu}
                                lunchTime={dashboardData?.lunchTime}
                                dinnerTime={dashboardData?.dinnerTime}
                            />
                        </div>

                        {/* Right Col: Wallet & Actions */}
                        <div className="space-y-6">
                            <WalletCard
                                balance={dashboardData?.walletBalance}
                                recentAddition={dashboardData?.recentAddition}
                            />

                            {/* Quick Actions Grid */}
                            <div>
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 px-2">Quick Actions</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <Link to="/customer/manage-subscription" className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all group">
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
                                    {(dashboardData?.streak > 0) ? "🔥" : "❄️"}
                                </div>
                                <div>
                                    <h4 className="font-black text-[#2D241E]">{dashboardData?.streak || 0} Day Streak!</h4>
                                    <p className="text-xs text-[#5C4D42] font-medium">Keep ordering to grow your streak.</p>
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
