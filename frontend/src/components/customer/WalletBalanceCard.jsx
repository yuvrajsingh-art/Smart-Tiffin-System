import React from 'react';

const WalletBalanceCard = ({ balance, amountToAdd, setAmountToAdd, onAddMoney, quickAmounts }) => {
    return (
        <div className="p-4 rounded-[1.5rem] bg-[#2D241E] text-white relative overflow-hidden shadow-xl animate-[scaleIn_0.3s_ease-out]">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-5xl">account_balance_wallet</span>
            </div>

            <p className="text-[10px] font-black opacity-50 uppercase tracking-[0.15em] mb-1">Total Balance</p>
            <h2 className="text-2xl font-black mb-4">₹{balance.toLocaleString()}</h2>

            <div className="space-y-3 relative z-10">
                <div className="flex gap-1.5 items-center">
                    <span className="text-lg font-bold opacity-60">₹</span>
                    <input
                        type="number"
                        value={amountToAdd}
                        onChange={(e) => setAmountToAdd(e.target.value)}
                        placeholder="0"
                        className="bg-transparent border-b border-white/10 text-xl font-black w-full outline-none focus:border-white transition-colors placeholder:text-white/5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>

                <div className="flex gap-1.5 flex-wrap">
                    {quickAmounts.map(amt => (
                        <button
                            key={amt}
                            onClick={() => setAmountToAdd(amt.toString())}
                            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[9px] font-black border border-white/5 transition-all active:scale-95"
                        >
                            +₹{amt}
                        </button>
                    ))}
                </div>

                <button
                    onClick={onAddMoney}
                    disabled={!amountToAdd || parseInt(amountToAdd) <= 0}
                    className="w-full py-2.5 bg-primary text-white rounded-xl font-black text-xs shadow-lg mt-2 hover:bg-orange-600 active:scale-[0.98] transition-all disabled:opacity-30 disabled:scale-100 disabled:bg-gray-800 flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">add_circle</span>
                    Add Money
                </button>
            </div>
        </div>
    );
};

export default WalletBalanceCard;
