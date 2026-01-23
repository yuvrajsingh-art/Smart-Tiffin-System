import React from 'react';
import Button from '../../components/ui/Button';

const Wallet = () => {
    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            <h2 className="text-2xl font-bold text-gray-900">My Wallet 💳</h2>

            {/* Balance Card */}
            <div className="glass-panel p-8 rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <span className="material-symbols-outlined text-9xl">account_balance_wallet</span>
                </div>

                <div className="relative z-10">
                    <p className="text-gray-400 text-sm font-medium mb-1">Total Balance</p>
                    <h3 className="text-4xl font-bold mb-6">₹ 1,250.00</h3>

                    <div className="flex gap-4">
                        <Button className="!bg-white !text-gray-900 hover:!bg-gray-100 border-none">
                            <span className="material-symbols-outlined text-sm mr-2">add</span>
                            Add Money
                        </Button>
                        <Button variant="outline" className="!text-white !border-white/30 hover:!bg-white/10">
                            History
                        </Button>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Transactions</h3>
                <div className="glass-panel p-0 rounded-2xl overflow-hidden">
                    {[
                        { title: 'Added Money', date: 'Today, 10:00 AM', amount: '+ ₹500', type: 'credit' },
                        { title: 'Lunch Deduction', date: 'Yesterday, 01:30 PM', amount: '- ₹80', type: 'debit' },
                        { title: 'Dinner Deduction', date: 'Yesterday, 08:30 PM', amount: '- ₹80', type: 'debit' },
                        { title: 'Refund (Paused)', date: '20 Jan, 09:00 AM', amount: '+ ₹80', type: 'credit' },
                    ].map((tx, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    <span className="material-symbols-outlined text-xl">
                                        {tx.type === 'credit' ? 'arrow_downward' : 'arrow_upward'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{tx.title}</p>
                                    <p className="text-xs text-gray-500">{tx.date}</p>
                                </div>
                            </div>
                            <p className={`text-sm font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>
                                {tx.amount}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wallet;
