import React from 'react';

const SavingsMeter = ({ amount }) => {
    return (
        <div className="p-3 px-4 rounded-[1.2rem] bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-emerald-200/50 relative overflow-hidden group">
            <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="material-symbols-outlined text-[14px]">savings</span>
                    <h4 className="text-[8px] font-black uppercase tracking-widest opacity-80">Savings</h4>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black leading-none">₹{amount}</span>
                    <span className="text-[8px] font-bold opacity-80 italic">Saved</span>
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-[-10px] right-[-10px] size-16 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-700"></div>
            <span className="material-symbols-outlined absolute bottom-[-5px] right-[-5px] text-5xl opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                energy_savings_leaf
            </span>
        </div>
    );
};

export default SavingsMeter;
