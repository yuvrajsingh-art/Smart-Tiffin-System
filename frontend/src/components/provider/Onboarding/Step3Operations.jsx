import React from 'react';

const Step3Operations = ({ formData, setFormData, onNext, onPrev }) => {
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="text-center mb-8">
                <h2 className="text-xl font-black text-[#2D241E]">Operations Setup</h2>
                <p className="text-sm text-[#2D241E]/60 font-medium text-pretty mt-1">Configure how you will serve your customers on a daily basis.</p>
            </div>

            <div className="space-y-4">
                {/* Physical Address */}
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-3 text-[#2D241E]/40 text-[18px]">location_on</span>
                    <textarea
                        className="w-full bg-white/50 border border-white/60 rounded-xl pl-10 pr-4 py-3 h-24 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white placeholder:text-gray-400/80 transition-all resize-none"
                        placeholder="Complete Mess Address (Street, Building, Area)"
                        name="address"
                        value={formData.address || ""}
                        onChange={handleChange}
                    />
                </div>

                {/* Delivery Radius */}
                <div className="pt-2 px-2">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-black text-[#2D241E]/50 uppercase tracking-widest block">Delivery Radius (km)</label>
                        <span className="text-sm font-black text-primary">{formData.deliveryRadius || 5} KM</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="20"
                        name="deliveryRadius"
                        value={formData.deliveryRadius || 5}
                        onChange={handleChange}
                        className="w-full h-2 bg-white/60 rounded-lg appearance-none cursor-pointer accent-primary border border-white/40"
                    />
                </div>

                {/* Order Cutoff Time */}
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-3 text-[#2D241E]/40 text-[18px]">schedule</span>
                    <div className="pl-10">
                        <label className="text-[10px] font-black text-[#2D241E]/50 uppercase tracking-widest block mb-1">Morning Order Cutoff Time</label>
                        <input
                            type="time"
                            className="w-full bg-white/50 border border-white/60 rounded-xl px-4 h-12 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                            name="orderCutoffTime"
                            value={formData.orderCutoffTime || "09:00"}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-3 mt-6">
                <button
                    onClick={onPrev}
                    className="flex-1 bg-white border border-gray-200 text-[#2D241E] font-bold h-12 rounded-xl hover:bg-gray-50 transition-all active:scale-[0.98] text-sm flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back
                </button>
                <button
                    onClick={onNext}
                    disabled={!formData.address}
                    className="flex-[2] bg-[#111716] hover:bg-black text-white font-bold h-12 rounded-xl shadow-lg shadow-black/10 transition-all hover:scale-[1.01] active:scale-[0.98] text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Save & Next <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
            </div>
        </div>
    );
};

export default Step3Operations;
