import React from 'react';

const PlanDisplay = ({ plan, onEdit }) => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="size-12 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <span className="material-symbols-outlined text-2xl">card_membership</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-[#2D241E]">Your Subscription Plan</h1>
                        <p className="text-sm text-[#5C4D42] font-medium">Active plan visible to customers</p>
                    </div>
                </div>
                <button
                    onClick={onEdit}
                    className="px-6 py-3 bg-white border-2 border-primary text-primary rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-lg">edit</span>
                    Edit Plan
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kitchen Info */}
                <div className="glass-panel p-6 rounded-[2rem] border border-white/60 bg-white/30 md:col-span-2">
                    <div className="mb-4">
                        <p className="text-xs font-bold text-[#5C4D42] uppercase tracking-widest mb-1 opacity-60">Provider</p>
                        <h3 className="text-2xl font-black text-[#2D241E] mb-1">{plan.providerName}</h3>
                        <p className="text-sm font-bold text-primary">{plan.kitchenName}</p>
                    </div>
                    <p className="text-[#5C4D42] font-medium leading-relaxed">{plan.description}</p>
                </div>

                {/* Monthly Plan */}
                <div className="bg-gradient-to-br from-[#2D241E] to-[#1a120b] rounded-[2rem] p-6 relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                        Best Value
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                    
                    <div className="relative z-10">
                        <h4 className="font-black text-white text-lg mb-1">Monthly Complete</h4>
                        <div className="flex flex-wrap gap-2 text-[10px] text-white/60 font-bold uppercase tracking-wider mb-4">
                            <span className="bg-white/10 px-2 py-0.5 rounded-md">Lunch + Dinner</span>
                            <span className="bg-white/10 px-2 py-0.5 rounded-md">Weekend Spl</span>
                        </div>
                        
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-white tracking-tight">₹{plan.monthlyPrice}</span>
                            <span className="text-white/40 text-sm font-bold">/month</span>
                        </div>
                    </div>
                </div>

                {/* Weekly Plan */}
                <div className="glass-panel p-6 rounded-[2rem] border border-white/60 bg-white/50">
                    <h4 className="font-bold text-[#2D241E] text-lg mb-1">Weekly Trial</h4>
                    <p className="text-xs text-[#5C4D42] font-semibold opacity-70 mb-4">Perfect for checking quality</p>
                    
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-[#2D241E]">₹{plan.weeklyPrice}</span>
                        <span className="text-[#5C4D42]/50 text-sm font-bold">/week</span>
                    </div>
                </div>

                {/* Features */}
                <div className="glass-panel p-6 rounded-[2rem] border border-white/60 bg-white/30">
                    <h4 className="text-sm font-black text-[#2D241E] uppercase tracking-widest mb-4 opacity-60">Key Features</h4>
                    <div className="flex flex-wrap gap-2">
                        {plan.features.map((feature, i) => (
                            <span key={i} className="px-4 py-2 bg-white/50 text-[#2D241E] rounded-xl text-xs font-bold border border-white/60 flex items-center gap-2 shadow-sm">
                                <span className="material-symbols-outlined text-[16px] text-green-600">check_circle</span>
                                {feature}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Cuisines */}
                <div className="glass-panel p-6 rounded-[2rem] border border-white/60 bg-white/30">
                    <h4 className="text-sm font-black text-[#2D241E] uppercase tracking-widest mb-4 opacity-60">Cuisines Served</h4>
                    <div className="flex flex-wrap gap-2">
                        {plan.cuisines.map((cuisine, i) => (
                            <span key={i} className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-black border border-orange-100 uppercase tracking-wide">
                                {cuisine}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanDisplay;
