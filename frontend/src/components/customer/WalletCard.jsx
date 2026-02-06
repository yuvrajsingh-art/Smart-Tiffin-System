import React from 'react';
import { Link } from 'react-router-dom';

const WalletCard = ({ balance, recentAddition }) => {
    return (
        <div className="p-6 rounded-[2rem] bg-[#2D241E] text-white relative overflow-hidden shadow-xl group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-7xl">account_balance_wallet</span>
            </div>

            <div className="relative z-10">
                <h3 className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">Wallet Balance</h3>
                <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-bold">₹{balance?.toLocaleString() || "0"}</span>
                    {recentAddition > 0 && (
                        <span className="text-[10px] font-bold text-green-400">+₹{recentAddition} added</span>
                    )}
                </div>

                <Link to="/customer/wallet" className="flex items-center justify-between bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-all border border-white/5">
                    <span className="text-xs font-bold flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">add_card</span>
                        Add Money
                    </span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
            </div>
        </div>
    );
};

export default WalletCard;
