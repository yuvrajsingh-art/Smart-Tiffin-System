import React from 'react';

const CheckoutSummary = ({ planName, config, addons, priceBreakdown }) => {
    return (
        <div className="md:w-[280px] shrink-0 sticky top-20 animate-[slideIn_0.5s_ease-out]">
            <div className="bg-[#1a1a1a]/95 backdrop-blur-xl p-5 rounded-[2rem] shadow-xl text-white border border-white/10 ring-1 ring-black/5">
                <div className="flex items-center gap-3 mb-6">
                    <div className="size-8 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-sm">receipt_long</span>
                    </div>
                    <div>
                        <h2 className="font-bold text-sm leading-none">Order Summary</h2>
                        <p className="text-[10px] text-white/40 font-medium mt-0.5">Smart Tiffin</p>
                    </div>
                </div>

                {/* Plan Card */}
                <div className="bg-white/5 rounded-xl p-3 mb-4 relative overflow-hidden group hover:bg-white/10 transition-colors">
                    <div className="absolute top-0 right-0 p-2 opacity-5">
                        <span className="material-symbols-outlined text-4xl">lunch_dining</span>
                    </div>
                    <p className="text-orange-400 text-[8px] font-black uppercase tracking-widest mb-1">Selected Plan</p>
                    <h3 className="text-base font-black mb-0.5">{planName}</h3>
                    <p className="text-xs text-white/60 font-medium mb-0 capitalize">
                        {config.mealType === 'both' ? 'Lunch + Dinner' : config.mealType}
                    </p>
                </div>

                {/* Breakdown */}
                <div className="space-y-2 mb-6 border-t border-white/10 pt-4">
                    <div className="flex justify-between text-xs items-center">
                        <span className="text-white/60 font-medium">Base Price</span>
                        <span className="font-bold">₹{priceBreakdown.basePrice}</span>
                    </div>
                    {addons.extraRoti > 0 && (
                        <div className="flex justify-between text-xs items-center text-orange-200">
                            <span>+ {addons.extraRoti} Extra Roti</span>
                            <span className="font-bold">₹{addons.extraRoti * 150}</span>
                        </div>
                    )}
                    {addons.extraRice > 0 && (
                        <div className="flex justify-between text-xs items-center text-orange-200">
                            <span>+ {addons.extraRice} Extra Rice</span>
                            <span className="font-bold">₹{addons.extraRice * 200}</span>
                        </div>
                    )}
                    {addons.curd && (
                        <div className="flex justify-between text-xs items-center text-blue-200">
                            <span>+ Curd Bowl</span>
                            <span className="font-bold">₹300</span>
                        </div>
                    )}
                </div>

                <div className="h-px bg-white/10 mb-5"></div>

                <div className="flex justify-between items-end mb-6">
                    <div>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-0.5">Total</p>
                    </div>
                    <span className="text-2xl font-black tracking-tight">₹{priceBreakdown.grandTotal}</span>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSummary;
