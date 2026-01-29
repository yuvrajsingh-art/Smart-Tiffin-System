import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PaymentModal from '../../components/common/PaymentModal';
import BackgroundBlobs from '../../components/common/BackgroundBlobs';
import PageHeader from '../../components/common/PageHeader';

const Wallet = () => {
    const [balance, setBalance] = useState(2450);
    const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
    const [amountToAdd, setAmountToAdd] = useState('');

    const handleAddMoneySuccess = (details) => {
        setBalance(prev => prev + parseFloat(details.totalAmount));
        setShowAddMoneyModal(false);
        setAmountToAdd('');
    };

    const quickAmounts = [100, 500, 1000, 2000];

    const transactions = [
        { id: 1, title: 'Money Added', date: 'Today, 10:23 AM', amount: '+₹500.00', type: 'credit' },
        { id: 2, title: 'Lunch Order #ORD-2891', date: 'Yesterday, 1:15 PM', amount: '-₹120.00', type: 'debit' },
        { id: 3, title: 'Subscription Renewal', date: '24 Jan, 9:00 AM', amount: '-₹2000.00', type: 'debit' },
        { id: 4, title: 'Cashback Received', date: '20 Jan, 6:30 PM', amount: '+₹50.00', type: 'credit' }
    ];

    return (
        <div className="w-full pb-20 animate-[fadeIn_0.5s_ease-out] relative">
            {/* Background Blobs */}
            <BackgroundBlobs />

            {/* Header */}
            <PageHeader title="My Wallet" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Balance Card */}
                <div className="space-y-6">
                    <div className="p-6 rounded-[2rem] bg-[#2D241E] text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <span className="material-symbols-outlined text-8xl">account_balance_wallet</span>
                        </div>

                        <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-2">Total Balance</p>
                        <h2 className="text-4xl font-bold mb-6">₹{balance.toLocaleString()}</h2>

                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <span className="text-2xl font-bold opacity-80">₹</span>
                                <input
                                    type="number"
                                    value={amountToAdd}
                                    onChange={(e) => setAmountToAdd(e.target.value)}
                                    placeholder="Enter Amount"
                                    className="bg-transparent border-b-2 border-white/20 text-2xl font-bold w-full outline-none focus:border-white transition-colors placeholder:text-white/20"
                                />
                            </div>

                            <div className="flex gap-2 flex-wrap">
                                {quickAmounts.map(amt => (
                                    <button
                                        key={amt}
                                        onClick={() => setAmountToAdd(amt.toString())}
                                        className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold border border-white/10 transition-colors"
                                    >
                                        +₹{amt}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowAddMoneyModal(true)}
                                disabled={!amountToAdd || parseInt(amountToAdd) <= 0}
                                className="w-full py-3.5 bg-white text-[#2D241E] rounded-xl font-bold shadow-lg mt-4 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                            >
                                Add Money to Wallet
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="glass-panel p-6 rounded-[2rem] border border-white/60">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[#2D241E]">Recent Transactions</h3>
                        <Link to="/customer/history" className="size-10 rounded-full hover:bg-gray-50 flex items-center justify-center transition-colors">
                            <span className="material-symbols-outlined text-[#2D241E]">arrow_forward</span>
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {transactions.map(tx => (
                            <div key={tx.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/50 transition-colors border border-transparent hover:border-white/60">
                                <div className="flex items-center gap-4">
                                    <div className={`size-12 rounded-xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-[#2D241E]'}`}>
                                        <span className="material-symbols-outlined">
                                            {tx.type === 'credit' ? 'arrow_downward' : 'arrow_upward'}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#2D241E]">{tx.title}</h4>
                                        <p className="text-xs font-medium text-gray-400">{tx.date}</p>
                                    </div>
                                </div>
                                <span className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-[#2D241E]'}`}>
                                    {tx.amount}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <PaymentModal
                isOpen={showAddMoneyModal}
                onClose={() => setShowAddMoneyModal(false)}
                amount={parseInt(amountToAdd) || 0}
                onSuccess={handleAddMoneySuccess}
                title="Add Money to Wallet"
            />
        </div>
    );
};

export default Wallet;
