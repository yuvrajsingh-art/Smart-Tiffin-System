import React from 'react';

const PlanInfoCards = ({ selectedDaysCount, onUpgrade, onCancel, onSave, expiryDate, loading }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* 1. Plan Details Card */}
            <div className="relative overflow-hidden rounded-2xl p-4 shadow-lg group flex flex-col justify-between min-h-[140px]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2D241E] to-[#1a1a1a]"></div>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <span className="material-symbols-outlined text-6xl text-white">verified</span>
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div className="size-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-base border border-white/10">
                                🍱
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">Active</span>
                        </div>
                        <h3 className="text-white font-black text-lg leading-tight">Standard Veg</h3>
                        <p className="text-white/60 text-xs font-medium">Expires: {expiryDate || '31 Jan'}</p>
                    </div>

                    <button onClick={onUpgrade} className="mt-2 w-full py-2 bg-white text-[#2D241E] rounded-xl font-bold text-xs shadow-sm hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                        <span className="material-symbols-outlined text-sm">upgrade</span>
                        Upgrade
                    </button>
                </div>
            </div>

            {/* 2. Summary Stats */}
            <div className="glass-panel p-4 rounded-2xl border border-white/60 flex flex-col justify-between min-h-[140px]">
                <div>
                    <h3 className="font-bold text-[#2D241E] mb-2 text-xs uppercase tracking-wide">Summary</h3>
                    <div className="bg-white/50 rounded-xl p-3 mb-2 border border-white/50 space-y-1">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Paused</span>
                            <span className="font-black text-base text-[#2D241E]">{selectedDaysCount} Days</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Refund</span>
                            <span className="font-black text-base text-green-600">₹{selectedDaysCount * 80}</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={onSave}
                    disabled={loading}
                    className="w-full py-2 bg-[#2D241E] text-white rounded-xl font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all text-xs disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Saving...
                        </>
                    ) : (
                        'Save Changes'
                    )}
                </button>
            </div>

            {/* 3. Danger Zone */}
            <div className="glass-panel p-4 rounded-2xl border border-red-100/50 relative overflow-hidden group hover:bg-red-50/30 transition-colors flex flex-col justify-between min-h-[140px]">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="size-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-sm">warning</span>
                        </div>
                        <h3 className="font-bold text-[#2D241E] text-xs uppercase tracking-wide">Danger Zone</h3>
                    </div>
                    <p className="text-[10px] text-[#5C4D42] leading-relaxed opacity-80 mb-2">
                        Cancelling stops deliveries immediately. Refund in 5-7 days.
                    </p>
                </div>
                <button
                    onClick={onCancel}
                    className="w-full py-2 rounded-xl border border-red-200 text-red-500 font-bold text-xs hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                >
                    Cancel Plan
                </button>
            </div>

        </div>
    );
};

export default PlanInfoCards;
