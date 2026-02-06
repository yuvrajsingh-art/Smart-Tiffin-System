import React from 'react';
import { Link } from 'react-router-dom';

const SubscriptionPlansGrid = ({ provider, providerId }) => {
    return (
        <div className="space-y-6">
            <div className="glass-panel p-6 rounded-[2.5rem] sticky top-24 border-2 border-white/60 shadow-xl bg-white/40 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-xl">card_membership</span>
                    </div>
                    <h2 className="text-xl font-black text-[#2D241E]">Select Plan</h2>
                </div>

                {/* Monthly Plan (Featured) */}
                <div className="bg-gradient-to-br from-[#2D241E] to-[#1a120b] rounded-[1.8rem] p-5 mb-4 relative overflow-hidden group shadow-lg ring-1 ring-black/5">
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest shadow-md">
                        Best Value
                    </div>

                    {/* Decorative Circles */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-black text-white text-lg mb-1">Monthly Complete</h3>
                                <div className="flex flex-wrap gap-2 text-[10px] text-white/60 font-bold uppercase tracking-wider">
                                    <span className="bg-white/10 px-2 py-0.5 rounded-md">Lunch + Dinner</span>
                                    <span className="bg-white/10 px-2 py-0.5 rounded-md">Weekend Spl</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-baseline gap-1 mb-5">
                            <span className="text-3xl font-black text-white tracking-tight">₹{provider.monthlyPrice}</span>
                            <span className="text-white/40 text-xs font-bold">/month</span>
                        </div>

                        <Link
                            to={`/customer/mess/${providerId}/subscribe?plan=monthly`}
                            className="w-full py-3.5 bg-white text-[#1a120b] rounded-[1.2rem] font-black text-xs shadow-lg hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group/btn"
                        >
                            Choose Monthly
                            <span className="material-symbols-outlined text-[16px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                        </Link>
                    </div>
                </div>

                {/* Weekly Plan */}
                <div className="bg-white/50 rounded-[1.8rem] p-5 border border-white/60 hover:bg-white/80 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-bold text-[#2D241E] text-base mb-1">Weekly Trial</h3>
                            <p className="text-[10px] text-[#5C4D42] font-semibold opacity-70">Perfect for checking quality</p>
                        </div>
                        <div className="text-right">
                            <span className="text-xl font-black text-[#2D241E]">₹{provider.weeklyPrice}</span>
                            <p className="text-[9px] text-[#5C4D42]/50 font-bold uppercase">/week</p>
                        </div>
                    </div>

                    <Link
                        to={`/customer/mess/${providerId}/subscribe?plan=weekly`}
                        className="w-full py-3 bg-transparent border-2 border-[#2D241E]/10 text-[#2D241E] rounded-[1.2rem] font-bold text-xs hover:border-[#2D241E] hover:bg-[#2D241E] hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                        Try Weekly Plan
                    </Link>
                </div>

                {/* Assurance Badges */}
                <div className="mt-6 flex justify-center gap-4">
                    <div className="flex flex-col items-center text-center gap-1">
                        <span className="material-symbols-outlined text-green-600 text-xl bg-green-50 p-2 rounded-full">security</span>
                        <span className="text-[9px] font-bold text-[#5C4D42] uppercase tracking-wide">Secure<br />Payment</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-1">
                        <span className="material-symbols-outlined text-blue-600 text-xl bg-blue-50 p-2 rounded-full">verified_user</span>
                        <span className="text-[9px] font-bold text-[#5C4D42] uppercase tracking-wide">Verified<br />Refunds</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-1">
                        <span className="material-symbols-outlined text-orange-600 text-xl bg-orange-50 p-2 rounded-full">support_agent</span>
                        <span className="text-[9px] font-bold text-[#5C4D42] uppercase tracking-wide">24/7<br />Support</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SubscriptionPlansGrid;
