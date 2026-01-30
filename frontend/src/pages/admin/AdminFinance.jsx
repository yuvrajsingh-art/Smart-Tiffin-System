import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';
import SkeletonLoader from '../../components/common/SkeletonLoader';

// --- Mock Data for Invoices ---
// --- Mock Data Removed ---
const invoicesData = [];

const AdminFinance = () => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [showSettlement, setShowSettlement] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [selectedEntity, setSelectedEntity] = useState(null);
    const [stats, setStats] = useState({ grossRevenue: 0, totalPayouts: 0, pendingLiabilities: 0, netProfit: 0 });
    const [payouts, setPayouts] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFinanceData();
    }, []);

    const fetchFinanceData = async () => {
        try {
            const [statsRes, payoutsRes, invoicesRes] = await Promise.all([
                axios.get('/api/admin/finance/stats'),
                axios.get('/api/admin/finance/payouts'),
                axios.get('/api/admin/finance/invoices')
            ]);
            if (statsRes.data.success) setStats(statsRes.data.data);
            if (payoutsRes.data.success) setPayouts(payoutsRes.data.data);
            if (invoicesRes.data.success) setInvoices(invoicesRes.data.data);
        } catch (error) {
            console.error("Finance fetch error:", error);
            toast.error("Failed to load finance data");
        } finally {
            setLoading(false);
        }
    };

    // --- Actions ---
    const openSettlement = (kitchen) => {
        setSelectedEntity(kitchen);
        setShowSettlement(true);
    };

    const openInvoice = (inv) => {
        setSelectedEntity(inv);
        setShowInvoice(true);
    };

    const handleBulkPayout = () => {
        toast.loading("Processing Batch Payout...", { duration: 2000 });
        setTimeout(() => toast.success("Batch Transfer of ₹3.15L Initiated via HDFC"), 2000);
    };

    const handleViewLedger = () => {
        toast('Redirecting to Full Ledger...', { icon: '📂' });
    };

    const handleDownloadInvoice = async (id) => {
        try {
            toast.loading("Generating Invoice PDF...");
            const token = localStorage.getItem('token');
            const res = await axios.get(`/api/admin/finance/invoice/${id}/download`, {
                responseType: 'blob',
                headers: { Authorization: `Bearer ${token}` }
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice-${id.toString().slice(-6).toUpperCase()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.dismiss();
            toast.success("Invoice Downloaded!");
        } catch (error) {
            toast.dismiss();
            console.error("Download Error:", error);
            toast.error("Failed to download invoice");
        }
    };

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto min-h-screen pb-10 relative">

            {/* Header Block */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">

                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-[#2D241E] tracking-tight uppercase">Finance & Billing</h1>
                        <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-lg shadow-emerald-500/10">Active Period</span>
                    </div>
                    <p className="text-[#897a70] text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        FY 2024-25 Current Period
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xl p-1 rounded-2xl border border-white/60 shadow-lg">
                    {['Overview', 'Payouts', 'Invoices', 'Tax'].map(t => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === t ? 'bg-[#2D241E] text-white shadow-xl shadow-black/20 scale-105' : 'text-[#897a70] hover:bg-white'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div >

            {/* Main Content Area */}
            {activeTab === 'Overview' && <FinanceOverview stats={stats} payouts={payouts} openSettlement={openSettlement} handleViewLedger={handleViewLedger} loading={loading} />}
            {activeTab === 'Payouts' && <PayoutsTable payouts={payouts} openSettlement={openSettlement} handleBulkPayout={handleBulkPayout} loading={loading} />}
            {activeTab === 'Invoices' && <InvoicesTable invoices={invoices} openInvoice={openInvoice} loading={loading} onDownload={handleDownloadInvoice} />}
            {activeTab === 'Tax' && <TaxComplianceView />}

            {/* Modals */}
            {showSettlement && <SettlementModal data={selectedEntity} onClose={() => setShowSettlement(false)} />}
            {showInvoice && <InvoicePreviewModal data={selectedEntity} onClose={() => setShowInvoice(false)} onDownload={handleDownloadInvoice} />}

        </div >
    );
};

const FinanceOverview = ({ stats, payouts, openSettlement, handleViewLedger, loading }) => (
    <div className="space-y-6 animate-slide-up">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#2D241E] to-[#453831] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute right-0 top-0 size-40 bg-white/5 rounded-full blur-[50px] group-hover:bg-white/10 transition-colors"></div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-4">Total Revenue</p>
                {loading ? (
                    <div className="h-12 w-48 bg-white/10 rounded-lg animate-pulse mb-2"></div>
                ) : (
                    <h3 className="text-5xl font-bold tracking-tighter">₹{(stats.grossRevenue || 0).toLocaleString()}</h3>
                )}
                <div className="mt-6 flex items-center gap-2 text-emerald-400 bg-white/5 w-fit px-3 py-1.5 rounded-full backdrop-blur-md">
                    <span className="material-symbols-outlined text-[16px]">trending_up</span>
                    <span className="text-[10px] font-bold">+18.5% revenue growth</span>
                </div>
            </div>

            <div className="glass-card p-8 rounded-[2.5rem] flex flex-col justify-between group hover:border-orange-200/50 transition-colors">
                <div className="flex justify-between items-start">
                    <p className="text-[10px] font-bold text-[#5C4D42]/60 uppercase tracking-wider">Pending Payouts</p>
                    <div className="size-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined">payments</span></div>
                </div>
                <div>
                    {loading ? (
                        <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse mt-2 mb-1"></div>
                    ) : (
                        <h3 className="text-3xl font-bold text-[#2D241E] mt-2">₹{(stats.pendingLiabilities || 0).toLocaleString()}</h3>
                    )}
                    <p className="text-[10px] font-bold text-[#897a70] mt-1">Due for processing</p>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-orange-500 w-[65%] rounded-full"></div>
                </div>
            </div>

            <div className="glass-card p-8 rounded-[2.5rem] flex flex-col justify-between group hover:border-blue-200/50 transition-colors">
                <div className="flex justify-between items-start">
                    <p className="text-[10px] font-bold text-[#5C4D42]/60 uppercase tracking-wider">Net Profit (Est.)</p>
                    <div className="size-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined">account_balance_wallet</span></div>
                </div>
                <div>
                    {loading ? (
                        <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse mt-2 mb-1"></div>
                    ) : (
                        <h3 className="text-3xl font-bold text-[#2D241E] mt-2">₹{(stats.netProfit || 0).toLocaleString()}</h3>
                    )}
                    <p className="text-[10px] font-bold text-[#897a70] mt-1">After payouts</p>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-blue-500 w-[85%] rounded-full"></div>
                </div>
            </div>
        </div>

        {/* Recent Transactions List */}
        <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/60 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold text-[#2D241E]">Recent Movements</h3>
                <button onClick={handleViewLedger} className="text-xs font-bold text-[#897a70] hover:text-[#2D241E] transition-colors">View All Ledger</button>
            </div>
            <div className="space-y-3">
                {loading ? (
                    <SkeletonLoader count={3} type="text" />
                ) : (
                    <>
                        {payouts.slice(0, 3).map((p, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:scale-[1.01] transition-transform cursor-pointer" onClick={() => openSettlement(p)}>
                                <div className="flex items-center gap-4">
                                    <div className="size-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#2D241E] font-bold text-xs">{(p?.kitchen || 'K').charAt(0)}</div>
                                    <div>
                                        <p className="text-xs font-bold text-[#2D241E]">{p.kitchen}</p>
                                        <p className="text-[10px] font-medium text-[#897a70] uppercase tracking-wider">Payout • {p.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-[#2D241E]">{p.amount}</p>
                                    <p className={`text-[10px] font-bold ${p.status === 'Success' ? 'text-emerald-500' : 'text-amber-500'}`}>{p.status}</p>
                                </div>
                            </div>
                        ))}
                        {payouts.length === 0 && <p className="text-center text-xs text-gray-400 py-4">No recent payouts</p>}
                    </>
                )}
            </div>
        </div>
    </div>
);

// --- Sub-Component: Payouts Table ---
const PayoutsTable = ({ payouts, openSettlement, handleBulkPayout, loading }) => (
    <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-xl overflow-hidden min-h-[60vh] flex flex-col animate-slide-up">
        <div className="p-6 border-b border-white/50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-[#2D241E]">Kitchen Settlements</h3>
            <button onClick={handleBulkPayout} className="px-5 py-2 bg-[#2D241E] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-orange-600 transition-colors">Process Bulk Payout</button>
        </div>
        <div className="overflow-x-auto flex-1 custom-scrollbar">
            <table className="w-full text-left border-collapse">
                <thead className="bg-white/50 sticky top-0 z-10 backdrop-blur-md">
                    <tr>
                        <th className="px-8 py-5 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Kitchen</th>
                        <th className="px-6 py-5 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-5 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Orders</th>
                        <th className="px-6 py-5 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Status</th>
                        <th className="px-8 py-5 text-[11px] font-bold text-[#897a70] uppercase tracking-wider text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50">
                    {loading ? (
                        <SkeletonLoader type="table-row" count={5} />
                    ) : (
                        <>
                            {payouts.map((p) => (
                                <tr key={p.id} className="group hover:bg-white/80 transition-all cursor-pointer" onClick={() => openSettlement(p)}>
                                    <td className="px-8 py-5">
                                        <p className="text-xs font-bold text-[#2D241E]">{p.kitchen}</p>
                                        <p className="text-[10px] font-bold text-[#897a70] mt-0.5">ID: {p.id}</p>
                                    </td>
                                    <td className="px-6 py-5 text-xs font-bold text-[#2D241E]">{p.amount}</td>
                                    <td className="px-6 py-5 text-xs font-bold text-[#5C4D42]">-</td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${p.status === 'Success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="size-8 rounded-xl bg-white border border-gray-100 text-[#2D241E] flex items-center justify-center hover:bg-[#2D241E] hover:text-white transition-all ml-auto shadow-sm">
                                            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {payouts.length === 0 && (
                                <tr><td colSpan="5" className="text-center py-6 text-xs text-gray-400">No payout records found.</td></tr>
                            )}
                        </>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

// --- Sub-Component: Invoices Table ---
const InvoicesTable = ({ invoices, openInvoice, loading, onDownload }) => {
    const [search, setSearch] = useState('');
    const filteredInvoices = (invoices || []).filter(i =>
        (i?.id || '').toLowerCase().includes(search.toLowerCase()) ||
        (i?.user || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-xl overflow-hidden min-h-[60vh] flex flex-col animate-slide-up">
            <div className="p-6 border-b border-white/50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#2D241E]">Recent Invoices</h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search Invoice # or User..."
                        className="bg-white/50 border border-white px-4 py-2 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#2D241E]/10 w-64"
                    />
                </div>
            </div>
            <div className="overflow-x-auto flex-1 custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/50 sticky top-0 z-10 backdrop-blur-md">
                        <tr>
                            <th className="px-8 py-5 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Invoice #</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">User</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-5 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Status</th>
                            <th className="px-8 py-5 text-[11px] font-bold text-[#897a70] uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/50">
                        {loading ? (
                            <SkeletonLoader type="table-row" count={5} />
                        ) : filteredInvoices.length > 0 ? (
                            filteredInvoices.map((inv) => (
                                <tr key={inv.id} className="group hover:bg-white/80 transition-all cursor-pointer">
                                    <td className="px-8 py-5 text-xs font-bold text-[#2D241E] font-mono" onClick={() => openInvoice(inv)}>{inv.id}</td>
                                    <td className="px-6 py-5" onClick={() => openInvoice(inv)}>
                                        <p className="text-xs font-bold text-[#2D241E]">{inv.user}</p>
                                        <p className="text-[10px] text-[#897a70]">{inv.date}</p>
                                    </td>
                                    <td className="px-6 py-5 text-xs font-bold text-[#2D241E]" onClick={() => openInvoice(inv)}>{inv.amount}</td>
                                    <td className="px-6 py-5" onClick={() => openInvoice(inv)}>
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : inv.status === 'Overdue' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right flex items-center justify-end gap-2">
                                        <button onClick={() => openInvoice(inv)} className="size-8 rounded-xl bg-white border border-gray-100 text-[#2D241E] flex items-center justify-center hover:border-blue-200 transition-all shadow-sm" title="Preview">
                                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); onDownload(inv.rawId); }} className="size-8 rounded-xl bg-[#2D241E] text-white flex items-center justify-center hover:bg-orange-600 transition-all shadow-sm" title="Download PDF">
                                            <span className="material-symbols-outlined text-[16px]">download</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-[10px] font-bold text-gray-400">No invoices found matching "{search}"</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Sub-Component: Tax Compliance (Placeholder) ---
const TaxComplianceView = () => (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white/40 rounded-[2.5rem] border border-white/50 backdrop-blur-md animate-slide-up">
        <div className="size-24 bg-white/50 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm">
            <span className="material-symbols-outlined text-5xl text-gray-300">account_balance</span>
        </div>
        <h3 className="text-xl font-bold text-[#2D241E]">Tax Compliance Hub</h3>
        <p className="text-xs font-medium text-[#897a70] mt-2 text-center max-w-sm">
            Automated GST filing and TDS certificate generation will be available in the next financial quarter update.
        </p>
    </div>
);


// --- MODAL: Financial Details / Settlement ---
const SettlementModal = ({ data, onClose }) => {
    const [commission, setCommission] = useState(15);
    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState(0); // 0: Review, 1: Auth, 2: Success

    const handlePayout = () => {
        setProcessing(true);
        setTimeout(() => setStep(1), 1000); // Auth
        setTimeout(() => setStep(2), 3000); // Success
        setTimeout(() => {
            toast.success('Payout Transfer Successful');
            onClose();
            setStep(0);
            setProcessing(false);
        }, 4500);
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[88vh]">

                {/* Compact Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-gray-800">Settlement Authorization</h3>
                        <p className="text-xs text-gray-500">ID: {data.id} • {data.date}</p>
                    </div>
                    <button onClick={onClose} className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600">
                        <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                </div>

                {/* Interactive Content */}
                <div className="p-5 flex-1">

                    {step === 0 && (
                        <div className="space-y-6 animate-enter">
                            <div className="p-6 bg-[#2D241E] rounded-[2rem] text-white flex justify-between items-center shadow-xl">
                                <div>
                                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Net Payable</p>
                                    <h2 className="text-4xl font-bold tracking-tighter mt-1">{data.amount}</h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Bank Verified</p>
                                    <p className="text-xs font-medium text-white/70 mt-1">HDFC **** 4291</p>
                                </div>
                            </div>

                            {/* Commission Slider */}
                            <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                                <div className="flex justify-between mb-4">
                                    <span className="text-[10px] font-bold text-[#5C4D42] uppercase tracking-wider">Platform Commission</span>
                                    <span className="text-xs font-bold text-[#2D241E]">{commission}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="30"
                                    value={commission}
                                    onChange={(e) => setCommission(e.target.value)}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2D241E]"
                                />
                                <p className="text-xs font-bold text-[#897a70] mt-2 text-center">Adjusting commission affects the Net Payable amount.</p>
                            </div>

                            <button onClick={handlePayout} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-600 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-500/30">
                                Authorize Transfer
                            </button>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="flex flex-col items-center justify-center h-64 animate-enter">
                            <div className="size-16 border-4 border-gray-100 border-t-[#2D241E] rounded-full animate-spin mb-6"></div>
                            <h4 className="text-lg font-bold text-[#2D241E]">Processing Transfer...</h4>
                            <p className="text-xs font-medium text-[#897a70] mt-2">Connecting to bank...</p>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col items-center justify-center h-64 animate-enter">
                            <div className="size-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600 animate-[scaleIn_0.3s]">
                                <span className="material-symbols-outlined text-4xl">check</span>
                            </div>
                            <h4 className="text-2xl font-bold text-[#2D241E]">Transfer Complete!</h4>
                            <p className="text-xs font-medium text-[#897a70] mt-2">Transaction ID: TXN-{Date.now()}</p>
                        </div>
                    )}

                </div>
            </div>
        </div>,
        document.body
    );
};

// --- MODAL: Invoice Preview ---
const InvoicePreviewModal = ({ data, onClose }) => {
    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#2D241E]/80 backdrop-blur-md animate-[fadeIn_0.3s]" onClick={onClose}></div>
            <div className="bg-[#F5F2EB] rounded-[3rem] w-full max-w-lg h-[80vh] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] animate-[scaleIn_0.3s] relative z-10 flex flex-col border-[12px] border-white ring-1 ring-black/5">

                {/* Texture */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2D241E 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                {/* Header Actions */}
                <div className="relative z-10 p-4 bg-[#2D241E] text-white flex justify-between items-center shrink-0 shadow-md">
                    <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px]">description</span>
                        Invoice Preview
                    </span>
                    <button onClick={onClose} className="text-white/70 hover:text-white transition-colors"><span className="material-symbols-outlined">close</span></button>
                </div>

                {/* Mock PDF Content */}
                <div className="relative z-10 flex-1 bg-gray-50/50 overflow-y-auto p-8 custom-scrollbar">
                    <div className="bg-white shadow-sm p-8 min-h-[500px] text-[#2D241E]">
                        <div className="flex justify-between items-start mb-8">
                            <h1 className="text-2xl font-bold tracking-tighter">INVOICE</h1>
                            <div className="text-right">
                                <h2 className="text-sm font-bold text-[#2D241E]">Smart Tiffin System</h2>
                                <p className="text-[10px] text-gray-500">Sector 62, Noida, UP</p>
                            </div>
                        </div>

                        <div className="border-b border-gray-100 pb-6 mb-6">
                            <div className="grid grid-cols-2">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Bill To</p>
                                    <p className="text-sm font-bold mt-1">{data.user}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-bold text-gray-400">Invoice #</p>
                                    <p className="text-sm font-bold mt-1">{data.id}</p>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 mt-2">Date</p>
                                    <p className="text-sm font-bold mt-1">{data.date}</p>
                                </div>
                            </div>
                        </div>

                        <table className="w-full text-left mb-8">
                            <thead>
                                <tr className="border-b-2 border-gray-100">
                                    <th className="pb-2 text-[10px] font-bold uppercase text-gray-400">Item</th>
                                    <th className="pb-2 text-[10px] font-bold uppercase text-gray-400 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-xs font-medium">
                                <tr>
                                    <td className="py-3">Monthly Subscription (Premium Plan)</td>
                                    <td className="py-3 text-right">{data.amount}</td>
                                </tr>
                                <tr>
                                    <td className="py-3">Delivery Charges</td>
                                    <td className="py-3 text-right">₹0.00</td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="flex justify-end">
                            <div className="text-right">
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Amount</p>
                                <h3 className="text-2xl font-bold text-[#2D241E] mt-1">{data.amount}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="relative z-10 p-4 bg-white border-t border-gray-100 flex gap-3 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
                    <button onClick={() => onDownload(data.rawId)} className="flex-1 py-3 bg-[#2D241E] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-orange-600 transition-colors">Download PDF</button>
                    <button className="flex-1 py-3 bg-white border border-gray-200 text-[#2D241E] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors">Email Invoice</button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default AdminFinance;
