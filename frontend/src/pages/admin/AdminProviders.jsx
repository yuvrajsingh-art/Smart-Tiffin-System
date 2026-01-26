import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const providersData = [
    { id: 'PRO001', name: 'Annapurna Rasoi', owner: 'Mrs. Sharma', location: 'Indore, Sector 7', capacity: '200/500', rating: 4.8, status: 'Active', joins: '01 Jan 2024', earnings: '₹1.2L' },
    { id: 'PRO002', name: 'Spice Route', owner: 'Vicky Kaushal', location: 'Indore, Vijay Nagar', capacity: '150/300', rating: 4.5, status: 'Active', joins: '05 Jan 2024', earnings: '₹85K' },
    { id: 'PRO003', name: 'Home Taste', owner: 'Suman Lata', location: 'Indore, Rajwada', capacity: '80/100', rating: 4.9, status: 'Active', joins: '10 Jan 2024', earnings: '₹42K' },
    { id: 'PRO004', name: 'Healthy Bites', owner: 'Dr. Rahul', location: 'Indore, Annapurna', capacity: '0/200', rating: 0, status: 'Pending', joins: '25 Jan 2024', earnings: '₹0' },
];

const AdminProviders = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All');
    const [selectedKitchen, setSelectedKitchen] = useState(null);

    const handleAction = (type, name) => {
        toast.success(`${type} action triggered for ${name}`, {
            style: { borderRadius: '10px', background: '#2D241E', color: '#fff', fontSize: '10px' }
        });
    };

    const filteredProviders = providersData.filter(pro => {
        const matchesSearch = pro.name.toLowerCase().includes(searchQuery.toLowerCase()) || pro.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'All' || pro.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-4 max-w-[1600px] mx-auto min-h-full pb-6 animate-[fadeIn_0.5s]">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black text-[#2D241E] tracking-tight flex items-center gap-2">
                        Kitchen & Provider Hub
                        <span className="px-2 py-0.5 bg-violet-500 text-white text-[9px] font-black rounded-lg uppercase tracking-wider">Kitchens</span>
                    </h2>
                    <p className="text-[#5C4D42] text-xs font-medium opacity-80 mt-0.5">Approve new kitchens, monitor quality, and track payouts.</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleAction('Review', 'Join Requests')}
                        className="flex items-center gap-2 px-3 py-2 bg-white text-violet-600 rounded-xl border border-violet-100 text-[10px] font-bold hover:bg-violet-50 transition-all relative"
                    >
                        <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                        New Requests
                        <span className="absolute -top-1 -right-1 size-4 bg-red-500 text-white flex items-center justify-center text-[8px] rounded-full border-2 border-white animate-bounce">1</span>
                    </button>
                    <button
                        onClick={() => handleAction('Add', 'New Provider')}
                        className="flex items-center gap-2 px-4 py-2 bg-[#2D241E] text-white rounded-xl text-[10px] font-bold hover:bg-[#453831] shadow-lg shadow-[#2D241E]/10 transition-all"
                    >
                        <span className="material-symbols-outlined text-[16px]">add_business</span>
                        Register Kitchen
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Active Kitchens', val: '15', icon: 'storefront', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Total Meals/Day', val: '450', icon: 'restaurant', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Avg Rating', val: '4.7', icon: 'star', color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Platform Rev', val: '₹4.2L', icon: 'payments', color: 'text-violet-600', bg: 'bg-violet-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white/70 backdrop-blur-xl p-4 rounded-2xl border border-white/60 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-[9px] font-bold text-[#5C4D42]/60 uppercase tracking-wider">{stat.label}</p>
                            <h3 className="text-xl font-black text-[#2D241E] mt-0.5">{stat.val}</h3>
                        </div>
                        <div className={`size-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                            <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white/70 backdrop-blur-xl p-3 rounded-[1.5rem] border border-white/60 shadow-sm flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full text-[#5C4D42]">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
                    <input
                        type="text"
                        placeholder="Search kitchens by name, owner or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#2D241E]/10 transition-all"
                    />
                </div>
                <div className="flex items-center gap-1.5 p-1 bg-gray-50 rounded-xl overflow-x-auto w-full sm:w-auto">
                    {['All', 'Active', 'Pending', 'Suspended'].map(t => (
                        <button
                            key={t}
                            onClick={() => setFilter(t)}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${filter === t ? 'bg-[#2D241E] text-white shadow-sm' : 'text-[#897a70] hover:text-[#2D241E]'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[1.75rem] border border-white/60 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-black text-[#5C4D42] uppercase tracking-wider">Kitchen Hub</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[#5C4D42] uppercase tracking-wider">Location & Capacity</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[#5C4D42] uppercase tracking-wider">Earnings</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[#5C4D42] uppercase tracking-wider text-center">Quality</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[#5C4D42] uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[#5C4D42] uppercase tracking-wider text-right">Settings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProviders.map((pro) => (
                                <tr key={pro.id} className="group hover:bg-white/60 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-[#2D241E] flex items-center justify-center text-orange-400 font-black text-sm shadow-md">
                                                {pro.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#2D241E]">{pro.name}</p>
                                                <p className="text-[10px] text-[#897a70] font-medium">#{pro.id} • {pro.owner}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs font-bold text-[#5C4D42]">{pro.location}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="w-20 bg-gray-100 h-1 rounded-full overflow-hidden">
                                                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(parseInt(pro.capacity.split('/')[0]) / parseInt(pro.capacity.split('/')[1])) * 100}%` }}></div>
                                            </div>
                                            <span className="text-[9px] font-bold text-[#897a70]">{pro.capacity} meals</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-black text-xs text-[#2D241E]">{pro.earnings}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-0.5 text-[#2D241E] font-black text-xs">
                                            <span className="material-symbols-outlined text-[14px] text-amber-500 fill-current">star</span>
                                            {pro.rating || 'New'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${pro.status === 'Active' ? 'bg-emerald-100 text-emerald-600' :
                                            pro.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-red-50 text-red-500'
                                            }`}>
                                            {pro.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setSelectedKitchen(pro)}
                                                className="size-8 rounded-lg bg-gray-100 text-[#5C4D42] flex items-center justify-center hover:bg-[#2D241E] hover:text-white transition-all shadow-sm"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">monitoring</span>
                                            </button>
                                            <button
                                                onClick={() => handleAction('Menu', pro.name)}
                                                className="size-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">restaurant_menu</span>
                                            </button>
                                            <button
                                                onClick={() => handleAction('Status', pro.name)}
                                                className="size-8 rounded-lg bg-[#2D241E] text-white flex items-center justify-center hover:bg-red-600 transition-all"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">settings</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Kitchen & Provider DNA Modal - [NEW FUSION] */}
            {selectedKitchen && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2D241E]/80 backdrop-blur-md animate-[fadeIn_0.3s]" onClick={() => setSelectedKitchen(null)}></div>
                    <div className="bg-white rounded-[3rem] w-full max-w-3xl overflow-hidden shadow-2xl animate-[scaleIn_0.3s] relative z-10 border border-black/5 flex flex-col max-h-[92vh]">

                        {/* Modal Header [DNA STYLE] */}
                        <div className="p-8 pb-4 flex justify-between items-start shrink-0">
                            <div>
                                <h3 className="text-2xl font-black text-[#2D241E]">Provider DNA</h3>
                                <p className="text-[11px] font-bold text-[#897a70] mt-1">Operational intelligence & kitchen health metrics</p>
                            </div>
                            <button onClick={() => setSelectedKitchen(null)} className="size-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all">
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        </div>

                        {/* Tab Navigation - Operational Intelligence Tabs */}
                        <div className="px-8 mb-4 shrink-0 overflow-x-auto no-scrollbar">
                            <div className="flex gap-1 bg-gray-50 p-1.5 rounded-[1.5rem] border border-black/5 w-fit">
                                {[
                                    { id: 'Analytics', label: 'Intelligence', icon: 'monitoring' },
                                    { id: 'Menu', label: 'Inventory', icon: 'restaurant_menu' },
                                    { id: 'Orders', label: 'Operations', icon: 'orders' },
                                    { id: 'Earnings', label: 'Finance', icon: 'payments' },
                                    { id: 'Quality', label: 'Quality Swarm', icon: 'verified' },
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

                        {/* Modal Content - Scrollable Region */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-4 space-y-8">

                            {/* Provider Identification Card */}
                            <div className="p-5 bg-violet-50/30 border border-violet-100/50 rounded-[2.5rem] flex items-center gap-6 shadow-sm">
                                <div className="relative">
                                    <div className="size-20 rounded-2xl bg-[#2D241E] flex items-center justify-center text-orange-400 text-3xl font-black shadow-lg border-2 border-white">
                                        {selectedKitchen.name.charAt(0)}
                                    </div>
                                    <div className="absolute -bottom-2 -left-2 bg-emerald-500 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase border-2 border-white shadow-sm">{selectedKitchen.status}</div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xl font-black text-[#2D241E] tracking-tight">{selectedKitchen.name}</h4>
                                        <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px] fill-current">star</span> {selectedKitchen.rating} Quality
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#897a70]">
                                            <span className="material-symbols-outlined text-[14px]">person</span>
                                            Owned by {selectedKitchen.owner}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#897a70]">
                                            <span className="material-symbols-outlined text-[14px]">pin_drop</span>
                                            {selectedKitchen.location}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {(modalTab === 'Analytics' || !modalTab) && (
                                <div className="space-y-8 animate-[fadeIn_0.3s]">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 bg-[#2D241E] rounded-[2rem] text-white">
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Daily Thrill</p>
                                            <div className="flex items-end justify-between mt-1">
                                                <h3 className="text-4xl font-black italic leading-none">{selectedKitchen.capacity.split('/')[0]} <span className="text-xs text-white/30 not-italic">Meals</span></h3>
                                                <p className="text-[9px] font-black text-emerald-400">+12% vs Avg</p>
                                            </div>
                                            <div className="w-full h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                                                <div className="bg-orange-500 h-full w-[70%]" />
                                            </div>
                                        </div>
                                        <div className="p-5 bg-gray-50 rounded-[2rem] border border-black/5">
                                            <p className="text-[10px] font-black text-[#897a70] uppercase tracking-widest">Kitchen Health</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="size-3 rounded-full bg-emerald-500 animate-pulse" />
                                                <p className="text-sm font-black text-[#2D241E]">Stable Ecosystem</p>
                                            </div>
                                            <p className="text-[9px] font-bold text-[#897a70] mt-1 italic">98.4% On-time delivery rate</p>
                                        </div>
                                    </div>

                                    {/* Performance Chart */}
                                    <div className="space-y-4">
                                        <h5 className="text-[11px] font-black text-[#2D241E] uppercase tracking-widest flex items-center gap-2">
                                            <span className="material-symbols-outlined text-orange-500 text-[18px]">auto_graph</span>
                                            Order Lifecycle Performance
                                        </h5>
                                        <div className="h-[200px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={[
                                                    { d: 'M', o: 45 }, { d: 'T', o: 52 }, { d: 'W', o: 48 }, { d: 'T', o: 61 }, { d: 'F', o: 55 }, { d: 'S', o: 67 }, { d: 'S', o: 70 }
                                                ]}>
                                                    <defs>
                                                        <linearGradient id="colorOrder" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#2D241E" stopOpacity={0.1} />
                                                            <stop offset="95%" stopColor="#2D241E" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#897a70', fontWeight: 'bold' }} />
                                                    <YAxis hide />
                                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', fontSize: '10px' }} />
                                                    <Area type="monotone" dataKey="o" stroke="#2D241E" strokeWidth={3} fill="url(#colorOrder)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Smart Actions */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <button className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 transition-all hover:bg-emerald-100">
                                            <div className="size-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600"><span className="material-symbols-outlined">description</span></div>
                                            <div className="text-left"><p className="text-[10px] font-black text-emerald-900 uppercase">Sanitation Log</p><p className="text-[9px] font-bold text-emerald-600">Audit Ready</p></div>
                                        </button>
                                        <button className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 transition-all hover:bg-rose-100">
                                            <div className="size-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-rose-600"><span className="material-symbols-outlined">warning</span></div>
                                            <div className="text-left"><p className="text-[10px] font-black text-rose-900 uppercase">Emergency Hold</p><p className="text-[9px] font-bold text-rose-600">Stop All Production</p></div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {modalTab === 'Earnings' && (
                                <div className="space-y-6 animate-[fadeIn_0.3s]">
                                    <div className="p-8 bg-[#2D241E] rounded-[2.5rem] text-white flex justify-between items-center shadow-xl">
                                        <div>
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Monthly Gross</p>
                                            <h4 className="text-4xl font-black mt-1 italic tracking-tight">{selectedKitchen.earnings}</h4>
                                        </div>
                                        <button className="size-14 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-orange-600 transition-all shadow-lg shadow-black/20">
                                            <span className="material-symbols-outlined text-white text-[28px]">account_balance_wallet</span>
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-[#897a70] uppercase tracking-widest ml-1">Payout Roadmap</p>
                                        {[
                                            { date: 'Next Payout: 31 Jan', amt: '₹42,300', status: 'In-Review' },
                                            { date: 'Last Payout: 15 Jan', amt: '₹38,200', status: 'Dispatched' },
                                        ].map((p, i) => (
                                            <div key={i} className="flex justify-between items-center p-5 bg-white rounded-[2rem] border border-black/5 shadow-sm">
                                                <div><p className="text-xs font-black text-[#2D241E]">{p.date}</p><p className="text-[9px] text-[#897a70] font-bold uppercase mt-0.5">{p.status}</p></div>
                                                <div className="text-right">
                                                    <p className="text-lg font-black text-[#2D241E]">{p.amt}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {modalTab === 'Menu' && (
                                <div className="space-y-4 animate-[fadeIn_0.3s]">
                                    <div className="flex gap-2">
                                        {['All Items', 'Meals', 'Add-ons'].map(c => (
                                            <button key={c} className={`px-4 py-2 border rounded-xl text-[9px] font-black uppercase transition-all ${c === 'All Items' ? 'bg-[#2D241E] border-[#2D241E] text-white' : 'bg-white border-gray-100 text-[#897a70]'}`}>{c}</button>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { name: 'Executive Veg Thali', price: '₹120', status: 'Available', tags: ['High Demand'] },
                                            { name: 'Mini Meal Combo', price: '₹80', status: 'Available', tags: ['Budget'] },
                                        ].map((item, i) => (
                                            <div key={i} className="p-5 bg-white rounded-[2rem] border border-black/5 shadow-sm group hover:scale-[1.02] transition-all">
                                                <div className="flex items-start justify-between">
                                                    <div className="size-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#212121]"><span className="material-symbols-outlined">lunch_dining</span></div>
                                                    <span className="text-[9px] font-black text-emerald-600 uppercase italic">Live</span>
                                                </div>
                                                <h5 className="text-sm font-black text-[#2D241E] mt-4 uppercase truncate">{item.name}</h5>
                                                <p className="text-lg font-black text-orange-600 mt-1">{item.price}</p>
                                                <div className="flex gap-1 mt-3">
                                                    {item.tags.map(t => <span key={t} className="px-2 py-0.5 bg-gray-100 text-[8px] font-bold text-[#897a70] rounded-lg"># {t}</span>)}
                                                </div>
                                            </div>
                                        ))}
                                        <button className="border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center p-6 text-gray-400 hover:border-violet-300 hover:text-violet-500 transition-all">
                                            <span className="material-symbols-outlined text-3xl mb-2">add_circle</span>
                                            <span className="text-[9px] font-black uppercase tracking-widest">Sync New Content</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {modalTab === 'Quality' && (
                                <div className="space-y-6 animate-[fadeIn_0.3s]">
                                    <div className="flex items-center justify-between p-6 bg-amber-50 rounded-[2.5rem] border border-amber-100">
                                        <div>
                                            <p className="text-[10px] font-black text-amber-900/40 uppercase tracking-widest">Trust Multiplier</p>
                                            <h3 className="text-4xl font-black text-amber-900 italic mt-1 leading-none">x1.42</h3>
                                        </div>
                                        <div className="size-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-amber-500"><span className="material-symbols-outlined text-[32px] fill-current">award_star</span></div>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-[#897a70] uppercase tracking-widest ml-1">Recent Evaluations</p>
                                        {[
                                            { label: 'Packaging Integrity', score: '9.4/10', trend: 'Up' },
                                            { label: 'Taste Consistency', score: '8.8/10', trend: 'Stable' },
                                            { label: 'Hygiene Audit', score: 'Pass', trend: 'Verified' },
                                        ].map((ev, i) => (
                                            <div key={i} className="flex justify-between items-center p-5 bg-white rounded-[2rem] border border-black/5 shadow-sm transition-all hover:bg-gray-50/50">
                                                <p className="text-xs font-black text-[#2D241E]">{ev.label}</p>
                                                <div className="text-right">
                                                    <p className="text-sm font-black text-[#2D241E] uppercase">{ev.score}</p>
                                                    <p className="text-[8px] font-black text-emerald-600 uppercase tracking-tight">{ev.trend}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {modalTab === 'Orders' && (
                                <div className="space-y-4 animate-[fadeIn_0.3s]">
                                    <div className="p-10 border-2 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center text-center">
                                        <div className="size-16 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-4"><span className="material-symbols-outlined text-gray-400 text-3xl">hourglass_empty</span></div>
                                        <h4 className="text-lg font-black text-[#2D241E] tracking-tight">No Active Dispatches</h4>
                                        <p className="text-[10px] font-bold text-[#897a70] uppercase tracking-widest mt-1">Waiting for next wave of cluster orders</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-5 bg-blue-50/50 rounded-[2rem] border border-blue-100 flex items-center justify-between">
                                            <div><p className="text-[9px] font-black text-blue-900/50 uppercase">Today's Demand</p><h5 className="text-2xl font-black text-blue-900 italic">142</h5></div>
                                            <span className="material-symbols-outlined text-blue-400">trending_up</span>
                                        </div>
                                        <div className="p-5 bg-violet-50/50 rounded-[2rem] border border-violet-100 flex items-center justify-between">
                                            <div><p className="text-[9px] font-black text-violet-900/50 uppercase">Fleet Sync</p><h5 className="text-2xl font-black text-violet-900 italic">Ready</h5></div>
                                            <span className="material-symbols-outlined text-violet-400">delivery_dining</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer [DNA STYLE] */}
                        <div className="p-8 pb-10 bg-white border-t border-gray-50 flex items-center justify-end gap-10 shrink-0">
                            <button onClick={() => setSelectedKitchen(null)} className="text-[12px] font-black text-[#897a70] hover:text-[#2D241E] transition-colors">Close</button>
                            <button onClick={() => {
                                toast.success('Provider DNA Record Synced');
                                setSelectedKitchen(null);
                            }} className="px-12 py-5 bg-[#FF5722] text-white rounded-[1.5rem] text-[12px] font-black shadow-[0_10px_25px_-5px_rgba(255,87,34,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all">Save Changes</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AdminProviders;
