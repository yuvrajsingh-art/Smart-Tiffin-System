import React from 'react';

const GuestMealStickyBar = ({ totalGuests, totalCost, onCheckout }) => {
    if (totalGuests <= 0) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[9000] max-w-7xl mx-auto animate-[slideInUp_0.3s]">
            <div className="bg-[#2D241E] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="size-10 bg-white/10 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined">group_add</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">Guest Meals: {totalGuests}</h4>
                        <p className="text-xs text-white/60">Total: ₹{totalCost}</p>
                    </div>
                </div>
                <button
                    onClick={onCheckout}
                    className="bg-white text-[#2D241E] px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2"
                >
                    Pay ₹{totalCost}
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
            </div>
        </div>
    );
};

export default GuestMealStickyBar;
