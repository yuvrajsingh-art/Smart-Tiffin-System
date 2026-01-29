import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { createPortal } from 'react-dom';
import AdminStatCard from '../../components/admin/AdminStatCard';

// --- Data Constants ---
// --- Data Constants ---
// Empty initial states to prevent flicker
const initialStats = {
    grossRevenue: 0,
    totalCustomers: 0,
    liveOrders: 0,
    salesGrowth: [],
    recentSignups: [],
    pendingApprovals: [],
    deliveryMetrics: { settled: 0, transit: 0, staged: 0, completionRate: 0 },
    activityLogs: [],
    systemHealth: { nodeStatus: "Nominal", latency: "0ms", activeConnections: 0, lastBackup: "Never", cpuLoad: "0%" },
    marquee: ["Initializing System..."]
};



const AdminDashboard = () => {
    const navigate = useNavigate();
    const [showBroadcast, setShowBroadcast] = useState(false);
    const [showLogs, setShowLogs] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [broadcastMsg, setBroadcastMsg] = useState('');
    const [approvals, setApprovals] = useState([]);
    const [systemHealth, setSystemHealth] = useState('Stable');
    const [loading, setLoading] = useState(true);

    // 🔹 Real-time Stats State
    const [stats, setStats] = useState(initialStats);

    // 🔹 Fetch Stats from Backend
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('/api/admin/stats');
                if (data.success) {
                    setStats({
                        ...data.data,
                        salesGrowth: data.data.salesGrowth.map(d => ({
                            name: d._id.slice(5).replace('-', '/'), // "2024-01-30" -> "01/30"
                            sales: d.sales,
                            orders: d.orders
                        }))
                    });
                    // Approval queue state sync
                    setApprovals(data.data.pendingApprovals.map(apr => ({
                        id: apr._id,
                        type: 'Provider',
                        name: apr.fullName,
                        req: 'Join Request',
                        time: new Date(apr.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        email: apr.email
                    })));
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
                // Optionally set error state here
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);



    const handleGlobalSearch = (e) => {
        if (e.key === 'Enter' && searchQuery) {
            toast(`Searching for "${searchQuery}"...`, { icon: '🔍' });
            navigate(`/admin/customers?search=${searchQuery}`);
        }
    };

    const handleApprove = async (id, name) => {
        const toastId = toast.loading(`Approving ${name}...`, { style: { background: '#2D241E', color: '#fff', fontSize: '10px' } });
        try {
            const { data } = await axios.put(`/api/admin/providers/${id}/verify`);
            if (data.success) {
                toast.success(`${name} has been approved!`, {
                    id: toastId,
                    style: { background: '#2D241E', color: '#fff', fontSize: '10px', fontWeight: 'bold' }
                });
                setApprovals(approvals.filter(a => a.id !== id));
            }
        } catch (error) {
            toast.error("Approval failed", { id: toastId });
        }
    };

    const sendBroadcast = async () => {
        if (!broadcastMsg) return toast.error('Message cannot be empty');

        try {
            const { data } = await axios.post('/api/admin/broadcast', { message: broadcastMsg });
            if (data.success) {
                toast.success(`Broadcast sent to all users/providers!`, {
                    icon: '📣',
                    style: { background: '#2D241E', color: '#fff', fontSize: '10px', fontWeight: 'bold' }
                });
                setShowBroadcast(false);
                setBroadcastMsg('');
            }
        } catch (error) {
            toast.error("Failed to send broadcast");
        }
    };

    const marqueeStyles = `
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .animate-marquee {
            animation: marquee 40s linear infinite;
        }
        .pause:hover .animate-marquee {
            animation-play-state: paused;
        }
    `;

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto min-h-screen pb-10 animate-[fadeIn_0.5s] relative">
            <style>{marqueeStyles}</style>
            {/* Texture Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2D241E 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

            {/* 1. Global Ticker (Master Console) */}
            <div className="w-full bg-[#241C16]/95 backdrop-blur-md text-white overflow-hidden py-2 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center gap-4 px-5 relative z-20 border border-white/5 group">
                {/* Status Indicator */}
                <div className="flex items-center gap-3 shrink-0 z-10 bg-[#241C16] pr-4 border-r border-white/10 relative">
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/50 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 leading-none">Console</span>
                        <span className="text-[11px] font-bold text-white tracking-tight">MASTER_NODE</span>
                    </div>
                </div>

                {/* Live Marquee */}
                <div className="flex-1 overflow-hidden pause">
                    <div className="flex gap-12 animate-marquee whitespace-nowrap opacity-90 transition-opacity">
                        {(stats.marquee && stats.marquee.length > 0 ? stats.marquee : [
                            "System Cluster: IND-WEST-1 Operational",
                            "Security Level: RED-WOLF Verified",
                            "Network Latency: Optimal",
                            "Database Integrity: 100% Guaranteed"
                        ]).map((item, i) => (
                            <span key={i} className="text-[10px] font-bold flex items-center gap-3 text-white/80 hover:text-white transition-colors cursor-default">
                                <span className="material-symbols-outlined text-[14px] text-orange-500/50">token</span>
                                {item}
                            </span>
                        ))}
                    </div>
                </div>

                {/* System Monitors (Right Side) */}
                <div className="hidden lg:flex items-center gap-6 pl-4 border-l border-white/10 bg-[#241C16]">
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Latency</span>
                        <span className="text-[11px] font-bold text-emerald-400 italic">{stats.systemHealth.latency || '14ms'}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Load</span>
                        <span className="text-[11px] font-bold text-blue-400 italic">{stats.systemHealth.cpuLoad || '2.4%'}</span>
                    </div>
                    <button className="size-8 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
                        <span className="material-symbols-outlined text-[16px] text-orange-500">settings_input_antenna</span>
                    </button>
                </div>
            </div>

            {/* 2. Golden Header Block */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-[#2D241E] tracking-tight uppercase">Dashboard Ops</h1>
                        <span className="px-2 py-0.5 bg-[#2D241E] text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-lg shadow-black/10">MASTER_NODE</span>
                    </div>
                    <p className="text-[#897a70] text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-emerald-500"></span>
                        Real-time Intelligence Hub • {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px] group-focus-within:text-[#2D241E] transition-colors">search</span>
                        <input
                            type="text"
                            placeholder="QUICK SEARCH ENTITIES..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleGlobalSearch}
                            className="pl-10 pr-4 py-3 bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl text-[10px] font-bold outline-none focus:ring-4 focus:ring-[#2D241E]/5 w-[280px] transition-all uppercase placeholder:text-gray-300 shadow-lg"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xl p-1 rounded-2xl border border-white/60 shadow-lg">
                        <button className="px-5 py-2 rounded-xl text-[10px] font-bold bg-[#2D241E] text-white shadow-xl shadow-black/20 uppercase tracking-wider">Live View</button>
                        <button onClick={() => navigate('/admin/reports')} className="px-5 py-2 rounded-xl text-[10px] font-bold text-[#5C4D42] hover:bg-white/80 uppercase tracking-wider transition-all">Report Hub</button>
                    </div>
                    <button onClick={() => setShowBroadcast(true)} className="size-11 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 hover:scale-110 active:scale-95 transition-all">
                        <span className="material-symbols-outlined text-[20px]">campaign</span>
                    </button>
                </div>
            </div>

            {/* Remove the old Ticker below header */}
            <div className="flex gap-4 overflow-hidden py-3 px-6 bg-[#2D241E] rounded-[1.5rem] shadow-2xl relative group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                {[
                    { label: 'Latency', val: '14ms', icon: 'bolt', col: 'text-emerald-400' },
                    { label: 'Ops Load', val: '2.4%', icon: 'analytics', col: 'text-blue-400' },
                    { label: 'Buffer', val: '99.9%', icon: 'check_circle', col: 'text-indigo-400' },
                    { label: 'Indore_Node', val: 'v2.4.0', icon: 'dns', col: 'text-orange-400' },
                ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-2.5 shrink-0 border-r border-white/10 pr-8 last:border-0">
                        <span className={`material-symbols-outlined text-[15px] ${stat.col}`}>{stat.icon}</span>
                        <div>
                            <p className="text-xs font-bold text-white/30 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-xs font-bold text-white">{stat.val}</p>
                        </div>
                    </div>
                ))}
                <div className="flex-1"></div>
                <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                    <span className="size-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">2 Alert Flags</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <AdminStatCard
                    title="Gross Revenue"
                    value={`₹${(stats.grossRevenue || 0).toLocaleString()}`}
                    trend="up"
                    trendValue="+18.4%"
                    icon="payments"
                    color="text-emerald-600"
                    delay="0ms"
                    onClick={() => navigate('/admin/finance')}
                />
                <AdminStatCard
                    title="Active Members"
                    value={stats.totalCustomers || 0}
                    trend="up"
                    trendValue="+12.5%"
                    icon="group"
                    color="text-blue-600"
                    delay="100ms"
                    onClick={() => navigate('/admin/customers')}
                />
                <AdminStatCard
                    title="Live Orders"
                    value={stats.liveOrders || 0}
                    trend="up"
                    trendValue="RUSH"
                    icon="lunch_dining"
                    color="text-orange-500"
                    delay="200ms"
                    onClick={() => navigate('/admin/orders')}
                />
                <AdminStatCard
                    title="Partner Nodes"
                    value={`${stats.totalProviders || 0} Nodes`}
                    trend="up"
                    trendValue="ACTIVE"
                    icon="hub"
                    color="text-violet-600"
                    delay="300ms"
                    onClick={() => navigate('/admin/providers')}
                />
            </div>

            {/* 3. Main Operations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

                {/* 3.1 Live Operations / Delivery Status (Width: 3/12) */}
                <div className="lg:col-span-3 bg-white/70 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/60 shadow-lg flex flex-col h-[380px] relative overflow-hidden group">
                    <div className="absolute -top-24 -right-24 size-48 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors"></div>
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <h3 className="text-xs font-bold text-[#2D241E] uppercase tracking-wider flex items-center gap-2">
                            <span className="size-2 rounded-full bg-red-500 animate-pulse"></span>
                            Live Delivery Ops
                        </h3>
                        <span className="text-xs font-bold text-[#897a70] uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-lg italic">Lunch_Pulse</span>
                    </div>

                    <div className="flex-1 flex flex-col justify-center space-y-8 relative z-10">
                        {/* Refined Progress Circle */}
                        <div className="relative size-40 mx-auto">
                            <svg className="size-full rotate-[-90deg]" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="transparent" stroke="#E5E7EB60" strokeWidth="2.5" />
                                <circle cx="18" cy="18" r="16" fill="transparent" stroke="#FB923C" strokeWidth="2.5" strokeDasharray={`${stats.deliveryMetrics.completionRate}, 100`} strokeLinecap="round" className="animate-[dash_1.5s_ease-out]" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold text-[#2D241E] tracking-tight">{stats.deliveryMetrics.completionRate}%</span>
                                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mt-1">Completion</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: 'Settled', val: stats.deliveryMetrics.settled, col: 'text-emerald-600', bg: 'bg-emerald-50' },
                                { label: 'Transit', val: stats.deliveryMetrics.transit, col: 'text-orange-600', bg: 'bg-orange-50' },
                                { label: 'Staged', val: stats.deliveryMetrics.staged, col: 'text-gray-500', bg: 'bg-gray-50' },
                            ].map((s, i) => (
                                <div key={i} className={`p-3 ${s.bg} rounded-2xl border border-white flex flex-col items-center justify-center shadow-sm`}>
                                    <p className={`text-[10px] ${s.col} font-bold uppercase tracking-tight mb-1`}>{s.label}</p>
                                    <p className="text-base font-bold text-[#2D241E]">{s.val}</p>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => navigate('/admin/orders')}
                            className="w-full py-4 bg-[#2D241E] text-white text-xs font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-black/10 uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            Open Command Tracker
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                    </div>
                </div>

                {/* 3.2 Financial & Growth Graph (Width: 6/12) */}
                <div className="lg:col-span-6 bg-white/70 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/60 shadow-lg flex flex-col h-[380px] relative overflow-hidden group">
                    <div className="absolute -bottom-24 -left-24 size-48 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <div>
                            <h3 className="text-xs font-bold text-[#2D241E] uppercase tracking-wider italic">System Growth Matrix</h3>
                            <p className="text-xs text-[#897a70] font-bold uppercase tracking-wider mt-0.5 opacity-80">Revenue Volatility vs Node Expansion</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex bg-white/80 p-1 rounded-xl shadow-sm border border-gray-100">
                                {['D', 'W', 'M'].map(t => (
                                    <button key={t} className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all ${t === 'W' ? 'bg-[#2D241E] text-white shadow-lg shadow-black/20' : 'text-[#897a70] hover:text-[#2D241E]'}`}>{t}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-0 relative z-10">
                        <div className="absolute top-0 right-0 flex gap-4 pr-4">
                            <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-orange-500 shadow-lg"></span><span className="text-xs font-bold uppercase tracking-wider text-[#5C4D42]">Revenue</span></div>
                            <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-blue-500 shadow-lg"></span><span className="text-xs font-bold uppercase tracking-wider text-[#5C4D42]">Subs</span></div>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">

                            <AreaChart data={stats.salesGrowth} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FB923C" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#FB923C" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#897a70', fontSize: 9, fontWeight: 900 }} dy={10} />
                                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#897a70', fontSize: 9, fontWeight: 900 }} width={40} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#2D241E', borderRadius: '16px', border: 'none', color: '#fff', fontSize: '9px', fontWeight: '900', padding: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                    cursor={{ stroke: '#2D241E', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area yAxisId="left" type="monotone" dataKey="sales" stroke="#FB923C" strokeWidth={3} fill="url(#colorRev)" />
                                <Area yAxisId="left" type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={3} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3.3 Approvals & Alerts (Width: 3/12) */}
                <div className="lg:col-span-3 bg-white/70 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/60 shadow-lg flex flex-col h-[380px] relative overflow-hidden group">
                    <div className="absolute top-0 left-0 size-full bg-[#F5F2EB]/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <h3 className="text-xs font-bold text-[#2D241E] uppercase tracking-wider">Approval Queue</h3>
                        <span className="flex items-center justify-center bg-rose-500 text-white font-bold text-xs px-2 py-0.5 rounded-lg shadow-lg shadow-rose-500/20">{approvals.length}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar relative z-10">
                        <div className="space-y-4">
                            {approvals.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="size-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                                        <span className="material-symbols-outlined text-emerald-500 text-3xl">done_all</span>
                                    </div>
                                    <p className="text-xs font-bold text-[#2D241E] uppercase tracking-wider italic opacity-40">All Requests Synced</p>
                                </div>
                            ) : approvals.map((item) => (
                                <div key={item.id} className="p-3.5 bg-white border border-gray-100 rounded-2xl hover:border-orange-200 hover:shadow-md transition-all group/card cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg text-white shadow-sm uppercase tracking-wider ${item.type === 'Provider' ? 'bg-violet-500' :
                                            item.type === 'Menu' ? 'bg-orange-500' :
                                                item.type === 'Plan' ? 'bg-indigo-500' :
                                                    'bg-rose-500'
                                            }`}>{item.type}</span>
                                        <span className="text-[10px] font-bold text-[#897a70] uppercase italic">{item.time}</span>
                                    </div>
                                    <p className="text-sm font-bold text-[#2D241E] leading-tight mb-1">{item.name}</p>
                                    <p className="text-xs font-bold text-[#897a70] uppercase tracking-tight">{item.req}</p>
                                    <div className="flex gap-2 mt-4 opacity-0 group-hover/card:opacity-100 transition-all translate-y-2 group-hover/card:translate-y-0">
                                        <button
                                            onClick={() => handleApprove(item.id, item.name)}
                                            className="flex-1 py-2 bg-[#2D241E] text-white text-[10px] font-bold rounded-xl hover:bg-emerald-600 transition-all uppercase tracking-wider"
                                        >
                                            Approve
                                        </button>
                                        <button className="px-4 py-2 bg-gray-50 border border-gray-100 text-[#5C4D42] text-[10px] font-bold rounded-xl uppercase tracking-wider">Detail</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Platform Health Monitor */}
            <div className="bg-[#2D241E] p-6 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border border-white/5 relative overflow-hidden group mx-0.5">
                <div className="absolute right-0 top-0 size-64 bg-orange-400/5 blur-[100px] group-hover:bg-orange-400/10 transition-colors duration-1000"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="size-12 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400 ring-4 ring-emerald-400/10 shadow-lg">
                        <span className="material-symbols-outlined text-[24px]">sensors</span>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold italic tracking-tight uppercase">System Health</h4>
                        <p className="text-xs text-white/40 font-bold uppercase tracking-wider mt-0.5">Live Status: <span className="text-emerald-400">Stable</span></p>
                    </div>
                </div>
                <div className="flex items-center gap-8 relative z-10 pr-2">
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">Speed</p>
                        <p className="text-sm font-bold italic">14ms</p>
                    </div>
                    <div className="w-px h-10 bg-white/10"></div>
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">Traffic</p>
                        <p className="text-sm font-bold italic">Async_Safe</p>
                    </div>
                    <button
                        onClick={() => setShowLogs(true)}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 hover:shadow-2xl border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 group/btn"
                    >
                        View Logs
                        <span className="material-symbols-outlined text-[16px] group-hover/btn:translate-x-1 transition-transform">list_alt</span>
                    </button>
                </div>
            </div>

            {/* 4. Secondary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Recent Registrations */}
                <div className="bg-white/70 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/60 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 size-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
                    <div className="flex justify-between items-center mb-5 relative z-10">
                        <h3 className="text-xs font-bold text-[#2D241E] uppercase tracking-wider">Terminal Signups</h3>
                        <button onClick={() => navigate('/admin/customers')} className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider">Global Index</button>
                    </div>
                    <div className="space-y-4 relative z-10 min-h-[200px]">
                        {stats.recentSignups.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full opacity-50 py-10">
                                <span className="material-symbols-outlined text-4xl mb-2 text-[#2D241E]">person_off</span>
                                <p className="text-xs font-bold uppercase text-[#897a70]">No Recent Scans</p>
                            </div>
                        ) : stats.recentSignups.map((user) => (
                            <div
                                key={user._id || user.id}
                                onClick={() => navigate(`/admin/customers?id=${user._id || user.id}`)}
                                className="flex items-center gap-4 p-2 bg-white/40 border border-white/40 rounded-2xl cursor-pointer hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                <div className="size-10 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-white/60 flex items-center justify-center text-xs font-bold text-indigo-600 shadow-sm">
                                    {(user.fullName || user.name || 'User').charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-[#2D241E] truncate italic">{user.fullName || user.name || 'Unknown User'}</p>
                                    <p className="text-xs font-bold text-[#897a70] uppercase tracking-tight">{user.email || user.plan || 'No Details'}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`size-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'} shadow-lg`}></span>
                                    <p className="text-[10px] font-bold text-[#897a70] uppercase">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : (user.date ? user.date.split(' ')[0] + 'm' : 'Now')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Today's Menu Monitor */}
                <div className="bg-white/70 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/60 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 size-32 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/10 transition-colors"></div>
                    <div className="flex justify-between items-center mb-5 relative z-10">
                        <h3 className="text-xs font-bold text-[#2D241E] uppercase tracking-wider">Global Menu State</h3>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider italic shadow-sm">Distributed_Live</span>
                    </div>
                    <div className="flex gap-4 mb-3 relative z-10">
                        <div className="flex-1 p-4 bg-orange-50/50 rounded-[1.5rem] border border-orange-100/50 text-center hover:bg-orange-50 hover:shadow-lg transition-all cursor-default">
                            <span className="material-symbols-outlined text-[20px] text-orange-600 mb-2">sunny</span>
                            <p className="text-sm font-bold text-[#2D241E] uppercase tracking-tight">Rajma Chawal</p>
                            <p className="text-xs font-bold text-[#897a70] uppercase tracking-wider mt-0.5">Lunch Cycle</p>
                        </div>
                        <div className="flex-1 p-4 bg-indigo-50/50 rounded-[1.5rem] border border-indigo-100/50 text-center hover:bg-indigo-50 hover:shadow-lg transition-all cursor-default">
                            <span className="material-symbols-outlined text-[20px] text-indigo-600 mb-2">nightlight</span>
                            <p className="text-sm font-bold text-[#2D241E] uppercase tracking-tight">Shahi Paneer</p>
                            <p className="text-xs font-bold text-[#897a70] uppercase tracking-wider mt-0.5">Dinner Cycle</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/admin/menu')} className="w-full py-3 mt-1 bg-white/60 border border-white/40 text-xs font-bold text-[#5C4D42] rounded-xl hover:bg-white hover:text-[#2D241E] uppercase tracking-wider transition-all shadow-sm">Access Menu Protocol</button>
                </div>

                {/* Operations Control */}
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: 'New Master Plan', icon: 'auto_awesome', path: '/admin/plans', col: 'bg-[#2D241E]', text: 'text-white' },
                        { label: 'Register Cluster', icon: 'person_add', path: '/admin/customers', col: 'bg-white', text: 'text-[#2D241E]' },
                        { label: 'Node Settings', icon: 'manufacturing', path: '/admin/settings', col: 'bg-white', text: 'text-[#2D241E]' },
                        { label: 'Financial Vault', icon: 'token', path: '/admin/finance', col: 'bg-white', text: 'text-[#2D241E]' },
                    ].map((btn, i) => (
                        <button
                            key={i}
                            onClick={() => navigate(btn.path)}
                            className={`${btn.col} ${btn.text} rounded-[1.5rem] p-4 flex flex-col items-center justify-center gap-2 border border-black/5 hover:scale-[1.05] active:scale-[0.95] transition-all shadow-xl hover:shadow-2xl relative overflow-hidden group`}
                        >
                            <div className="absolute -top-4 -right-4 size-10 bg-white/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="material-symbols-outlined text-[22px]">{btn.icon}</span>
                            <span className="text-xs font-bold uppercase tracking-wider text-center">{btn.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Broadcast Modal - Cream Upgrade */}
            {
                showBroadcast && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#2D241E]/80 backdrop-blur-md animate-[fadeIn_0.3s]" onClick={() => setShowBroadcast(false)}></div>
                        <div className="bg-[#F5F2EB] rounded-[3rem] w-full max-w-lg overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] animate-[scaleIn_0.3s] relative z-10 border-[12px] border-white ring-1 ring-black/5">
                            {/* Static Texture Overlay */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(#2D241E 1px, transparent 1px)`, backgroundSize: '20px 20px' }}></div>

                            <div className="p-10 relative z-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h3 className="text-2xl font-bold text-[#2D241E] tracking-tight">Broadcast Message</h3>
                                        <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mt-1">Send to everyone</p>
                                    </div>
                                    <button onClick={() => setShowBroadcast(false)} className="size-10 rounded-2xl bg-white flex items-center justify-center shadow-lg hover:rotate-90 transition-all duration-500">
                                        <span className="material-symbols-outlined text-[20px] text-[#2D241E]">close</span>
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center ml-2">
                                            <label className="text-xs font-bold text-[#2D241E] uppercase tracking-wider">Your Message</label>
                                            <span className="px-2 py-0.5 bg-white rounded-md text-[10px] font-bold text-[#897a70] shadow-sm">{broadcastMsg.length}/140</span>
                                        </div>
                                        <textarea
                                            placeholder="Type your announcement here..."
                                            value={broadcastMsg}
                                            onChange={(e) => setBroadcastMsg(e.target.value)}
                                            className="w-full h-36 bg-white border-2 border-transparent focus:border-orange-500/20 rounded-[2.5rem] p-6 text-xs font-bold text-[#2D241E] shadow-inner outline-none resize-none transition-all placeholder:text-gray-200 uppercase"
                                        />
                                    </div>

                                    <div className="p-5 bg-[#2D241E] rounded-[2.5rem] flex items-start gap-4 shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 size-20 bg-blue-500/10 rounded-full blur-2xl"></div>
                                        <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400">
                                            <span className="material-symbols-outlined text-[20px]">hub</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white uppercase tracking-wider">Sending To</p>
                                            <p className="text-[10px] font-bold text-white/40 leading-snug mt-1 uppercase">All Customers + All Kitchen Providers</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <button onClick={() => setShowBroadcast(false)} className="py-4 rounded-2xl text-xs font-bold text-[#897a70] uppercase tracking-wider hover:bg-white transition-all">Cancel</button>
                                        <button onClick={sendBroadcast} className="py-4 bg-[#2D241E] text-white rounded-[1.5rem] text-xs font-bold uppercase tracking-wider shadow-2xl hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group">
                                            Send Now
                                            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">send</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }

            {/* System Logs Modal - Cream Upgrade */}
            {
                showLogs && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#2D241E]/80 backdrop-blur-md animate-[fadeIn_0.3s]" onClick={() => setShowLogs(false)}></div>
                        <div className="bg-[#F5F2EB] rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] animate-[scaleIn_0.3s] relative z-10 border-[12px] border-white ring-1 ring-black/5">
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(#2D241E 1px, transparent 1px)`, backgroundSize: '15px 15px' }}></div>

                            <div className="p-10 relative z-10">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h3 className="text-2xl font-bold text-[#2D241E] tracking-tight">System Activity</h3>
                                        <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mt-1">Live Updates & Events</p>
                                    </div>
                                    <button onClick={() => setShowLogs(false)} className="size-10 rounded-2xl bg-white flex items-center justify-center shadow-lg hover:rotate-90 transition-all duration-500">
                                        <span className="material-symbols-outlined text-[20px] text-[#2D241E]">close</span>
                                    </button>
                                </div>

                                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-3 custom-scrollbar">
                                    {stats.activityLogs.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-48 opacity-50">
                                            <span className="material-symbols-outlined text-4xl mb-2 text-[#2D241E]">history_toggle_off</span>
                                            <p className="text-xs font-bold uppercase text-[#897a70]">No Recent Activity</p>
                                        </div>
                                    ) : stats.activityLogs.map((log, i) => (
                                        <div key={i} className="flex items-center gap-5 p-4 bg-white/60 border border-white rounded-[1.5rem] hover:bg-white hover:shadow-xl hover:scale-[1.01] transition-all cursor-default group">
                                            <div className={`size-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center ${log.color} shadow-sm group-hover:bg-[#2D241E] group-hover:text-white transition-all duration-500`}>
                                                <span className="material-symbols-outlined text-[20px]">{log.icon}</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-[#2D241E] uppercase tracking-tight italic">{log.event}</p>
                                                <p className="text-[10px] font-bold text-[#897a70] uppercase opacity-60 mt-0.5 flex items-center gap-2">
                                                    <span className="size-1 rounded-full bg-gray-300"></span>
                                                    {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            <span className="material-symbols-outlined text-gray-200 text-[20px] group-hover:text-emerald-500 transition-colors">verified</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                                    <p className="text-xs font-bold text-[#897a70] uppercase tracking-wider italic">Live Feed Connected • Cluster_01</p>
                                    <button className="px-6 py-3 bg-[#2D241E] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xl hover:bg-indigo-600 transition-all">Extract PDF Journal</button>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }
        </div >
    );
};

export default AdminDashboard;
