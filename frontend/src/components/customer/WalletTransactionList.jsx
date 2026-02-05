import React from 'react';
import { Link } from 'react-router-dom';

const WalletTransactionList = ({ transactions }) => {
    return (
        <div className="glass-panel p-6 rounded-[2rem] border border-white/60 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-[#2D241E]">Recent Transactions</h3>
                <Link to="/customer/history" className="size-10 rounded-full hover:bg-gray-50 flex items-center justify-center transition-all hover:rotate-45">
                    <span className="material-symbols-outlined text-[#2D241E]">history</span>
                </Link>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {transactions.length === 0 ? (
                    <div className="py-10 text-center opacity-30">
                        <span className="material-symbols-outlined text-4xl mb-2">payments</span>
                        <p className="text-xs font-bold uppercase tracking-widest">No transactions yet</p>
                    </div>
                ) : (
                    transactions.map((tx, idx) => (
                        <div
                            key={tx.id || idx}
                            className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/50 transition-all border border-transparent hover:border-white/60 group animate-[slideUp_0.3s_ease-out]"
                            style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`size-12 rounded-xl flex items-center justify-center shadow-sm ${tx.type === 'credit'
                                    ? 'bg-green-50 text-green-600'
                                    : 'bg-orange-50 text-primary'
                                    } group-hover:scale-110 transition-transform`}>
                                    <span className="material-symbols-outlined">
                                        {tx.type === 'credit' ? 'add' : 'remove'}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#2D241E] text-sm">{tx.title}</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{tx.source}</p>
                                    <p className="text-[9px] font-medium text-gray-300">{tx.date}</p>
                                </div>
                            </div>
                            <span className={`font-black text-sm ${tx.type === 'credit' ? 'text-green-600' : 'text-[#2D241E]'}`}>
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
