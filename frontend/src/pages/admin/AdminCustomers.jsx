import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';

const customersData = [
    { id: 'CUS001', name: 'Rahul Sharma', email: 'rahul@gmail.com', phone: '9876543210', plan: 'Monthly Veg', status: 'Active', joins: '12 Jan 2024', balance: '₹400', kyc: 'Verified', tags: ['VIP', 'Frequent'], tickets: 0, referrals: 12 },
    { id: 'CUS002', name: 'Priya Verma', email: 'priya.v@outlook.com', phone: '8877665544', plan: 'Weekly Non-Veg', status: 'Active', joins: '15 Jan 2024', balance: '₹0', kyc: 'Pending', tags: ['Regular'], tickets: 1, referrals: 3 },
    { id: 'CUS003', name: 'Amit Kumar', email: 'amitk@yahoo.com', phone: '7766554433', plan: 'None', status: 'Inactive', joins: '18 Jan 2024', balance: '₹0', kyc: 'Not Started', tags: ['New'], tickets: 0, referrals: 0 },
    { id: 'CUS004', name: 'Sneha Patel', email: 'sneha.p@gmail.com', phone: '9988776655', plan: 'Monthly Veg', status: 'Paused', joins: '20 Jan 2024', balance: '₹1200', kyc: 'Verified', tags: ['VIP'], tickets: 0, referrals: 8 },
    { id: 'CUS005', name: 'Vikram Singh', email: 'vikram.s@test.com', phone: '8765432109', plan: 'Trial', status: 'Active', joins: '22 Jan 2024', balance: '₹0', kyc: 'Verified', tags: ['Trial'], tickets: 2, referrals: 1 },
];

const AdminCustomers = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [modalTab, setModalTab] = useState('Vitals');
    const [editingCustomer, setEditingCustomer] = useState(null);

    const handleAction = (type, name) => {
        toast.success(`${type} action triggered for ${name}`, {
            style: { borderRadius: '10px', background: '#2D241E', color: '#fff', fontSize: '10px' }
        });
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredCustomers.length) setSelectedIds([]);
        else setSelectedIds(filteredCustomers.map(c => c.id));
    };

    const handleLoginAs = (name) => {
        toast.loading(`Impersonating ${name}...`, { duration: 2000 });
        setTimeout(() => {
            toast.success('Simulation active. Secure session tunnel established.');
        }, 2100);
    };

    const filteredCustomers = customersData.filter(cus => {
        const matchesSearch = cus.name.toLowerCase().includes(searchQuery.toLowerCase()) || cus.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'All' || cus.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-4 max-w-[1600px] mx-auto min-h-full pb-6 animate-[fadeIn_0.5s]">

            {/* 1. Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black text-[#2D241E] tracking-tight flex items-center gap-2">
                        Customer Management
                        <span className="px-2 py-0.5 bg-blue-500 text-white text-[9px] font-black rounded-lg uppercase tracking-wider">Users</span>
                    </h2>
                    <p className="text-[#5C4D42] text-xs font-medium opacity-80 mt-0.5">Manage subscriptions, profiles, and billing for all users.</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleAction('Export', 'Customer List')}
                        className="flex items-center gap-2 px-3 py-2 bg-white text-[#5C4D42] rounded-xl border border-gray-200 text-[10px] font-bold hover:border-blue-500 hover:text-blue-600 transition-all"
                    >
                        <span className="material-symbols-outlined text-[16px]">file_download</span>
                        Export CSV
                    </button>
                    <button
                        onClick={() => handleAction('Create', 'New User')}
                        className="flex items-center gap-2 px-4 py-2 bg-[#2D241E] text-white rounded-xl text-[10px] font-bold hover:bg-[#453831] shadow-lg shadow-[#2D241E]/10 transition-all"
                    >
                        <span className="material-symbols-outlined text-[16px]">person_add</span>
                        Add New Customer
                    </button>
                </div>
            </div>

            {/* 2. Executive Stats & Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Active Users', val: '1,248', sub: '+12% this month', icon: 'groups', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Avg Life Value', val: '₹14.2k', sub: 'CLV per customer', icon: 'leaderboard', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Churn Rate', val: '2.4%', sub: '-0.5% vs last qtr', icon: 'trending_down', color: 'text-rose-500', bg: 'bg-rose-50' },
                    { label: 'Growth Score', val: '98.2', sub: 'Health Index', icon: 'auto_graph', color: 'text-orange-500', bg: 'bg-orange-50' },
                ].map((s, i) => (
                    <div key={i} className="bg-white/70 backdrop-blur-xl p-5 rounded-[2rem] border border-white/60 shadow-sm group hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className={`size-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center`}>
                                <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                            </div>
                            <span className="text-[9px] font-black text-[#897a70] uppercase tracking-widest leading-none mt-1">{s.label}</span>
                        </div>
                        <h3 className="text-2xl font-black text-[#2D241E] tracking-tighter mt-4">{s.val}</h3>
                        <p className="text-[10px] font-bold text-[#897a70] mt-1">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* 3. Search & Bulk Action Bar */}
            <div className="flex flex-col lg:flex-row items-center gap-4">
                {/* Search & Filter */}
                <div className="flex-1 w-full bg-white/70 backdrop-blur-xl p-2.5 rounded-[1.75rem] border border-white/60 shadow-sm flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
                        <input
                            type="text"
                            placeholder="Find customers by name, phone or subscription ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl text-xs font-medium focus:ring-2 focus:ring-[#2D241E]/10 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-1.5 p-1 bg-gray-50 rounded-2xl overflow-x-auto w-full sm:w-auto">
                        {['All', 'Active', 'Paused', 'Inactive'].map(t => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className={`px-4 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all ${filter === t ? 'bg-[#2D241E] text-white shadow-lg' : 'text-[#897a70] hover:text-[#2D241E]'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bulk Action Bar - Animated */}
                {selectedIds.length > 0 && (
                    <div className="w-full lg:w-auto animate-[slideInRight_0.3s] bg-[#2D241E] p-3 rounded-[1.75rem] flex items-center gap-4 px-6 shadow-2xl shadow-black/20">
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest whitespace-nowrap">
                            <span className="text-white">{selectedIds.length}</span> Selected
                        </p>
                        <div className="h-6 w-px bg-white/10 mx-1"></div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleAction('Notify', 'Selected')} className="size-9 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-blue-500 transition-all" title="Send Notification">
                                <span className="material-symbols-outlined text-[18px]">notifications</span>
                            </button>
                            <button onClick={() => handleAction('Pause', 'Selected')} className="size-9 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-orange-500 transition-all" title="Pause Subscriptions">
                                <span className="material-symbols-outlined text-[18px]">pause_circle</span>
                            </button>
                            <button onClick={() => setSelectedIds([])} className="size-9 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-red-500 transition-all" title="Deselect All">
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 3. Customer Table */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[1.75rem] border border-white/60 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/50 border-b border-gray-100">
                                <th className="px-6 py-4 w-10">
                                    <button onClick={toggleSelectAll} className="size-5 rounded border-2 border-gray-200 flex items-center justify-center hover:border-[#2D241E] transition-all">
                                        {selectedIds.length === filteredCustomers.length && selectedIds.length > 0 && <div className="size-2.5 bg-[#2D241E] rounded-sm"></div>}
                                    </button>
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-[#5C4D42] uppercase tracking-wider">Identity & Trust</th>
                                <th className="px-1 py-4 text-[10px] font-black text-[#5C4D42] uppercase tracking-wider">Subscription</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[#5C4D42] uppercase tracking-wider">Wallet & KYC</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[#5C4D42] uppercase tracking-wider text-right">Admin Controls</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredCustomers.map((cus) => (
                                <tr key={cus.id} className={`group hover:bg-white/60 transition-colors ${selectedIds.includes(cus.id) ? 'bg-blue-50/40' : ''}`}>
                                    <td className="px-6 py-4">
                                        <button onClick={() => toggleSelect(cus.id)} className={`size-5 rounded border-2 transition-all flex items-center justify-center ${selectedIds.includes(cus.id) ? 'border-[#2D241E] bg-[#2D241E]' : 'border-gray-200 hover:border-[#2D241E]'}`}>
                                            {selectedIds.includes(cus.id) && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="size-11 rounded-[1.25rem] bg-[#2D241E] text-white flex items-center justify-center text-sm font-black italic shadow-lg shadow-black/5 overflow-hidden">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${cus.name}`} alt="" className="size-10 translate-y-2" />
                                                </div>
                                                {cus.kyc === 'Verified' && (
                                                    <div className="absolute -top-1 -right-1 size-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg" title="Identity Verified">
                                                        <span className="material-symbols-outlined text-white text-[12px] font-bold">verified</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-black text-[#2D241E]">{cus.name}</p>
                                                    {cus.tags.includes('VIP') && (
                                                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[8px] font-black rounded uppercase">VIP</span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-[#897a70] font-medium">{cus.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-1 py-4">
                                        <div className="flex flex-col">
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg w-fit uppercase tracking-wider ${cus.plan === 'None' ? 'bg-gray-100 text-gray-500' : 'bg-orange-100 text-orange-600'}`}>
                                                {cus.plan}
                                            </span>
                                            <div className="flex items-center gap-1.5 mt-1.5">
                                                <span className={`size-1.5 rounded-full ${cus.status === 'Active' ? 'bg-emerald-500' : cus.status === 'Paused' ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                                                <span className="text-[9px] font-bold text-[#897a70] uppercase tracking-tight">{cus.status}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <p className="text-xs font-black text-[#2D241E]">{cus.balance}</p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <span className={`text-[9px] font-black uppercase tracking-tight ${cus.kyc === 'Verified' ? 'text-blue-600' : cus.kyc === 'Pending' ? 'text-amber-600' : 'text-gray-400'}`}>KYC {cus.kyc}</span>
                                                {cus.tickets > 0 && (
                                                    <span className="text-[9px] bg-rose-50 text-rose-500 px-1 rounded font-black tracking-tight">• {cus.tickets} Open Tickets</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleLoginAs(cus.name)}
                                                className="size-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center hover:bg-violet-600 hover:text-white transition-all shadow-sm"
                                                title="Login as User"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">point_of_sale</span>
                                            </button>
                                            <button
                                                onClick={() => setEditingCustomer(cus)}
                                                className="size-8 rounded-xl bg-gray-50 text-[#5C4D42] flex items-center justify-center hover:bg-[#2D241E] hover:text-white transition-all shadow-sm"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">edit_square</span>
                                            </button>
                                            <button
                                                onClick={() => setSelectedCustomer(cus)}
                                                className="size-8 rounded-xl bg-[#2D241E] text-white flex items-center justify-center hover:bg-orange-600 transition-all shadow-lg shadow-black/10"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">account_circle</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 4. Pagination Placeholder */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white/30">
                    <p className="text-[10px] font-bold text-[#897a70]">Showing 5 of 1,248 customers</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-bold text-[#5C4D42] opacity-50 cursor-not_allowed">Prev</button>
                        <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-[#2D241E] hover:border-blue-500 transition-all">Next</button>
                    </div>
                </div>
            </div>

            {/* Customer Detail Modal - [NEW] */}
            {selectedCustomer && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2D241E]/80 backdrop-blur-md animate-[fadeIn_0.3s]" onClick={() => setSelectedCustomer(null)}></div>
                    <div className="bg-white rounded-[3rem] w-full max-w-3xl overflow-hidden shadow-2xl animate-[scaleIn_0.3s] relative z-10 border border-black/5 flex flex-col max-h-[92vh]">

                        {/* Modal Header [SCREENSHOT STYLE] */}
                        <div className="p-8 pb-4 flex justify-between items-start shrink-0">
                            <div>
                                <h3 className="text-2xl font-black text-[#2D241E]">Customer DNA</h3>
                                <p className="text-[11px] font-bold text-[#897a70] mt-1">Manage individual preferences, history & operations</p>
                            </div>
                            <button onClick={() => setSelectedCustomer(null)} className="size-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all">
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        </div>

                        {/* Tab Navigation - Professional Operational Center */}
                        <div className="px-8 mb-4 shrink-0 overflow-x-auto no-scrollbar">
                            <div className="flex gap-1 bg-gray-50 p-1.5 rounded-[1.5rem] border border-black/5 w-fit">
                                {[
                                    { id: 'Vitals', label: 'Intelligence', icon: 'psychology' },
                                    { id: 'Addresses', label: 'Logistics', icon: 'local_shipping' },
                                    { id: 'Transactions', label: 'Finance', icon: 'payments' },
                                    { id: 'Support', label: 'Support', icon: 'support_agent' },
                                    { id: 'Referrals', label: 'Growth', icon: 'groups' },
                                ].map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setModalTab(t.id)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-tight transition-all whitespace-nowrap ${modalTab === t.id ? 'bg-[#2D241E] text-white shadow-lg shadow-black/20' : 'text-[#897a70] hover:bg-white hover:text-[#2D241E]'}`}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Modal Content - Scrollable Master Region */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-4 space-y-8">
                            {/* Profile Identification Card [Persist Across Tabs] */}
                            <div className="p-5 bg-[#FDFBF9] border border-orange-100/50 rounded-[2.5rem] flex items-center gap-6 shadow-sm">
                                <div className="relative">
                                    <div className="size-20 rounded-2xl bg-[#2D241E] overflow-hidden shadow-lg border-2 border-white">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedCustomer.name}`} alt="" className="size-full object-cover translate-y-2" />
                                    </div>
                                    <div className="absolute -bottom-2 -left-2 bg-emerald-500 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase border-2 border-white shadow-sm">Active</div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xl font-black text-[#2D241E] tracking-tight">{selectedCustomer.name}</h4>
                                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">KYC: {selectedCustomer.kyc}</span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#897a70]">
                                            <span className="material-symbols-outlined text-[14px]">call</span>
                                            {selectedCustomer.phone}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#897a70]">
                                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                            Joined {selectedCustomer.joins}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {modalTab === 'Vitals' && (
                                <div className="space-y-8 animate-[fadeIn_0.3s]">
                                    {/* Eating History Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-[11px] font-black text-[#2D241E] uppercase tracking-widest flex items-center gap-2">
                                                <span className="material-symbols-outlined text-orange-500 text-[18px]">history</span>
                                                Eating History
                                            </h4>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#897a70]">
                                                    <span className="size-2 rounded-full bg-emerald-500"></span> Consumed
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#897a70]">
                                                    <span className="size-2 rounded-full bg-rose-500"></span> Skipped
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-[2.5rem] relative shadow-inner">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-[8px] font-black text-[#897a70] uppercase tracking-tighter">LAST 30 DAYS</span>
                                                <span className="text-[8px] font-black text-[#897a70] uppercase tracking-tighter italic">January 2024</span>
                                            </div>
                                            <div className="grid grid-cols-10 gap-2">
                                                {[...Array(30)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-4 rounded-md shadow-sm transition-all hover:scale-110 cursor-help ${i > 22 ? 'bg-gray-100' :
                                                            [3, 7, 14, 19].includes(i) ? 'bg-rose-500' : 'bg-emerald-500'
                                                            }`}
                                                    ></div>
                                                ))}
                                            </div>
                                            <div className="mt-4 text-right">
                                                <p className="text-[9px] font-black text-[#897a70] italic">3 skips this month</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Smart Actions Section */}
                                    <div className="space-y-4">
                                        <h4 className="text-[11px] font-black text-[#2D241E] uppercase tracking-widest flex items-center gap-2">
                                            <span className="material-symbols-outlined text-orange-500 text-[18px]">bolt</span>
                                            Smart Actions
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Pause Card */}
                                            <div className="p-5 bg-[#FFFCE8] border border-yellow-100 rounded-[2.5rem] space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 bg-white rounded-2xl flex items-center justify-center text-yellow-600 shadow-sm">
                                                        <span className="material-symbols-outlined text-[20px]">pause</span>
                                                    </div>
                                                    <p className="text-[11px] font-black text-[#2D241E]">Pause Subscription</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[8px] font-black text-[#897a70] uppercase ml-1">Select Range</p>
                                                    <div className="text-[10px] font-bold text-[#2D241E] flex items-center justify-between bg-white px-3 py-2.5 rounded-xl border border-yellow-200/50">
                                                        <span>Today</span>
                                                        <span className="material-symbols-outlined text-[12px] text-[#897a70]">east</span>
                                                        <span className="text-[#897a70]">Select Date</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => toast.success('Subscription Paused')} className="w-full py-4 bg-amber-500 text-white rounded-2xl text-[10px] font-black shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-all">Apply Pause</button>
                                            </div>

                                            {/* Refund Card */}
                                            <div className="p-5 bg-rose-50 border border-rose-100 rounded-[2.5rem] space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm">
                                                        <span className="material-symbols-outlined text-[20px]">cancel</span>
                                                    </div>
                                                    <p className="text-[11px] font-black text-[#2D241E]">Cancel & Refund</p>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <div className="space-y-1">
                                                        <p className="text-[8px] font-black text-[#897a70] uppercase ml-1">REFUND AMOUNT</p>
                                                        <p className="text-[10px] font-bold text-[#2D241E]">Pro-rata basis</p>
                                                    </div>
                                                    <p className="text-2xl font-black text-rose-500 italic leading-none">₹450</p>
                                                </div>
                                                <button onClick={() => toast.error('Cancellation Processed')} className="w-full py-4 bg-white border border-rose-200 text-rose-500 rounded-2xl text-[10px] font-black hover:bg-rose-500 hover:text-white transition-all shadow-sm">Process Cancellation</button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Admin Notes Section */}
                                    <div className="p-5 bg-amber-50 border border-amber-100 rounded-[2.5rem] space-y-3">
                                        <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px]">sticky_note_2</span>
                                            Internal Profile Notes
                                        </p>
                                        <textarea className="w-full bg-white/50 border-none rounded-xl p-3 text-[11px] font-medium text-[#2D241E] focus:bg-white transition-all outline-none h-20 placeholder:text-amber-900/40" placeholder="Add administrative notes..."></textarea>
                                    </div>
                                </div>
                            )}

                            {modalTab === 'Addresses' && (
                                <div className="space-y-4 animate-[fadeIn_0.3s]">
                                    {[
                                        { type: 'Primary Home', addr: 'B-201, Royal Enclave, Vijay Nagar, Indore', active: true },
                                        { type: 'Support Office', addr: 'Level 4, IT Park, Crystal IT Park, Indore', active: false },
                                    ].map((adr, i) => (
                                        <div key={i} className={`p-6 rounded-[2.5rem] border transition-all ${adr.active ? 'bg-white border-blue-100 shadow-md' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-[#2D241E]">{adr.type}</p>
                                                {adr.active && <span className="px-2 py-0.5 bg-blue-500 text-white text-[8px] font-black rounded uppercase">Default Delivery</span>}
                                            </div>
                                            <p className="text-xs font-bold text-[#5C4D42] leading-relaxed">{adr.addr}</p>
                                        </div>
                                    ))}
                                    <button className="w-full py-5 border-2 border-dashed border-gray-100 rounded-[2.5rem] text-[11px] font-black text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-all uppercase tracking-widest">Register New Delivery Axis</button>
                                </div>
                            )}

                            {modalTab === 'Transactions' && (
                                <div className="space-y-4 animate-[fadeIn_0.3s]">
                                    <div className="p-8 bg-[#2D241E] rounded-[2.5rem] text-white flex justify-between items-center shadow-xl shadow-black/20">
                                        <div>
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Available Credit</p>
                                            <h4 className="text-4xl font-black mt-1 italic leading-none">{selectedCustomer.balance}</h4>
                                        </div>
                                        <button onClick={() => toast.success('Credit tool opened')} className="size-14 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-orange-600 transition-all">
                                            <span className="material-symbols-outlined text-white text-[28px]">account_balance_wallet</span>
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { id: '#TRX-9921', date: '20 Jan', amt: '₹2,499', type: 'SubscriptionRenewal', icon: 'sync' },
                                            { id: '#TRX-8812', date: '15 Jan', amt: '₹120', type: 'Wallet Add-on', icon: 'add_circle' },
                                        ].map((trx, i) => (
                                            <div key={i} className="flex justify-between items-center p-5 bg-white rounded-[2rem] border border-black/5 shadow-sm">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#2D241E]"><span className="material-symbols-outlined text-[18px]">{trx.icon}</span></div>
                                                    <div><p className="text-xs font-black text-[#2D241E]">{trx.type}</p><p className="text-[9px] text-[#897a70] font-medium">{trx.date} • {trx.id}</p></div>
                                                </div>
                                                <div className="text-right"><p className="text-xs font-black text-[#2D241E]">{trx.amt}</p><p className="text-[9px] text-emerald-600 font-black uppercase">Success</p></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {modalTab === 'Support' && (
                                <div className="space-y-4 animate-[fadeIn_0.3s]">
                                    {[
                                        { id: '#TKT-901', issue: 'Tiffin not delivered today', date: 'Yesterday', status: 'Resolved' },
                                    ].map((tkt, i) => (
                                        <div key={i} className="p-5 bg-white rounded-[2rem] border border-black/5 shadow-sm transition-all hover:border-gray-200">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-xs font-black text-[#2D241E]">{tkt.issue}</p>
                                                    <p className="text-[9px] text-[#897a70] font-medium mt-1">Ticket {tkt.id} • {tkt.date}</p>
                                                </div>
                                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[8px] font-black rounded uppercase">{tkt.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="w-full py-5 bg-[#2D241E] border border-white/10 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-blue-600 transition-all">Audit Support Logs</button>
                                </div>
                            )}

                            {modalTab === 'Referrals' && (
                                <div className="space-y-4 animate-[fadeIn_0.3s]">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-6 bg-orange-50 border border-orange-100 rounded-[2.5rem]">
                                            <p className="text-[10px] font-black text-orange-900/50 uppercase tracking-widest">Network Growth</p>
                                            <h3 className="text-4xl font-black text-orange-900 mt-1 italic leading-none">{selectedCustomer.referrals}</h3>
                                        </div>
                                        <div className="p-6 bg-blue-50 border border-blue-100 rounded-[2.5rem]">
                                            <p className="text-[10px] font-black text-blue-900/50 uppercase tracking-widest">Rewards Unlocked</p>
                                            <h3 className="text-4xl font-black text-blue-900 mt-1 italic leading-none">₹{selectedCustomer.referrals * 100}</h3>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-gray-50 rounded-[2.5rem] space-y-4">
                                        <p className="text-[10px] font-black text-[#897a70] uppercase tracking-widest ml-1">Affiliated Identities</p>
                                        {[
                                            { name: 'Amit Kumar', date: 'Joined Feb 2024' },
                                            { name: 'Sneha Gupta', date: 'Joined Jan 2024' },
                                        ].map((ref, i) => (
                                            <div key={i} className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-black">{ref.name[0]}</div>
                                                    <div><p className="text-xs font-black text-[#2D241E]">{ref.name}</p><p className="text-[9px] text-[#897a70] font-medium">{ref.date}</p></div>
                                                </div>
                                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">Verified</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 pb-10 bg-white border-t border-gray-50 flex items-center justify-end gap-10 shrink-0">
                            <button onClick={() => setSelectedCustomer(null)} className="text-[12px] font-black text-[#897a70] hover:text-[#2D241E] transition-colors">Close</button>
                            <button onClick={() => {
                                toast.success('DNA Configuration Saved');
                                setSelectedCustomer(null);
                            }} className="px-12 py-5 bg-[#FF5722] text-white rounded-[1.5rem] text-[12px] font-black shadow-[0_10px_25px_-5px_rgba(255,87,34,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all">Save Changes</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Edit Customer Modal - [NEW] */}
            {editingCustomer && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2D241E]/90 backdrop-blur-lg animate-[fadeIn_0.3s]" onClick={() => setEditingCustomer(null)}></div>
                    <div className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl animate-[scaleIn_0.3s] relative z-10 border border-white/20">

                        <div className="bg-gray-100 p-8 flex justify-between items-center">
                            <div>
                                <h3 className="text-2xl font-black text-[#2D241E]">Edit Profile</h3>
                                <p className="text-[10px] font-bold text-[#897a70] uppercase tracking-widest mt-1">Operational Control Mode</p>
                            </div>
                            <button onClick={() => setEditingCustomer(null)} className="size-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-gray-50"><span className="material-symbols-outlined">close</span></button>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#897a70] uppercase ml-2 tracking-widest">Full Name</label>
                                <input type="text" defaultValue={editingCustomer.name} className="w-full bg-gray-50 border-none px-5 py-4 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white transition-all outline-none" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#897a70] uppercase ml-2 tracking-widest">Contact Email</label>
                                    <input type="email" defaultValue={editingCustomer.email} className="w-full bg-gray-50 border-none px-5 py-4 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white transition-all outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#897a70] uppercase ml-2 tracking-widest">Phone Number</label>
                                    <input type="text" defaultValue={editingCustomer.phone || '98110XXXXX'} className="w-full bg-gray-50 border-none px-5 py-4 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white transition-all outline-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#897a70] uppercase ml-2 tracking-widest">Subscription Status</label>
                                    <select defaultValue={editingCustomer.status} className="w-full bg-gray-50 border-none px-5 py-4 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white transition-all outline-none">
                                        {['Active', 'Paused', 'Inactive'].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#897a70] uppercase ml-2 tracking-widest">KYC Verification</label>
                                    <select defaultValue={editingCustomer.kyc} className="w-full bg-gray-50 border-none px-5 py-4 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white transition-all outline-none">
                                        {['Verified', 'Pending', 'Not Started', 'Rejected'].map(k => <option key={k} value={k}>{k}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#897a70] uppercase ml-2 tracking-widest">Internal Tags</label>
                                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-2xl">
                                    {['VIP', 'Frequent', 'Regular', 'New', 'Trial', 'Problematic'].map(t => (
                                        <button
                                            key={t}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toast.success(`${t} tag updated`);
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tight transition-all ${editingCustomer.tags.includes(t) ? 'bg-[#2D241E] text-white' : 'bg-white text-[#897a70] border border-gray-100'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-gray-100 flex gap-3">
                            <button onClick={() => setEditingCustomer(null)} className="flex-1 py-4 bg-white border border-gray-200 rounded-2xl font-black text-xs text-[#897a70] hover:text-red-500 transition-all uppercase tracking-widest">Discard Changes</button>
                            <button
                                onClick={() => {
                                    toast.success('Operational Profile Updated');
                                    setEditingCustomer(null);
                                }}
                                className="flex-1 py-4 bg-[#2D241E] text-white rounded-2xl font-black text-xs shadow-xl shadow-black/10 hover:bg-blue-600 transition-all uppercase tracking-widest"
                            >
                                Sync Profile
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AdminCustomers;
