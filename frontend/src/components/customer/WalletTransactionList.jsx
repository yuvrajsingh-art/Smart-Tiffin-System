import React from 'react';
import { Link } from 'react-router-dom';

const WalletTransactionList = ({ transactions }) => {
    return (
        <div className="glass-panel p-4 rounded-[1.5rem] border border-white/60 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-[#2D241E] uppercase tracking-wider">Recent Activity</h3>
                <Link to="/customer/history" className="size-8 rounded-full hover:bg-gray-50 flex items-center justify-center transition-all hover:rotate-45 border border-gray-100">
                    <span className="material-symbols-outlined text-[18px] text-[#2D241E]">history</span>
                </Link>
            </div>

            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1 select-none scrollbar-hide">
                {transactions.length === 0 ? (
                    <div className="py-6 text-center opacity-20">
                        <span className="material-symbols-outlined text-2xl mb-1">payments</span>
                        <p className="text-[9px] font-black uppercase tracking-widest">No activity</p>
                    </div>
                ) : (
                    transactions.map((tx, idx) => (
                        <div
                            key={tx.id || idx}
                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/80 transition-all border border-transparent hover:border-gray-100 group animate-[slideUp_0.3s_ease-out]"
                            style={{ animationDelay: `${idx * 0.03}s` }}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`size-8 rounded-lg flex items-center justify-center shadow-sm ${tx.type === 'credit'
                                    ? 'bg-green-50 text-green-600'
                                    : 'bg-orange-50 text-primary'
                                    } group-hover:scale-105 transition-transform`}>
                                    <span className="material-symbols-outlined text-[18px]">
                                        {tx.type === 'credit' ? 'add' : 'remove'}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="font-black text-[#2D241E] text-[11px] leading-tight">{tx.title}</h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter opacity-80">{tx.source}</p>
                                        <span className="size-1 bg-gray-200 rounded-full"></span>
                                        <p className="text-[8px] font-medium text-gray-300">{tx.date}</p>
                                    </div>
                                </div>
                            </div>
                            <span className={`font-black text-xs ${tx.type === 'credit' ? 'text-green-600' : 'text-[#2D241E]'}`}>
                                {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default WalletTransactionList;
