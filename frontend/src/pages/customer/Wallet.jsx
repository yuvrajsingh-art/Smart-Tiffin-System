import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

const Wallet = () => {
    // State
    const [balance, setBalance] = useState(1250);
    const [showAddMoney, setShowAddMoney] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [amount, setAmount] = useState('');
    const [filter, setFilter] = useState('All'); // 'All', 'Debits', 'Credits'

    const [transactions, setTransactions] = useState([
        { id: 1, title: 'Money Added', date: 'Today, 10:23 AM', amount: 500, type: 'credit', status: 'Success' },
        { id: 2, title: 'Lunch: Paneer Thali', date: 'Yesterday, 1:15 PM', amount: 80, type: 'debit', status: 'Success' },
        { id: 3, title: 'Dinner: Veg Thali', date: 'Yesterday, 8:45 PM', amount: 80, type: 'debit', status: 'Success' },
        { id: 4, title: 'Refund: Skipped Meal', date: '22 Jan, 9:00 AM', amount: 80, type: 'credit', status: 'Success' },
        { id: 5, title: 'Subscription: Monthly', date: '20 Jan, 10:00 AM', amount: 3500, type: 'debit', status: 'Success' },
    ]);

    // Handle Add Money
    const handleAddMoney = () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            alert("Please enter a valid amount!");
            return;
        }

        const newTx = {
            id: Date.now(),
            title: 'Money Added',
            date: 'Just Now',
            amount: Number(amount),
            type: 'credit',
            status: 'Success'
        };

        setBalance(prev => prev + Number(amount));
        setTransactions(prev => [newTx, ...prev]);
        setAmount('');
        setShowAddMoney(false);
        // Toast could go here
    };

    // Filter Logic
    const filteredTransactions = transactions.filter(tx => {
        if (filter === 'All') return true;
        if (filter === 'Debits') return tx.type === 'debit';
        if (filter === 'Credits') return tx.type === 'credit';
        return true;
    });

    return (
        <>
            <div className="max-w-7xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out] px-4 md:px-6 relative">

                {/* Background Blobs */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                    <div className="blob blob-1 blob-primary opacity-30 scale-75"></div>
                    <div className="blob blob-2 blob-secondary opacity-30 scale-75"></div>
                </div>

                {/* Header */}
                <div className="flex flex-col gap-1 mb-8 pt-4">
                    <Link to="/customer/dashboard" className="text-xs font-bold text-[#5C4D42] hover:text-primary flex items-center gap-1 w-fit transition-all">
                        <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-black text-[#2D241E]">Smart Wallet</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Left Column: Card & Actions (5 cols) */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* 3D Glass Card - Compact */}
                        <div className="relative h-56 rounded-[2rem] overflow-hidden shadow-xl group perspective-1000 transition-transform hover:scale-[1.01] duration-500">
                            {/* Card Background - Dynamic Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#2D241E] via-[#1a1a1a] to-black"></div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px]"></div>

                            {/* Noise Texture */}
                            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                            {/* Card Content */}
                            <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Current Balance</p>
                                        <h2 className="text-4xl font-black tracking-tighter">₹ {balance}</h2>
                                    </div>
                                    <div className="size-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                                        <span className="material-symbols-outlined text-xl">contactless</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">Account Holder</p>
                                        <p className="font-bold text-base tracking-wide uppercase">Rohan Das</p>
                                    </div>
                                    <div className="text-right">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/2560px-UPI-Logo-vector.svg.png" className="h-3 brightness-0 invert opacity-60" alt="UPI" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Action Grid - Matches Dashboard Action Styles */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setShowAddMoney(true)}
                                className="bg-primary text-white p-4 rounded-2xl shadow-lg shadow-orange-500/20 hover:bg-[#e05d00] transition-all hover:-translate-y-0.5 flex flex-col gap-2 group"
                            >
                                <div className="size-8 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-lg">add</span>
                                </div>
                                <span className="font-bold text-sm">Add Money</span>
                            </button>

                            <button
                                onClick={() => setShowScanner(true)}
                                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col gap-2 group"
                            >
                                <div className="size-8 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                                    <span className="material-symbols-outlined text-[#2D241E] text-lg">qr_code_scanner</span>
                                </div>
                                <span className="font-bold text-[#2D241E] text-sm">Scan QR</span>
                            </button>
                        </div>

                        {/* Small Stats Graph (Mock) - Compact */}
                        <div className="glass-panel p-5 rounded-[2rem] border border-white/60">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-[#2D241E] text-sm">Spending</h3>
                                <select className="bg-transparent text-[10px] font-bold text-gray-400 outline-none">
                                    <option>This Week</option>
                                </select>
                            </div>
                            <div className="flex items-end justify-between h-20 gap-2">
                                {[40, 70, 30, 85, 50, 90, 60].map((h, i) => (
                                    <div key={i} className="flex-1 flex flex-col justify-end gap-1 group">
                                        <div
                                            style={{ height: `${h}%` }}
                                            className={`w-full rounded-md transition-all duration-500 ${i === 5 ? 'bg-primary shadow-md shadow-orange-500/30' : 'bg-gray-100 group-hover:bg-gray-200'}`}
                                        ></div>
                                        <span className={`text-[9px] text-center font-bold ${i === 5 ? 'text-primary' : 'text-gray-300'}`}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Transactions (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="flex justify-between items-center px-1">
                            <h3 className="text-lg font-black text-[#2D241E]">Transactions</h3>
                            <div className="flex gap-2">
                                {['All', 'Debits', 'Credits'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${filter === f ? 'bg-[#2D241E] text-white' : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="glass-panel p-2 rounded-[2rem] border border-white/60 min-h-[400px]">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((tx) => (
                                    <div key={tx.id} className="group p-3 hover:bg-white rounded-[1.5rem] transition-all duration-300 flex items-center justify-between mb-1 last:mb-0 border border-transparent hover:border-gray-50 hover:shadow-sm">

                                        <div className="flex items-center gap-4">
                                            <div className={`size-10 rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-105 shadow-sm ${tx.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                                <span className="material-symbols-outlined text-[18px]">
                                                    {tx.title.includes('Money') ? 'wallet' : tx.title.includes('Refund') ? 'verified' : 'lunch_dining'}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#2D241E] text-xs mb-0.5">{tx.title}</h4>
                                                <p className="text-[10px] font-semibold text-gray-400 flex items-center gap-1">
                                                    {tx.date}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right pr-2">
                                            <p className={`text-sm font-black tracking-tight ${tx.type === 'credit' ? 'text-green-600' : 'text-[#2D241E]'}`}>
                                                {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount}
                                            </p>
                                            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider bg-gray-50 px-1.5 py-0.5 rounded-md">{tx.status}</span>
                                        </div>

                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                                    <span className="material-symbols-outlined text-3xl mb-2 opacity-50">receipt_long</span>
                                    <p className="font-bold text-xs">No transactions found</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>


            {/* Add Money Modal (Portland to Body) */}
            {
                showAddMoney && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        {/* Backdrop with heavy blur */}
                        <div
                            className="absolute inset-0 bg-[#2D241E]/60 backdrop-blur-xl animate-[fadeIn_0.3s]"
                            onClick={() => setShowAddMoney(false)}
                        ></div>

                        <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-6 shadow-2xl animate-[scaleIn_0.3s] relative overflow-hidden z-10 border border-white/20">
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-100 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

                            <div className="relative z-10">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-xl font-black text-[#2D241E] leading-none">Add Money</h3>
                                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">Secure Payment</p>
                                    </div>
                                    <button
                                        onClick={() => setShowAddMoney(false)}
                                        className="size-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors group"
                                    >
                                        <span className="material-symbols-outlined text-[#2D241E] text-lg group-hover:rotate-90 transition-transform duration-300">close</span>
                                    </button>
                                </div>

                                {/* Amount Input */}
                                <div className="mb-6">
                                    <label className="block text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Enter Amount</label>
                                    <div className="relative flex justify-center items-baseline gap-1">
                                        <span className="text-3xl font-black text-gray-300 transform translate-y-[-2px]">₹</span>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0"
                                            className="w-40 text-center bg-transparent text-6xl font-black text-[#2D241E] placeholder:text-gray-200 outline-none border-b-2 border-transparent focus:border-primary/20 transition-all pb-1 no-spinner"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {/* Quick Select Grid */}
                                <div className="grid grid-cols-3 gap-2 mb-6">
                                    {[100, 200, 500, 1000, 2000, 5000].map((val) => (
                                        <button
                                            key={val}
                                            onClick={() => setAmount(val)}
                                            className="py-2.5 px-3 rounded-xl border border-gray-100 bg-white shadow-sm text-xs font-bold text-[#5C4D42] hover:bg-[#2D241E] hover:text-white hover:border-[#2D241E] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                                        >
                                            ₹{val}
                                        </button>
                                    ))}
                                </div>

                                {/* Pay Button */}
                                <button
                                    onClick={handleAddMoney}
                                    className="w-full py-4 bg-[#2D241E] text-white rounded-[1.5rem] font-bold text-base shadow-xl shadow-gray-900/10 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                    <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">lock</span>
                                    <span className="relative z-10">Proceed to Pay</span>
                                </button>

                                <p className="text-center mt-4 text-[9px] font-bold text-gray-300 flex items-center justify-center gap-1">
                                    <span className="material-symbols-outlined text-[10px]">verified_user</span>
                                    SSL Secured • Instant Refund
                                </p>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }

            {/* QR Scanner Mock Modal (Portal to Body) */}
            {
                showScanner && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-[fadeIn_0.2s]">
                        <div className="w-full max-w-sm relative">
                            <button onClick={() => setShowScanner(false)} className="absolute -top-12 right-0 size-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 backdrop-blur-md z-50">
                                <span className="material-symbols-outlined">close</span>
                            </button>

                            <div className="aspect-[3/4] rounded-[2.5rem] bg-gray-900 border-2 border-white/20 relative overflow-hidden shadow-2xl">
                                {/* Scanning Animation */}
                                <div className="absolute inset-0 z-10">
                                    <div className="w-full h-1 bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                                </div>

                                {/* Camera Mock */}
                                <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 grayscale" alt="Camera Feed" />

                                {/* Overlay Frame */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="size-64 border-2 border-white/50 rounded-3xl relative">
                                        <div className="absolute top-0 left-0 size-8 border-t-4 border-l-4 border-green-500 -translate-x-1 -translate-y-1 rounded-tl-xl"></div>
                                        <div className="absolute top-0 right-0 size-8 border-t-4 border-r-4 border-green-500 translate-x-1 -translate-y-1 rounded-tr-xl"></div>
                                        <div className="absolute bottom-0 left-0 size-8 border-b-4 border-l-4 border-green-500 -translate-x-1 translate-y-1 rounded-bl-xl"></div>
                                        <div className="absolute bottom-0 right-0 size-8 border-b-4 border-r-4 border-green-500 translate-x-1 translate-y-1 rounded-br-xl"></div>
                                    </div>
                                </div>

                                <div className="absolute bottom-8 left-0 right-0 text-center">
                                    <p className="text-white font-bold text-sm bg-black/50 inline-block px-4 py-2 rounded-full backdrop-blur-md">Scanning Q-Code...</p>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }
        </>
    );
};

export default Wallet;
