import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { createPortal } from 'react-dom';

// --- Data Constants ---
const salesData = [
    { name: 'Mon', sales: 4200, orders: 120 },
    { name: 'Tue', sales: 3000, orders: 98 },
    { name: 'Wed', sales: 5000, orders: 154 },
    { name: 'Thu', sales: 2780, orders: 88 },
    { name: 'Fri', sales: 6890, orders: 201 },
    { name: 'Sat', sales: 8390, orders: 245 },
    { name: 'Sun', sales: 3490, orders: 105 },
];

const customerTypeData = [
    { name: 'Active', value: 842, color: '#10B981' },
    { name: 'Inactive', value: 120, color: '#9CA3AF' },
    { name: 'Paused', value: 54, color: '#F59E0B' },
];

const recentSignups = [
    { id: 1, name: 'Rahul Sharma', plan: 'Monthly Veg', date: '2 mins ago', status: 'active' },
    { id: 2, name: 'Priya Verma', plan: 'Weekly Non-Veg', date: '15 mins ago', status: 'pending' },
    { id: 3, name: 'Amit Kumar', plan: 'Trial', date: '1 hour ago', status: 'active' },
];

const pendingApprovals = [
    { id: 1, type: 'Provider', name: 'Spice Kitchen', req: 'Join Request', time: '2h' },
    { id: 2, type: 'Complaint', name: 'Order #2991', req: 'Late Delivery', time: '5h' },
];

const StatCard = ({ title, value, subtext, icon, trend, trendValue, color, delay, onClick }) => (
    <div
        onClick={onClick}
        className={`bg-white/70 backdrop-blur-2xl p-4 rounded-2xl border border-white/60 shadow-md shadow-black/[0.02] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden animate-[fadeIn_0.6s_ease-out] cursor-pointer`}
        style={{ animationDelay: delay }}
    >
        <div className={`absolute -right-6 -top-6 w-20 h-20 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl ${color.replace('text-', 'bg-')}`}></div>
        <div className="flex justify-between items-start mb-2 relative z-10">
            <div className={`size-9 rounded-xl flex items-center justify-center shadow-md shadow-black/5 ${color} bg-current`}>
                <span className="material-symbols-outlined text-[18px] text-white notranslate">{icon}</span>
            </div>
            <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${trend === 'up' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                <span className="material-symbols-outlined text-[10px]">{trend === 'up' ? 'north_east' : 'south_east'}</span>
                {trendValue}
            </div>
        </div>
        <div className="relative z-10">
            <h3 className="text-2xl font-black text-[#1a1614] tracking-tight mb-0.5 group-hover:scale-105 transition-transform origin-left duration-300">{value}</h3>
            <p className="text-[#897a70] text-[10px] font-semibold tracking-wide flex items-center gap-1.5 uppercase">{title}</p>
        </div>
    </div>
);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [showBroadcast, setShowBroadcast] = useState(false);
    const [showLogs, setShowLogs] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [broadcastMsg, setBroadcastMsg] = useState('');
    const [approvals, setApprovals] = useState(pendingApprovals);
    const [systemHealth, setSystemHealth] = useState('Stable');

    const activityLogs = [
        { time: '10:42 AM', event: 'New Kitchen Registered: Spice Kitchen', icon: 'storefront', color: 'text-violet-500' },
        { time: '09:15 AM', event: 'Payout Processed: ₹42,500 (Annapurna Rasoi)', icon: 'payments', color: 'text-emerald-500' },
        { time: '08:30 AM', event: 'System Maintenance Completed', icon: 'settings_suggest', color: 'text-blue-500' },
        { time: '07:45 AM', event: 'Critical: Database Latency Spike (Indore Zone)', icon: 'error_outline', color: 'text-red-500' },
    ];

    const handleGlobalSearch = (e) => {
        if (e.key === 'Enter' && searchQuery) {
            toast(`Searching for "${searchQuery}"...`, { icon: '🔍' });
            navigate(`/admin/customers?search=${searchQuery}`);
        }
    };

    const handleApprove = (id, name) => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1500)),
            {
                loading: `Approving ${name}...`,
                success: `${name} has been approved!`,
                error: 'Process failed.',
            }
        );
        setApprovals(approvals.filter(a => a.id !== id));
    };

    const sendBroadcast = () => {
        if (!broadcastMsg) return toast.error('Message cannot be empty');
        toast.success(`Broadcast sent to all users/providers!`, { icon: '📣' });
        setShowBroadcast(false);
        setBroadcastMsg('');
    };
    return (
        <div className="space-y-4 max-w-[1600px] mx-auto min-h-full pb-4">

            {/* 1. Header & Quick Alerts */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 animate-[fadeIn_0.5s]">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-black text-[#2D241E] tracking-tight">Super Admin Console</h2>
                        <p className="text-[#5C4D42] text-xs font-medium opacity-80">System Overview • {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                    </div>
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
                        <input
                            type="text"
                            placeholder="Quick search user/kitchen..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleGlobalSearch}
                            className="pl-10 pr-4 py-2 bg-white/60 border border-white/50 rounded-2xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-[#2D241E]/10 w-[240px] transition-all"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-xl text-[10px] font-bold text-rose-700 animate-pulse">
                        <span className="material-symbols-outlined text-[14px]">warning</span>
                        2 Critical Alerts
                    </div>
                    <div className="flex items-center gap-2 bg-white/60 p-1 rounded-xl border border-white/50 backdrop-blur-md shadow-sm">
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-[#2D241E] text-white shadow-sm"
                        >
                            Live
                        </button>
                        <button
                            onClick={() => navigate('/admin/reports')}
                            className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-[#5C4D42] hover:bg-white/80"
                        >
                            Reports
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Key Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Revenue"
                    value="₹12.4L"
                    trend="up"
                    trendValue="18%"
                    icon="currency_rupee"
                    color="text-emerald-600"
                    delay="0ms"
                    onClick={() => navigate('/admin/finance')}
                />
                <StatCard
                    title="Active Subs"
                    value="1,842"
                    trend="up"
                    trendValue="120 New"
                    icon="card_membership"
                    color="text-blue-600"
                    delay="100ms"
                    onClick={() => navigate('/admin/customers')}
                />
                <StatCard
                    title="Live Orders"
                    value="428"
                    trend="up"
                    trendValue="Lunch"
                    icon="soup_kitchen"
                    color="text-orange-500"
                    delay="200ms"
                    onClick={() => navigate('/admin/orders')}
                />
                <StatCard
                    title="Providers"
                    value="15"
                    trend="up"
                    trendValue="2 Pending"
                    icon="storefront"
                    color="text-violet-600"
                    delay="300ms"
                    onClick={() => navigate('/admin/providers')}
                />
            </div>

            {/* 3. Main Operations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

                {/* 3.1 Live Operations / Delivery Status (Width: 3/12) */}
                <div className="lg:col-span-3 bg-white/70 backdrop-blur-xl p-4 rounded-[1.5rem] border border-white/60 shadow-lg flex flex-col h-[340px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-[#2D241E] flex items-center gap-2">
                            <span className="size-2 rounded-full bg-red-500 animate-pulse"></span>
                            Live Ops
                        </h3>
                        <span className="text-[10px] font-bold text-[#5C4D42]/60">Lunch Rush</span>
                    </div>

                    <div className="flex-1 flex flex-col justify-center space-y-6 relative">
                        {/* Progress Circle Visual */}
                        <div className="relative size-32 mx-auto">
                            <svg className="size-full rotate-[-90deg]" viewBox="0 0 36 36">
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#FB923C" strokeWidth="3" strokeDasharray="75, 100" className="animate-[dash_1s_ease-out]" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-black text-[#2D241E]">75%</span>
                                <span className="text-[9px] font-bold text-[#5C4D42] uppercase">Delivered</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center pb-2">
                            <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                                <p className="text-[10px] text-emerald-600 font-bold mb-0.5">Done</p>
                                <p className="text-sm font-black text-[#2D241E]">320</p>
                            </div>
                            <div className="p-2 bg-orange-50 rounded-xl border border-orange-100">
                                <p className="text-[10px] text-orange-600 font-bold mb-0.5">Route</p>
                                <p className="text-sm font-black text-[#2D241E]">85</p>
                            </div>
                            <div className="p-2 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-[10px] text-gray-500 font-bold mb-0.5">Left</p>
                                <p className="text-sm font-black text-[#2D241E]">23</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/admin/orders')}
                            className="w-full py-2 bg-[#2D241E] text-white text-[10px] font-black rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-black/5"
                        >
                            View Live Tracker
                        </button>
                    </div>
                </div>

                {/* 3.2 Financial & Growth Graph (Width: 6/12) */}
                <div className="lg:col-span-6 bg-white/70 backdrop-blur-xl p-5 rounded-[1.5rem] border border-white/60 shadow-lg flex flex-col h-[340px]">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-sm font-bold text-[#2D241E]">System Growth</h3>
                            <p className="text-[10px] text-[#5C4D42]">Revenue vs Active Subs</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                {['D', 'W', 'M'].map(t => (
                                    <button key={t} className={`px-2 py-0.5 rounded text-[9px] font-bold ${t === 'W' ? 'bg-white text-[#2D241E] shadow-sm' : 'text-[#897a70]'}`}>{t}</button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <span className="size-2 rounded-full bg-orange-500"></span> <span className="text-[10px] font-bold">Rev</span>
                                <span className="size-2 rounded-full bg-blue-500"></span> <span className="text-[10px] font-bold">Users</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-0 -ml-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FB923C" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#FB923C" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB60" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 9 }} dy={5} />
                                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 9 }} width={30} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 9 }} width={30} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1614', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '10px', padding: '8px' }}
                                    cursor={{ strokeDasharray: '4 4' }}
                                />
                                <Area yAxisId="left" type="monotone" dataKey="sales" stroke="#FB923C" strokeWidth={2} fill="url(#colorRev)" />
                                <Area yAxisId="right" type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={2} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3.3 Approvals & Alerts (Width: 3/12) */}
                <div className="lg:col-span-3 bg-white/70 backdrop-blur-xl p-4 rounded-[1.5rem] border border-white/60 shadow-lg flex flex-col h-[340px]">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-[#2D241E]">Action Needed</h3>
                        <span className="flex items-center justify-center bg-red-100 text-red-600 font-bold text-[10px] px-2 py-0.5 rounded-full">3</span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                        <div className="space-y-3">
                            {/* Approvals */}
                            <div className="text-[10px] font-bold text-[#5C4D42]/60 uppercase tracking-wider mb-2">Pending Approvals</div>
                            {approvals.length === 0 ? (
                                <div className="text-center py-8 opacity-40">
                                    <span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
                                    <p className="text-[10px] font-bold">All clear!</p>
                                </div>
                            ) : approvals.map((item) => (
                                <div key={item.id} className="p-2.5 bg-white/50 rounded-xl border border-white/40 hover:bg-white transition-all cursor-pointer group">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white ${item.type === 'Provider' ? 'bg-violet-500' : 'bg-red-500'}`}>{item.type}</span>
                                        <span className="text-[9px] text-[#5C4D42]">{item.time} ago</span>
                                    </div>
                                    <p className="text-xs font-bold text-[#2D241E] leading-tight">{item.name}</p>
                                    <p className="text-[10px] text-[#5C4D42]">{item.req}</p>
                                    <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleApprove(item.id, item.name)}
                                            className="flex-1 py-1 bg-[#2D241E] text-white text-[9px] font-bold rounded hover:bg-emerald-600 transition-colors"
                                        >
                                            Approve
                                        </button>
                                        <button className="px-2 py-1 bg-gray-200 text-[#5C4D42] text-[9px] font-bold rounded">View</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Platform Health Monitor - [NEW] */}
            <div className="bg-[#2D241E] p-4 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl border border-white/5 relative overflow-hidden group">
                <div className="absolute right-0 top-0 size-40 bg-orange-400/5 blur-[80px] group-hover:bg-orange-400/10 transition-colors"></div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="size-10 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 ring-4 ring-emerald-400/10">
                        <span className="material-symbols-outlined text-[20px]">sensors</span>
                    </div>
                    <div>
                        <h4 className="text-sm font-black italic tracking-tight">Platform System Health</h4>
                        <p className="text-[10px] text-white/50 font-medium">All APIs & Delivery Logistics responding within 120ms.</p>
                    </div>
                </div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="text-center">
                        <p className="text-[9px] font-black text-white/30 uppercase mb-0.5">DB Latency</p>
                        <p className="text-xs font-black">12ms</p>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div className="text-center">
                        <p className="text-[9px] font-black text-white/30 uppercase mb-0.5">Load Balance</p>
                        <p className="text-xs font-black">2.4%</p>
                    </div>
                    <button
                        onClick={() => setShowLogs(true)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-bold transition-all"
                    >
                        View Activity Logs
                    </button>
                </div>
            </div>

            {/* 4. Recent Registrations & Menu Status (Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Registrations */}
                <div className="bg-white/70 backdrop-blur-xl p-4 rounded-2xl border border-white/60 shadow-md">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-bold text-[#2D241E]">Recent Signups</h3>
                        <button onClick={() => navigate('/admin/customers')} className="text-[10px] font-bold text-blue-600 hover:underline">View All</button>
                    </div>
                    <div className="space-y-3">
                        {recentSignups.map((user) => (
                            <div
                                key={user.id}
                                onClick={() => navigate(`/admin/customers?id=${user.id}`)}
                                className="flex items-center gap-3 p-1.5 hover:bg-white/80 rounded-xl cursor-pointer transition-all"
                            >
                                <div className="size-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-white flex items-center justify-center text-xs font-bold text-[#5C4D42]">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-[#2D241E] truncate">{user.name}</p>
                                    <p className="text-[10px] text-[#5C4D42] truncate">{user.plan}</p>
                                </div>
                                <span className={`size-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Today's Menu Preview */}
                <div className="bg-white/70 backdrop-blur-xl p-4 rounded-2xl border border-white/60 shadow-md">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-bold text-[#2D241E]">Today's Menu</h3>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Published</span>
                    </div>
                    <div className="flex gap-2 mb-2">
                        <div className="flex-1 p-2 bg-orange-50 rounded-xl border border-orange-100 text-center">
                            <span className="material-symbols-outlined text-[16px] text-orange-600 mb-1">wb_sunny</span>
                            <p className="text-[10px] font-bold text-[#2D241E]">Rajma Chawal</p>
                            <p className="text-[9px] text-[#5C4D42]">Lunch</p>
                        </div>
                        <div className="flex-1 p-2 bg-indigo-50 rounded-xl border border-indigo-100 text-center">
                            <span className="material-symbols-outlined text-[16px] text-indigo-600 mb-1">dark_mode</span>
                            <p className="text-[10px] font-bold text-[#2D241E]">Paneer Roti</p>
                            <p className="text-[9px] text-[#5C4D42]">Dinner</p>
                        </div>
                    </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => navigate('/admin/plans')}
                        className="bg-[#2D241E] text-white rounded-xl p-3 flex flex-col items-center justify-center gap-1 hover:bg-[#453831] transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                        <span className="text-[10px] font-bold">New Plan</span>
                    </button>
                    <button
                        onClick={() => navigate('/admin/customers')}
                        className="bg-white text-[#2D241E] border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center gap-1 hover:border-orange-500 hover:text-orange-600 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">group_add</span>
                        <span className="text-[10px] font-bold">Add User</span>
                    </button>
                    <button
                        onClick={() => setShowBroadcast(true)}
                        className="bg-white text-[#2D241E] border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center gap-1 hover:border-blue-500 hover:text-blue-600 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">campaign</span>
                        <span className="text-[10px] font-bold">Broadcast</span>
                    </button>
                    <button
                        onClick={() => navigate('/admin/settings')}
                        className="bg-white text-[#2D241E] border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center gap-1 hover:border-red-500 hover:text-red-600 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">settings</span>
                        <span className="text-[10px] font-bold">Settings</span>
                    </button>
                </div>

                {/* Broadcast Modal - [POLISHED] */}
                {showBroadcast && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#2D241E]/80 backdrop-blur-md animate-[fadeIn_0.3s]" onClick={() => setShowBroadcast(false)}></div>
                        <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-[scaleIn_0.3s] relative z-10 border border-white/20">

                            {/* Header */}
                            <div className="p-8 pb-2 flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-black text-[#2D241E] tracking-tight">Global Broadcast</h3>
                                    <p className="text-[11px] font-bold text-[#897a70] mt-1">System-wide alert protocol</p>
                                </div>
                                <button onClick={() => setShowBroadcast(false)} className="size-9 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all">
                                    <span className="material-symbols-outlined text-[18px] text-[#5C4D42]">close</span>
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-black text-[#2D241E] uppercase tracking-widest">Message Content</label>
                                        <span className="text-[9px] font-bold text-gray-400">{broadcastMsg.length}/140</span>
                                    </div>
                                    <textarea
                                        placeholder="Type your announcement here..."
                                        value={broadcastMsg}
                                        onChange={(e) => setBroadcastMsg(e.target.value)}
                                        className="w-full h-32 bg-gray-50/50 border border-gray-100 rounded-2xl p-5 text-sm font-bold text-[#2D241E] focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 outline-none resize-none transition-all placeholder:text-gray-300"
                                    />
                                </div>

                                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-3">
                                    <span className="material-symbols-outlined text-blue-600 text-[18px] mt-0.5">info</span>
                                    <div>
                                        <p className="text-[11px] font-black text-blue-800">Target Audience: All Users</p>
                                        <p className="text-[10px] font-bold text-blue-600/80 leading-tight mt-0.5">This will trigger push notifications for 1,248 active users and 15 providers.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-2">
                                    <button onClick={() => setShowBroadcast(false)} className="flex-1 py-4 rounded-2xl text-xs font-black text-[#897a70] hover:bg-gray-50 transition-all uppercase tracking-widest">Discard</button>
                                    <button onClick={sendBroadcast} className="flex-[2] py-4 bg-[#2D241E] text-white rounded-[1.5rem] text-xs font-black shadow-[0_10px_25px_-5px_rgba(45,36,30,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(45,36,30,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">campaign</span>
                                        Push Broadcast
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}

                {/* Activity Logs Modal - [POLISHED] */}
                {showLogs && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#2D241E]/80 backdrop-blur-md animate-[fadeIn_0.3s]" onClick={() => setShowLogs(false)}></div>
                        <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-[scaleIn_0.3s] relative z-10 border border-white/20">

                            <div className="p-8 pb-2 flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-black text-[#2D241E] tracking-tight">System Logs</h3>
                                    <p className="text-[11px] font-bold text-[#897a70] mt-1">Real-time audit trail monitoring</p>
                                </div>
                                <button onClick={() => setShowLogs(false)} className="size-9 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all">
                                    <span className="material-symbols-outlined text-[18px] text-[#5C4D42]">close</span>
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="max-h-[360px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                    {activityLogs.map((log, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all cursor-default group">
                                            <div className={`size-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center ${log.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                                <span className="material-symbols-outlined text-[20px]">{log.icon}</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[11px] font-black text-[#2D241E]">{log.event}</p>
                                                <p className="text-[9px] font-bold text-[#897a70] uppercase mt-0.5">{log.time}</p>
                                            </div>
                                            <span className="material-symbols-outlined text-gray-300 text-[18px]">verified_user</span>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-[1.5rem] text-[10px] font-black text-[#897a70] uppercase tracking-widest hover:border-[#2D241E]/20 hover:text-[#2D241E] hover:bg-gray-50 transition-all">Download Full Audit Report (PDF)</button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
