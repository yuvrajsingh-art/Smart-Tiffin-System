import React from 'react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8 animate-[fadeIn_0.5s_ease-out]">

            {/* Active Plan & Stats Section */}
            <section className="glass-panel p-8 rounded-[2rem] relative overflow-hidden group">
                <div className="absolute -right-10 -top-10 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                    <div className="flex-1 space-y-6">
                        <div>
                            <h2 className="text-sm font-extrabold text-[#5C4D42] uppercase tracking-widest mb-1">Current Subscription</h2>
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-black text-[#2D241E]">Standard Monthly</span>
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
                                <p className="text-2xl font-black text-[#2D241E]">12 Nov</p>
                            </div>
                        </div>
                    </div>

                    {/* Next Meal Card inside the big card */}
                    <div className="w-full md:w-80 bg-white/60 rounded-3xl p-5 border border-orange-100 shadow-sm flex flex-col gap-3">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-primary uppercase tracking-wider">Next Meal: Lunch</span>
                            <span className="text-xs font-bold text-[#5C4D42]">12:30 PM - 2:30 PM</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="size-14 rounded-xl bg-orange-50 flex items-center justify-center text-3xl">🍛</div>
                            <div>
                                <p className="font-bold text-[#2D241E] leading-tight">Paneer Butter Masala</p>
                                <p className="text-sm text-[#5C4D42]">with 3 Rotis & Jeera Rice</p>
                            </div>
                        </div>
                        <button className="mt-auto w-full py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">qr_code</span>
                            View QR Code
                        </button>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <div>
                <h3 className="text-xl font-bold text-[#2D241E] mb-6 px-2">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Link to="/customer/wallet" className="glass-panel p-6 rounded-3xl flex flex-col items-start gap-4 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group text-left">
                        <div className="size-12 rounded-2xl bg-orange-100 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">add_card</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#2D241E] text-lg">Recharge Wallet</h4>
                            <p className="text-sm text-[#5C4D42] mt-1">Add funds securely</p>
                        </div>
                    </Link>
                    <Link to="/customer/menu" className="glass-panel p-6 rounded-3xl flex flex-col items-start gap-4 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group text-left">
                        <div className="size-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">menu_book</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#2D241E] text-lg">Full Menu</h4>
                            <p className="text-sm text-[#5C4D42] mt-1">Check upcoming meals</p>
                        </div>
                    </Link>
                    <Link to="/customer/pause" className="glass-panel p-6 rounded-3xl flex flex-col items-start gap-4 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group text-left">
                        <div className="size-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">cancel_presentation</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#2D241E] text-lg">Skip Meal</h4>
                            <p className="text-sm text-[#5C4D42] mt-1">Cancel for today</p>
                        </div>
                    </Link>
                    <Link to="/customer/feedback" className="glass-panel p-6 rounded-3xl flex flex-col items-start gap-4 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group text-left">
                        <div className="size-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
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
                <h3 className="text-xl font-bold text-[#2D241E] mb-6 px-2">Recent Activity</h3>
                <div className="glass-panel rounded-3xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-orange-50/50 border-b border-orange-100">
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
                                    <span className="size-2 rounded-full bg-blue-500"></span> Meal Consumed
                                </td>
                                <td className="p-5 text-[#5C4D42]">Breakfast - Aloo Paratha</td>
                                <td className="p-5 text-right">- ₹60.00</td>
                            </tr>
                            <tr className="border-b border-orange-100/30 hover:bg-white/40 transition-colors">
                                <td className="p-5">Yesterday, 8:15 PM</td>
                                <td className="p-5 flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-blue-500"></span> Meal Consumed
                                </td>
                                <td className="p-5 text-[#5C4D42]">Dinner - Thali Standard</td>
                                <td className="p-5 text-right">- ₹90.00</td>
                            </tr>
                            <tr className="hover:bg-white/40 transition-colors">
                                <td className="p-5">22 Oct, 11:30 AM</td>
                                <td className="p-5 flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-green-500"></span> Wallet Recharge
                                </td>
                                <td className="p-5 text-[#5C4D42]">UPI Transaction</td>
                                <td className="p-5 text-right text-green-600">+ ₹500.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
