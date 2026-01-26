import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';

const payoutsData = [
    { id: 'PAY001', kitchen: 'Annapurna Rasoi', amount: '₹42,500', frequency: 'Weekly', status: 'Paid', date: '25 Jan 2024' },
    { id: 'PAY002', kitchen: 'Spice Route', amount: '₹28,200', frequency: 'Monthly', status: 'Pending', date: '01 Feb 2024' },
    { id: 'PAY003', kitchen: 'Home Taste', amount: '₹12,800', frequency: 'Weekly', status: 'Paid', date: '24 Jan 2024' },
];

const duesData = [
    { id: 'CUS441', user: 'Rahul Sharma', amount: '₹2,499', type: 'Subscription', dueDate: 'Today' },
    { id: 'CUS212', user: 'Priya Verma', amount: '₹899', type: 'Add-on', dueDate: 'Tomorrow' },
];

const AdminFinance = () => {
    const [showSettlement, setShowSettlement] = useState(false);
    const [selectedKitchen, setSelectedKitchen] = useState(null);
    const [modalTab, setModalTab] = useState('Settlement');

    const openSettlemnt = (kitchen) => {
        setSelectedKitchen(kitchen);
        setShowSettlement(true);
    };

    const handleConfirmPayout = () => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 2000)),
            {
                loading: 'Authenticating bank gateway...',
                success: 'Payout authorized successfully!',
                error: 'Transfer failed.',
            }
        );
        setShowSettlement(false);
    };

    const handleAction = (type, label) => {
        toast.success(`${type}: ${label}`, {
            style: { borderRadius: '12px', background: '#2D241E', color: '#fff', fontSize: '10px' }
        });
    };

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto min-h-full pb-8 animate-[fadeIn_0.5s]">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black text-[#2D241E] tracking-tight flex items-center gap-2">
                        Finance & Cashflow
                        <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded-lg uppercase tracking-wider">Ledger</span>
                    </h2>
                    <p className="text-[#5C4D42] text-xs font-medium opacity-80 mt-0.5 italic">Managing payouts, commission, and user billing.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black text-[#2D241E] hover:border-emerald-500 transition-all">Download Audit</button>
                    <button
                        onClick={() => handleAction('Process', 'Bulk Payouts')}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#2D241E] text-white rounded-2xl text-[11px] font-black hover:bg-[#453831] shadow-xl shadow-[#2D241E]/10 transition-all uppercase tracking-widest"
                    >
                        Process Payouts
                    </button>
                </div>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-[#2D241E] to-[#453831] p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 size-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Total Liquidity</p>
                    <h3 className="text-4xl font-black tracking-tighter">₹8.42L</h3>
                    <div className="mt-4 flex items-center gap-2 text-emerald-400">
                        <span className="material-symbols-outlined text-[16px]">trending_up</span>
                        <span className="text-[11px] font-bold">+18.5% revenue growth</span>
                    </div>
                </div>

                <div className="bg-white/70 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/60 shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-black text-[#5C4D42]/60 uppercase tracking-[0.2em]">Kitchen Payouts</p>
                        <span className="material-symbols-outlined text-amber-500">account_balance</span>
                    </div>
                    <h3 className="text-3xl font-black text-[#2D241E]">₹3.15L</h3>
                    <p className="text-[11px] font-bold text-[#897a70] mt-1">Next Settlement: 01 Feb</p>
                    <div className="w-full h-1 bg-gray-100 rounded-full mt-4 overflow-hidden">
                        <div className="h-full bg-[#2D241E] w-[65%]"></div>
                    </div>
                </div>

                <div className="bg-white/70 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/60 shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                        <p className="text-[10px] font-black text-[#5C4D42]/60 uppercase tracking-[0.2em]">Tax & Platform Fee</p>
                        <span className="material-symbols-outlined text-blue-500">receipt_long</span>
                    </div>
                    <h3 className="text-3xl font-black text-[#2D241E]">₹84,200</h3>
                    <p className="text-[11px] font-bold text-blue-600 mt-1">Estimated GST: ₹12.5k</p>
                </div>
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Kitchen Payouts (Left) */}
                <div className="lg:col-span-8 bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/60 shadow-lg overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-base font-black text-[#2D241E]">Kitchen Settlement Ledger</h3>
                        <button className="text-[10px] font-bold text-[#5C4D42] hover:underline">View Historical Data</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="pb-4 text-[10px] font-black text-[#897a70] uppercase pl-2 tracking-widest">Kitchen Partner</th>
                                    <th className="pb-4 text-[10px] font-black text-[#897a70] uppercase tracking-widest">Amount</th>
                                    <th className="pb-4 text-[10px] font-black text-[#897a70] uppercase tracking-widest">Frequency</th>
                                    <th className="pb-4 text-[10px] font-black text-[#897a70] uppercase tracking-widest">Status</th>
                                    <th className="pb-4 text-[10px] font-black text-[#897a70] uppercase text-right pr-2">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {payoutsData.map((p) => (
                                    <tr key={p.id} className="group hover:bg-white/50 transition-colors">
                                        <td className="py-4 pl-2">
                                            <p className="text-xs font-bold text-[#2D241E]">{p.kitchen}</p>
                                            <p className="text-[9px] text-[#897a70]">{p.date}</p>
                                        </td>
                                        <td className="py-4 text-xs font-black text-[#2D241E]">{p.amount}</td>
                                        <td className="py-4 text-[10px] font-bold text-[#5C4D42]">{p.frequency}</td>
                                        <td className="py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${p.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="py-4 pr-2 text-right">
                                            <button
                                                onClick={() => openSettlemnt(p)}
                                                className="size-8 rounded-lg bg-gray-50 text-[#5C4D42] flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all ml-auto shadow-sm"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">payments</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pending Collections (Right) */}
                <div className="lg:col-span-4 bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/60 shadow-lg flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-base font-black text-[#2D241E]">Pending Collection</h3>
                        <span className="size-5 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-[10px] font-bold">2</span>
                    </div>
                    <div className="space-y-4 flex-1">
                        {duesData.map((due) => (
                            <div key={due.id} className="p-4 rounded-3xl bg-white border border-gray-100 group hover:border-[#2D241E]/10 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-xs font-bold text-[#2D241E]">{due.user}</p>
                                        <p className="text-[9px] text-[#897a70]">#{due.id} • {due.type}</p>
                                    </div>
                                    <span className="text-xs font-black text-rose-500">{due.amount}</span>
                                </div>
                                <div className="flex items-center justify-between mt-4 uppercase tracking-widest font-black text-[9px]">
                                    <span className="text-rose-600 italic">DUE {due.dueDate}</span>
                                    <button
                                        onClick={() => handleAction('Reminder', due.user)}
                                        className="text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        Send Reminder
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 bg-[#2D241E] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#453831] shadow-lg shadow-[#2D241E]/10 transition-all">
                        Process All Dues
                    </button>
                </div>

            </div>

            {/* Quick Financial Shortcuts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Refunds', icon: 'keyboard_return' },
                    { label: 'Coupons', icon: 'sell' },
                    { label: 'Tax Settings', icon: 'gavel' },
                    { label: 'Integrations', icon: 'account_tree' },
                ].map((s, i) => (
                    <button key={i} className="bg-white/50 border border-white p-4 rounded-3xl flex items-center gap-3 hover:bg-white hover:shadow-md transition-all text-[#2D241E] group">
                        <span className="material-symbols-outlined text-[20px] text-[#897a70] group-hover:text-orange-500 transition-colors">{s.icon}</span>
                        <span className="text-[11px] font-bold">{s.label}</span>
                    </button>
                ))}
            </div>

            {/* Financial DNA Settlement Modal - [NEW FUSION] */}
            {showSettlement && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2D241E]/80 backdrop-blur-md animate-[fadeIn_0.3s]" onClick={() => setShowSettlement(false)}></div>
                    <div className="bg-white rounded-[3rem] w-full max-w-3xl overflow-hidden shadow-2xl animate-[scaleIn_0.3s] relative z-10 border border-black/5 flex flex-col max-h-[92vh]">

                        {/* Modal Header [DNA STYLE] */}
                        <div className="p-8 pb-4 flex justify-between items-start shrink-0">
                            <div>
                                <h3 className="text-2xl font-black text-[#2D241E]">Financial DNA</h3>
                                <p className="text-[11px] font-bold text-[#897a70] mt-1">Settlement authorization & commission intelligence</p>
                            </div>
                            <button onClick={() => setShowSettlement(false)} className="size-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all">
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        </div>

                        {/* Tab Navigation */}
                        <div className="px-8 mb-4 shrink-0 overflow-x-auto no-scrollbar">
                            <div className="flex gap-1 bg-gray-50 p-1.5 rounded-[1.5rem] border border-black/5 w-fit">
                                {[
                                    { id: 'Settlement', label: 'Settlement', icon: 'account_balance_wallet' },
                                    { id: 'Analytics', label: 'Analytics', icon: 'monitoring' },
                                    { id: 'Ledger', label: 'Ledger Hub', icon: 'list_alt' },
                                    { id: 'Banking', label: 'Banking', icon: 'account_balance' },
                                    { id: 'Audit', label: 'Audit Trail', icon: 'verified_user' },
                                ].map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setModalTab(t.id)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-tight transition-all whitespace-nowrap ${modalTab === t.id ? 'bg-[#2D241E] text-white shadow-lg' : 'text-[#897a70] hover:bg-white hover:text-[#2D241E]'}`}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-4 space-y-8">

                            {/* Entity Info Card */}
                            <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-[2.5rem] flex items-center gap-6 shadow-sm">
                                <div className="relative">
                                    <div className="size-20 rounded-2xl bg-[#2D241E] flex flex-col items-center justify-center text-white shadow-lg border-2 border-white">
                                        <span className="text-[10px] font-black opacity-40 uppercase">Partner</span>
                                        <span className="material-symbols-outlined text-3xl text-emerald-400">storefront</span>
                                    </div>
                                    <div className="absolute -bottom-2 -left-2 bg-emerald-500 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase border-2 border-white shadow-sm">Active</div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xl font-black text-[#2D241E] tracking-tight">{selectedKitchen?.kitchen}</h4>
                                        <span className="text-2xl font-black text-emerald-600 italic leading-none">{selectedKitchen?.amount}</span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#897a70]">
                                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                            Cycle: {selectedKitchen?.date}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#897a70]">
                                            <span className="material-symbols-outlined text-[14px]">sync</span>
                                            {selectedKitchen?.frequency} Payout
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {modalTab === 'Settlement' && (
                                <div className="space-y-6 animate-[fadeIn_0.3s]">
                                    <div className="p-8 bg-[#2D241E] rounded-[2.5rem] text-white relative overflow-hidden">
                                        <div className="absolute top-0 right-0 size-48 bg-emerald-500/10 blur-[100px]" />
                                        <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Net Transfer Amount</p>
                                        <h3 className="text-5xl font-black italic mt-2 tracking-tighter">{selectedKitchen?.amount}</h3>
                                        <div className="flex gap-2 mt-6">
                                            <span className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-tight flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[12px] text-emerald-400">check_circle</span> Verified Ledger
                                            </span>
                                            <span className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-tight">Cycle #2024-01-A</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-[#897a70] uppercase tracking-widest ml-1">Breakdown Intelligence</p>
                                        {[
                                            { label: 'Gross Revenue (Cluster)', val: '₹50,000.00', color: 'text-[#2D241E]' },
                                            { label: 'Platform Commission (15%)', val: '- ₹7,500.00', color: 'text-rose-500' },
                                            { label: 'TDS / Tech Charges', val: '- ₹0.00', color: 'text-[#897a70]' },
                                        ].map((row, i) => (
                                            <div key={i} className="flex justify-between items-center p-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
                                                <span className="text-[11px] font-black text-[#897a70] uppercase">{row.label}</span>
                                                <span className={`text-base font-black ${row.color}`}>{row.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {modalTab === 'Analytics' && (
                                <div className="space-y-6 animate-[fadeIn_0.3s]">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-6 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 flex items-center justify-between">
                                            <div><p className="text-[10px] font-black text-blue-900/50 uppercase">Growth Rate</p><h5 className="text-2xl font-black text-blue-900">+12.4%</h5></div>
                                            <span className="material-symbols-outlined text-blue-400">trending_up</span>
                                        </div>
                                        <div className="p-6 bg-violet-50/50 rounded-[2.5rem] border border-violet-100 flex items-center justify-between">
                                            <div><p className="text-[10px] font-black text-violet-900/50 uppercase">Contribution</p><h5 className="text-2xl font-black text-violet-900">8.2%</h5></div>
                                            <span className="material-symbols-outlined text-violet-400">pie_chart</span>
                                        </div>
                                    </div>
                                    <div className="p-10 border-2 border-dashed border-gray-100 rounded-[3rem] text-center">
                                        <span className="material-symbols-outlined text-gray-200 text-6xl">insights</span>
                                        <p className="text-xs font-bold text-[#897a70] mt-4 italic uppercase tracking-widest">Financial Projection Tunnel active</p>
                                    </div>
                                </div>
                            )}

                            {modalTab === 'Banking' && (
                                <div className="space-y-4 animate-[fadeIn_0.3s]">
                                    <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="size-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#2D241E]"><span className="material-symbols-outlined text-3xl">account_balance</span></div>
                                            <div><p className="text-sm font-black text-[#2D241E]">HDFC Bank of India</p><p className="text-[10px] font-bold text-[#897a70]">SAVINGS • XXXX 4421</p></div>
                                        </div>
                                        <div className="space-y-3 pt-4 border-t border-gray-200">
                                            <div className="flex justify-between text-[11px] font-bold"><span className="text-[#897a70] uppercase">IFSC Code</span><span className="text-[#2D241E]">HDFC0001092</span></div>
                                            <div className="flex justify-between text-[11px] font-bold"><span className="text-[#897a70] uppercase">Beneficiary Name</span><span className="text-[#2D241E] uppercase">{selectedKitchen?.kitchen}</span></div>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-blue-50 border border-blue-100 rounded-3xl flex items-center gap-3">
                                        <span className="material-symbols-outlined text-blue-600 text-[20px]">verified</span>
                                        <p className="text-[10px] font-black text-blue-800 uppercase tracking-tight">KYC Verified & Penny Drop Success</p>
                                    </div>
                                </div>
                            )}

                            {modalTab === 'Audit' && (
                                <div className="space-y-4 animate-[fadeIn_0.3s]">
                                    {[
                                        { action: 'Ledger Compiled', by: 'System AI', time: '10:00 AM' },
                                        { action: 'Orders Cross-Verified', by: 'Finance Bot', time: '10:05 AM' },
                                        { action: 'TDS Auto-Calculated', by: 'Tax Engine', time: '10:06 AM' },
                                    ].map((log, i) => (
                                        <div key={i} className="flex justify-between items-center p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                            <div><p className="text-xs font-black text-[#2D241E]">{log.action}</p><p className="text-[9px] text-[#897a70] font-bold uppercase">BY: {log.by}</p></div>
                                            <p className="text-[10px] font-black text-[#897a70]">{log.time}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer [DNA STYLE] */}
                        <div className="p-8 pb-10 bg-white border-t border-gray-50 flex items-center justify-end gap-10 shrink-0">
                            <button onClick={() => setShowSettlement(false)} className="text-[12px] font-black text-[#897a70] hover:text-[#2D241E] transition-colors">Close</button>
                            <button onClick={handleConfirmPayout} className="px-12 py-5 bg-[#10B981] text-white rounded-[1.5rem] text-[12px] font-black shadow-[0_10px_25px_-5px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest">Authorize Transfer</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AdminFinance;
