import React from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../../context/SubscriptionContext';

const CustomerDashboard = () => {
    const { hasActiveSubscription, subscription } = useSubscription();
    const isActive = hasActiveSubscription();

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8 animate-[fadeIn_0.5s_ease-out]">

            {/* Active Plan & Stats Section */}
            {isActive ? (
                <>
                    <section className="glass-panel p-8 rounded-[2rem] relative overflow-hidden group">
                        <div className="absolute -right-10 -top-10 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                        <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                            <div className="flex-1 space-y-6">
                                <div>
                                    <h2 className="text-sm font-extrabold text-[#5C4D42] uppercase tracking-widest mb-1">Current Subscription</h2>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-4xl font-black text-[#2D241E]">{subscription.plan}</span>
                                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                                            <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                                            Active
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-10">
                                    <div>
                                        <p className="text-sm text-[#5C4D42] font-semibold mb-1">Wallet Balance</p>
                                        <p className="text-2xl font-black text-primary">₹ 450.00</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#5C4D42] font-semibold mb-1">Meals Remaining</p>
                                        <p className="text-2xl font-black text-[#2D241E]">24</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#5C4D42] font-semibold mb-1">Valid Until</p>
                                        <p className="text-2xl font-black text-[#2D241E]">{new Date(subscription.expiryDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Next Meal Card inside the big card */}
                            <div className="w-full md:w-80 glass-panel p-5 border border-white/50 flex flex-col gap-3 backdrop-blur-md">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Next Meal: Lunch</span>
                                    <span className="text-xs font-bold text-[#5C4D42]">12:30 PM - 2:30 PM</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="size-14 rounded-xl bg-orange-50 flex items-center justify-center text-3xl shadow-sm">🍛</div>
                                    <div>
                                        <p className="font-bold text-[#2D241E] leading-tight">Paneer Butter Masala</p>
                                        <p className="text-sm text-[#5C4D42]">with 3 Rotis & Jeera Rice</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Quick Actions */}
                    <div>
                        <h3 className="text-xl font-black text-[#2D241E] mb-6 px-2">Quick Actions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Link to="/customer/wallet" className="glass-panel p-6 rounded-3xl flex flex-col items-start gap-4 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group text-left border-white/60">
                                <div className="size-12 rounded-2xl bg-orange-100 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
                                    <span className="material-symbols-outlined">add_card</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#2D241E] text-lg">Recharge Wallet</h4>
                                    <p className="text-sm text-[#5C4D42] mt-1">Add funds securely</p>
                                </div>
                            </Link>
                            <Link to="/customer/menu" className="glass-panel p-6 rounded-3xl flex flex-col items-start gap-4 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group text-left border-white/60">
                                <div className="size-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform shadow-sm">
                                    <span className="material-symbols-outlined">menu_book</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#2D241E] text-lg">Full Menu</h4>
                                    <p className="text-sm text-[#5C4D42] mt-1">Check upcoming meals</p>
                                </div>
                            </Link>
                            <Link to="/customer/pause" className="glass-panel p-6 rounded-3xl flex flex-col items-start gap-4 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group text-left border-white/60">
                                <div className="size-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform shadow-sm">
                                    <span className="material-symbols-outlined">cancel_presentation</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#2D241E] text-lg">Skip Meal</h4>
                                    <p className="text-sm text-[#5C4D42] mt-1">Cancel for today</p>
                                </div>
                            </Link>
                            <Link to="/customer/feedback" className="glass-panel p-6 rounded-3xl flex flex-col items-start gap-4 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group text-left border-white/60">
                                <div className="size-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shadow-sm">
                                    <span className="material-symbols-outlined">support_agent</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#2D241E] text-lg">Help & Support</h4>
                                    <p className="text-sm text-[#5C4D42] mt-1">Contact mess owner</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Activity Table */}
                    <div>
                        <h3 className="text-xl font-black text-[#2D241E] mb-6 px-2">Recent Activity</h3>
                        <div className="glass-panel rounded-3xl overflow-hidden border border-white/60">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-orange-50/30 border-b border-orange-100/50">
                                        <th className="p-5 text-xs font-extrabold text-[#5C4D42] uppercase tracking-wider">Date</th>
                                        <th className="p-5 text-xs font-extrabold text-[#5C4D42] uppercase tracking-wider">Type</th>
                                        <th className="p-5 text-xs font-extrabold text-[#5C4D42] uppercase tracking-wider">Details</th>
                                        <th className="p-5 text-xs font-extrabold text-[#5C4D42] uppercase tracking-wider text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-semibold text-[#2D241E]">
                                    <tr className="border-b border-orange-100/30 hover:bg-white/40 transition-colors">
                                        <td className="p-5">Today, 9:00 AM</td>
                                        <td className="p-5 flex items-center gap-2">
                                            <span className="size-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span> Meal Consumed
                                        </td>
                                        <td className="p-5 text-[#5C4D42]">Breakfast - Aloo Paratha</td>
                                        <td className="p-5 text-right">- ₹60.00</td>
                                    </tr>
                                    <tr className="border-b border-orange-100/30 hover:bg-white/40 transition-colors">
                                        <td className="p-5">Yesterday, 8:15 PM</td>
                                        <td className="p-5 flex items-center gap-2">
                                            <span className="size-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span> Meal Consumed
                                        </td>
                                        <td className="p-5 text-[#5C4D42]">Dinner - Thali Standard</td>
                                        <td className="p-5 text-right">- ₹90.00</td>
                                    </tr>
                                    <tr className="hover:bg-white/40 transition-colors">
                                        <td className="p-5">22 Oct, 11:30 AM</td>
                                        <td className="p-5 flex items-center gap-2">
                                            <span className="size-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span> Wallet Recharge
                                        </td>
                                        <td className="p-5 text-[#5C4D42]">UPI Transaction</td>
                                        <td className="p-5 text-right text-green-600">+ ₹500.00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 animate-[scaleIn_0.3s_ease-out]">
                    <div className="bg-orange-50 rounded-full p-6 mb-8 relative">
                        <div className="absolute inset-0 bg-orange-200 rounded-full blur-xl opacity-50"></div>
                        <span className="material-symbols-outlined text-6xl text-primary relative z-10">lunch_dining</span>
                    </div>
                    <h2 className="text-3xl font-black text-[#2D241E] mb-3 text-center">Welcome to Smart Tiffin!</h2>
                    <p className="text-[#5C4D42] text-lg mb-8 max-w-md text-center leading-relaxed">
                        You don't have an active subscription yet. Discover healthy, homemade meals near you and start your journey.
                    </p>
                    <Link to="/customer/find-mess" className="group relative px-8 py-4 bg-[#111716] text-white rounded-2xl font-bold shadow-xl overflow-hidden hover:scale-105 transition-transform duration-300">
                        <span className="relative z-10 flex items-center gap-2">
                            Find a Mess
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Link>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-4xl">
                        <div className="glass-panel p-6 rounded-2xl text-center">
                            <span className="material-symbols-outlined text-3xl text-primary mb-3">verified</span>
                            <h3 className="font-bold text-[#2D241E] mb-1">Top Rated Food</h3>
                            <p className="text-xs text-[#5C4D42]">Curated list of hygiene-verified mess providers.</p>
                        </div>
                        <div className="glass-panel p-6 rounded-2xl text-center">
                            <span className="material-symbols-outlined text-3xl text-primary mb-3">pause_circle</span>
                            <h3 className="font-bold text-[#2D241E] mb-1">Flexible Plans</h3>
                            <p className="text-xs text-[#5C4D42]">Pause or cancel anytime with easy refund policies.</p>
                        </div>
                        <div className="glass-panel p-6 rounded-2xl text-center">
                            <span className="material-symbols-outlined text-3xl text-primary mb-3">local_shipping</span>
                            <h3 className="font-bold text-[#2D241E] mb-1">Live Tracking</h3>
                            <p className="text-xs text-[#5C4D42]">Know exactly when your tiffin will reach you.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default CustomerDashboard;
