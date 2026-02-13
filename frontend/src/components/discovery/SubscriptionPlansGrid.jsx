import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SubscriptionPlansGrid = ({ provider, providerId }) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await axios.get('/api/customer/discovery/plans');
                if (res.data.success) {
                    setPlans(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch plans", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    if (loading) return <div className="text-center py-10 text-xs font-bold text-gray-400">Loading Plans...</div>;

    // Filter for Monthly and Weekly to display in specific slots if needed, or just map all
    const monthlyPlans = plans.filter(p => p.period === 'Monthly');
    const weeklyPlans = plans.filter(p => p.period === 'Weekly' || p.period === 'Trial');

    // Default Fallback if no plans in DB (Backwards compatibility with provider.monthlyPrice)
    const showFallback = plans.length === 0;

    return (
        <div className="space-y-6">
            <div className="glass-panel p-6 rounded-[2.5rem] sticky top-24 border-2 border-white/60 shadow-xl bg-white/40 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-xl">card_membership</span>
                    </div>
                    <h2 className="text-xl font-black text-[#2D241E]">Select Plan</h2>
                </div>

                {showFallback ? (
                    /* Fallback to old Provider Price View */
                    <div className="bg-gradient-to-br from-[#2D241E] to-[#1a120b] rounded-[1.8rem] p-5 mb-4 relative overflow-hidden group shadow-lg ring-1 ring-black/5">
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest shadow-md">
                            Best Value
                        </div>
                        <div className="relative z-10">
                            <h3 className="font-black text-white text-lg mb-1">Monthly Complete</h3>
                            <div className="flex items-baseline gap-1 mb-5">
                                <span className="text-3xl font-black text-white tracking-tight">₹{provider.monthlyPrice}</span>
                                <span className="text-white/40 text-xs font-bold">/month</span>
                            </div>
                            <Link to={`/customer/mess/${providerId}/subscribe?plan=monthly`} className="w-full py-3.5 bg-white text-[#1a120b] rounded-[1.2rem] font-black text-xs shadow-lg flex items-center justify-center gap-2">
                                Choose Monthly
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* Render Database Plans */
                    <div className="space-y-4">
                        {plans.map((plan) => (
                            <div key={plan._id} className={`rounded-[1.8rem] p-5 relative overflow-hidden group shadow-lg ring-1 ring-black/5 transition-all ${plan.period === 'Monthly' ? 'bg-gradient-to-br from-[#2D241E] to-[#1a120b] text-white' : 'bg-white/50 border border-white/60 hover:bg-white/80 text-[#2D241E]'}`}>

                                {plan.badge && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest shadow-md">
                                        {plan.badge}
                                    </div>
                                )}

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className={`font-black text-lg mb-0.5 ${plan.period === 'Monthly' ? 'text-white' : 'text-[#2D241E]'}`}>{plan.name}</h3>
                                            <p className={`text-[10px] font-bold uppercase tracking-wider ${plan.period === 'Monthly' ? 'text-white/60' : 'text-[#5C4D42]/70'}`}>{plan.type} Series</p>
                                        </div>
                                    </div>

                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className={`text-2xl font-black tracking-tight ${plan.period === 'Monthly' ? 'text-white' : 'text-[#2D241E]'}`}>₹{plan.price}</span>
                                        <span className={`text-xs font-bold ${plan.period === 'Monthly' ? 'text-white/40' : 'text-[#5C4D42]/50'}`}>/{plan.period === 'Monthly' ? 'mo' : (plan.period === 'Weekly' ? 'wk' : 'trial')}</span>
                                    </div>

                                    <Link
                                        to={`/customer/mess/${providerId}/subscribe?plan=${plan.name}&price=${plan.price}&duration=${plan.period === 'Monthly' ? 30 : 7}&type=${plan.type}`}
                                        className={`w-full py-3.5 rounded-[1.2rem] font-black text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 ${plan.period === 'Monthly' ? 'bg-white text-[#1a120b] hover:shadow-orange-500/20' : 'bg-[#2D241E] text-white hover:shadow-xl'}`}
                                    >
                                        Select {plan.period}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Assurance Badges */}
                <div className="mt-6 flex justify-center gap-4">
                    <div className="flex flex-col items-center text-center gap-1">
                        <span className="material-symbols-outlined text-green-600 text-xl bg-green-50 p-2 rounded-full">security</span>
                        <span className="text-[9px] font-bold text-[#5C4D42] uppercase tracking-wide">Secure<br />Payment</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPlansGrid;
