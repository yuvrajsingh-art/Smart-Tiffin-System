import React from 'react';

const WalletBalanceCard = ({ balance, amountToAdd, setAmountToAdd, onAddMoney, quickAmounts }) => {
    return (
        <div className="p-6 rounded-[2rem] bg-[#2D241E] text-white relative overflow-hidden shadow-2xl animate-[scaleIn_0.3s_ease-out]">
            <div className="absolute top-0 right-0 p-6 opacity-10">
                <span className="material-symbols-outlined text-8xl">account_balance_wallet</span>
            </div>

            <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-2">Total Balance</p>
            <h2 className="text-4xl font-bold mb-6">₹{balance.toLocaleString()}</h2>

            <div className="space-y-4 relative z-10">
                <div className="flex gap-2 items-center">
                    <span className="text-2xl font-bold opacity-80">₹</span>
                    <input
                        type="number"
                        value={amountToAdd}
                        onChange={(e) => setAmountToAdd(e.target.value)}
                        placeholder="0"
                        className="bg-transparent border-b-2 border-white/20 text-3xl font-bold w-full outline-none focus:border-white transition-colors placeholder:text-white/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                </div>

                <div className="flex gap-2 flex-wrap">
                    {quickAmounts.map(amt => (
                        <button
                            key={amt}
                            onClick={() => setAmountToAdd(amt.toString())}
                            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[10px] font-bold border border-white/10 transition-all hover:scale-105 active:scale-95"
                        >
                            +₹{amt}
                        </button>
                    ))}
                </div>

                <button
                    onClick={onAddMoney}
                    disabled={!amountToAdd || parseInt(amountToAdd) <= 0}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-lg mt-4 hover:bg-orange-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:bg-gray-700 flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined">add_circle</span>
                    Add Money to Wallet
                </button>
            </div>
        </div>
    );
};

export default WalletBalanceCard;
