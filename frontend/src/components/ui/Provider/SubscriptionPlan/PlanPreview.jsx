import React from 'react';

const PlanPreview = ({ formData }) => {
    const features = formData.features ? formData.features.split(',').map(f => f.trim()).filter(f => f) : [];
    const cuisines = formData.cuisines ? formData.cuisines.split(',').map(c => c.trim()).filter(c => c) : [];

    return (
        <div className="glass-panel p-6 rounded-[2rem] border-2 border-white/60 shadow-xl bg-white/40 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-xl">visibility</span>
                </div>
                <h3 className="text-lg font-black text-[#2D241E]">Preview</h3>
            </div>

            {/* Monthly Plan Preview */}
            <div className="bg-gradient-to-br from-[#2D241E] to-[#1a120b] rounded-[1.8rem] p-5 mb-4 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                    Best Value
                </div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                    <div className="mb-4">
                        <h4 className="font-black text-white text-lg mb-1">Monthly Complete</h4>
                        <div className="flex flex-wrap gap-2 text-[10px] text-white/60 font-bold uppercase tracking-wider">
                            <span className="bg-white/10 px-2 py-0.5 rounded-md">Lunch + Dinner</span>
                            <span className="bg-white/10 px-2 py-0.5 rounded-md">Weekend Spl</span>
                        </div>
                    </div>
                    
                    <div className="flex items-baseline gap-1 mb-5">
                        <span className="text-3xl font-black text-white tracking-tight">
                            ₹{formData.monthlyPrice || '0'}
                        </span>
                        <span className="text-white/40 text-xs font-bold">/month</span>
                    </div>
                    
                    <button className="w-full py-3.5 bg-white text-[#1a120b] rounded-[1.2rem] font-black text-xs shadow-lg">
                        Choose Monthly
                    </button>
                </div>
            </div>

            {/* Weekly Plan Preview */}
            <div className="bg-white/50 rounded-[1.8rem] p-5 border border-white/60 mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h4 className="font-bold text-[#2D241E] text-base mb-1">Weekly Trial</h4>
                        <p className="text-[10px] text-[#5C4D42] font-semibold opacity-70">Perfect for checking quality</p>
                    </div>
                    <div className="text-right">
                        <span className="text-xl font-black text-[#2D241E]">₹{formData.weeklyPrice || '0'}</span>
                        <p className="text-[9px] text-[#5C4D42]/50 font-bold uppercase">/week</p>
                    </div>
                </div>
                
                <button className="w-full py-3 bg-transparent border-2 border-[#2D241E]/10 text-[#2D241E] rounded-[1.2rem] font-bold text-xs">
                    Try Weekly Plan
                </button>
            </div>

            {/* Features & Cuisines Preview */}
            {features.length > 0 && (
                <div className="mb-4">
                    <h5 className="text-xs font-black text-[#2D241E] uppercase tracking-widest mb-2 opacity-60">Features</h5>
                    <div className="flex flex-wrap gap-2">
                        {features.map((feature, i) => (
                            <span key={i} className="px-3 py-1.5 bg-white/50 text-[#2D241E] rounded-xl text-xs font-bold border border-white/60 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px] text-green-600">check_circle</span>
                                {feature}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {cuisines.length > 0 && (
                <div>
                    <h5 className="text-xs font-black text-[#2D241E] uppercase tracking-widest mb-2 opacity-60">Cuisines</h5>
                    <div className="flex flex-wrap gap-2">
                        {cuisines.map((cuisine, i) => (
                            <span key={i} className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-black border border-orange-100 uppercase tracking-wide">
                                {cuisine}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanPreview;
