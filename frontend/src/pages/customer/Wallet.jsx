import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Wallet = () => {
    const [showAddMoney, setShowAddMoney] = useState(false);
    const [amount, setAmount] = useState('');

    const transactions = [
        { id: 1, title: 'Money Added', date: 'Today, 10:23 AM', amount: 500, type: 'credit', status: 'Success' },
        { id: 2, title: 'Lunch: Paneer Thali', date: 'Yesterday, 1:15 PM', amount: 80, type: 'debit', status: 'Success' },
        { id: 3, title: 'Dinner: Veg Thali', date: 'Yesterday, 8:45 PM', amount: 80, type: 'debit', status: 'Success' },
        { id: 4, title: 'Refund: Skipped Meal', date: '22 Jan, 9:00 AM', amount: 80, type: 'credit', status: 'Success' },
        { id: 5, title: 'Subscription: Monthly', date: '20 Jan, 10:00 AM', amount: 3500, type: 'debit', status: 'Success' },
    ];

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out] px-4 md:px-8">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link to="/customer/dashboard" className="size-12 rounded-full bg-white flex items-center justify-center text-[#2D241E] shadow-sm hover:scale-110 transition-transform hover:shadow-md border border-gray-100">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-[#2D241E] tracking-tight">Smart Wallet</h1>
                    <p className="text-sm font-bold text-[#5C4D42] opacity-60">Manage your food funds</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Card & Actions (5 cols) */}
                <div className="lg:col-span-5 space-y-8">

                    {/* 3D Glass Card */}
                    <div className="relative h-64 rounded-[2.5rem] overflow-hidden shadow-2xl group perspective-1000 transition-transform hover:scale-[1.02] duration-500">
                        {/* Card Background - Dynamic Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#2D241E] via-[#1a1a1a] to-black"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px]"></div>

                        {/* Noise Texture */}
                        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                        {/* Card Content */}
                        <div className="relative z-10 p-8 h-full flex flex-col justify-between text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Current Balance</p>
                                    <h2 className="text-5xl font-black tracking-tighter">₹ 1,250</h2>
                                </div>
                                <div className="size-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                                    <span className="material-symbols-outlined text-2xl">contactless</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Account Holder</p>
                                    <p className="font-bold text-lg tracking-wide uppercase">Rohan Das</p>
                                </div>
                                <div className="text-right">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/2560px-UPI-Logo-vector.svg.png" className="h-4 brightness-0 invert opacity-60" alt="UPI" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Action Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setShowAddMoney(true)}
                            className="bg-primary text-white p-5 rounded-3xl shadow-xl shadow-orange-500/20 hover:bg-[#e05d00] transition-all hover:-translate-y-1 flex flex-col gap-3 group"
                        >
                            <div className="size-10 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">add</span>
                            </div>
                            <span className="font-bold">Add Money</span>
                        </button>

                        <button className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 flex flex-col gap-3 group">
                            <div className="size-10 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                                <span className="material-symbols-outlined text-[#2D241E]">qr_code_scanner</span>
                            </div>
                            <span className="font-bold text-[#2D241E]">Scan QR</span>
                        </button>
                    </div>

                    {/* Small Stats Graph (Mock) */}
                    <div className="glass-panel p-6 rounded-[2rem] border border-white/60">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-[#2D241E]">Spending Activity</h3>
                            <select className="bg-transparent text-xs font-bold text-gray-400 outline-none">
                                <option>This Week</option>
                            </select>
                        </div>
                        <div className="flex items-end justify-between h-24 gap-2">
                            {[40, 70, 30, 85, 50, 90, 60].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col justify-end gap-2 group">
                                    <div
                                        style={{ height: `${h}%` }}
                                        className={`w-full rounded-lg transition-all duration-500 ${i === 5 ? 'bg-primary shadow-lg shadow-orange-500/30' : 'bg-gray-100 group-hover:bg-gray-200'}`}
                                    ></div>
                                    <span className={`text-[10px] text-center font-bold ${i === 5 ? 'text-primary' : 'text-gray-300'}`}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Column: Transactions (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-xl font-black text-[#2D241E]">Recent Transactions</h3>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 rounded-full bg-[#2D241E] text-white text-xs font-bold">All</button>
                            <button className="px-4 py-2 rounded-full bg-white text-gray-400 text-xs font-bold hover:bg-gray-50">Debits</button>
                            <button className="px-4 py-2 rounded-full bg-white text-gray-400 text-xs font-bold hover:bg-gray-50">Credits</button>
                        </div>
                    </div>

                    <div className="glass-panel p-2 rounded-[2.5rem] border border-white/60 min-h-[500px]">
                        {transactions.map((tx, idx) => (
                            <div key={tx.id} className="group p-4 hover:bg-white rounded-[2rem] transition-all duration-300 flex items-center justify-between mb-1 last:mb-0 border border-transparent hover:border-gray-50 hover:shadow-sm">

                                <div className="flex items-center gap-5">
                                    <div className={`size-14 rounded-[1.2rem] flex items-center justify-center text-2xl transition-transform group-hover:scale-105 shadow-sm ${tx.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                        <span className="material-symbols-outlined">
                                            {tx.title.includes('Money') ? 'wallet' : tx.title.includes('Refund') ? 'verified' : 'lunch_dining'}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#2D241E] text-base mb-1">{tx.title}</h4>
                                        <p className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                                            {tx.date}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right pr-4">
                                    <p className={`text-lg font-black tracking-tight ${tx.type === 'credit' ? 'text-green-600' : 'text-[#2D241E]'}`}>
                                        {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount}
                                    </p>
                                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider bg-gray-50 px-2 py-0.5 rounded-md">{tx.status}</span>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Add Money Modal */}
            {showAddMoney && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#2D241E]/40 backdrop-blur-md animate-[fadeIn_0.2s]">
                    <div className="bg-[#FFFBF5] rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl animate-[scaleIn_0.3s] relative overflow-hidden">
                        {/* Modal Decor */}
                        <div className="absolute -top-20 -right-20 size-64 bg-orange-100 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <div>
                                <h3 className="text-2xl font-black text-[#2D241E] leading-none">Add Money</h3>
                                <p className="text-xs font-bold text-gray-400 mt-1">Via UPI or Card</p>
                            </div>
                            <button onClick={() => setShowAddMoney(false)} className="size-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm">
                                <span className="material-symbols-outlined text-[#2D241E]">close</span>
                            </button>
                        </div>

                        <div className="mb-10 relative z-10">
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-black text-gray-300">₹</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0"
                                    className="w-full bg-white rounded-[1.5rem] py-6 pl-14 pr-6 text-5xl font-black text-[#2D241E] placeholder:text-gray-200 outline-none shadow-sm focus:ring-4 focus:ring-primary/10 transition-all border border-gray-100"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-8 relative z-10">
                            {[100, 500, 1000].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => setAmount(val)}
                                    className="py-3 rounded-2xl border border-gray-200 bg-white text-sm font-bold text-[#5C4D42] hover:bg-orange-50 hover:border-orange-200 hover:text-primary transition-all shadow-sm"
                                >
                                    ₹{val}
                                </button>
                            ))}
                        </div>

                        <button onClick={() => { alert('Money Added Successfully (Demo)'); setShowAddMoney(false); }} className="w-full py-5 bg-[#2D241E] text-white rounded-[1.5rem] font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10 flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">lock</span> Secure Pay
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Wallet;
