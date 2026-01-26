import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

// --- Professional Dummy Data ---
const revenueData = [
    { name: 'Jan', profit: 42000, retention: 85 },
    { name: 'Feb', profit: 30000, retention: 82 },
    { name: 'Mar', profit: 50000, retention: 88 },
    { name: 'Apr', profit: 27800, retention: 84 },
    { name: 'May', profit: 68900, retention: 91 },
    { name: 'Jun', profit: 83900, retention: 94 },
    { name: 'Jul', profit: 34900, retention: 92 },
];

const costStructure = [
    { name: 'Kitchen Pay', value: 65, color: '#F59E0B' },
    { name: 'Delivery', value: 20, color: '#3B82F6' },
    { name: 'Tech/Ops', value: 5, color: '#8B5CF6' },
    { name: 'Net Profit', value: 10, color: '#10B981' },
];

const popularItems = [
    { name: 'Rajma Chawal Special', rating: 4.9, sales: 1250, color: 'bg-orange-500' },
    { name: 'Paneer Butter Masala', rating: 4.8, sales: 840, color: 'bg-indigo-500' },
    { name: 'Dal Makhani Combo', rating: 4.7, sales: 620, color: 'bg-amber-500' },
    { name: 'Chicken Curry Thali', rating: 4.9, sales: 450, color: 'bg-rose-500' },
];

const kitchenPerformance = [
    { name: 'Annapurna', rating: 4.8, onTime: '98%', orders: 1240 },
    { name: 'Spice Route', rating: 4.5, onTime: '92%', orders: 850 },
    { name: 'Home Taste', rating: 4.9, onTime: '99%', orders: 420 },
];

const transactionHistory = [
    { id: '#TRX782', user: 'Amit K.', amount: '₹2,400', type: 'Subscription', status: 'Success', date: 'Just now' },
    { id: '#TRX781', user: 'Priya S.', amount: '₹1,200', type: 'Add-on', status: 'Pending', date: '2h ago' },
    { id: '#TRX780', user: 'Rahul V.', amount: '₹4,500', type: 'Renewal', status: 'Success', date: '5h ago' },
];

const AdminReports = () => {
    const [activeTab, setActiveTab] = useState('Overview');
    const [showReportEngine, setShowReportEngine] = useState(false);
    const [genConfig, setGenConfig] = useState({ range: 'Last 30 Days', metric: 'Summary' });

    const handleGenerate = () => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 2000)),
            {
                loading: 'Synthesizing data models...',
                success: 'Report compiled successfuly!',
                error: 'Generation failed.',
            },
            { style: { borderRadius: '15px' } }
        );
        setShowReportEngine(false);
    };

    const handleAction = (label) => {
        toast.success(`${label} initialized`, {
            style: { borderRadius: '10px', background: '#2D241E', color: '#fff', fontSize: '10px' }
        });
    };

    return (
        <div className="space-y-4 max-w-[1600px] mx-auto min-h-full pb-6 animate-[fadeIn_0.5s]">

            {/* 1. Pro Header */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black text-[#2D241E] tracking-tight flex items-center gap-2">
                        Analytics & Insights
                        <span className="px-2 py-0.5 bg-orange-500 text-white text-[9px] font-black rounded-lg uppercase tracking-wider shadow-lg shadow-orange-500/20">Ultimate Portal</span>
                    </h2>
                    <p className="text-[#5C4D42] text-xs font-medium opacity-80 mt-0.5 font-display italic">Consolidated Business Intelligence Center</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 bg-white/40 p-1.5 rounded-2xl border border-white/60 backdrop-blur-md">
                    {['Overview', 'Finance', 'Menu Perf', 'Retention'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                toast(`Viewing ${tab}`, { icon: '📊', style: { fontSize: '10px' } });
                            }}
                            className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${activeTab === tab ? 'bg-[#2D241E] text-white shadow-md' : 'text-[#5C4D42] hover:bg-white/80'}`}
                        >
                            {tab}
                        </button>
                    ))}
                    <div className="w-px h-4 bg-gray-200 mx-1 hidden sm:block"></div>
                    <button
                        onClick={() => setShowReportEngine(true)}
                        className="flex items-center gap-2 px-6 py-2 bg-[#2D241E] text-white rounded-xl text-[10px] font-black hover:bg-[#453831] transition-all shadow-xl shadow-black/10 uppercase tracking-widest"
                    >
                        <span className="material-symbols-outlined text-[16px] animate-pulse">analytics</span>
                        Run Engine
                    </button>
                </div>
            </div>

            {/* 2. Top Metric Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'EBITDA', val: '₹4.24L', change: '+12.4%', color: 'from-emerald-500 to-emerald-600', sub: 'Net Profit Margin' },
                    { label: 'Retention', val: '94.2%', change: '+3.1%', color: 'from-blue-500 to-indigo-600', sub: 'Monthly Renewal Rate' },
                    { label: 'Churn Rate', val: '2.5%', change: '-1.2%', color: 'from-rose-400 to-rose-600', sub: 'User Attrition Score' },
                    { label: 'Avg Rating', val: '4.85/5', change: '+0.2%', color: 'from-amber-400 to-yellow-600', sub: 'Global Satisfaction' },
                ].map((item, i) => (
                    <div key={i} className="bg-white/70 backdrop-blur-xl p-4 rounded-2xl border border-white/60 shadow-sm group hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold text-[#5C4D42] uppercase tracking-[0.05em]">{item.label}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${item.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{item.change}</span>
                        </div>
                        <h3 className="text-2xl font-black text-[#2D241E] tracking-tight">{item.val}</h3>
                        <p className="text-[10px] text-[#5C4D42]/60 font-medium mt-1">{item.sub}</p>
                        <div className={`h-1 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r ${item.color} mt-3 rounded-full opacity-60`}></div>
                    </div>
                ))}
            </div>

            {/* 3. Middle Section: Growth & Retention Graph */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-8 bg-white/70 backdrop-blur-xl p-5 rounded-[1.75rem] border border-white/60 shadow-lg flex flex-col h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-base font-bold text-[#2D241E]">Profit vs Retention Curve</h3>
                            <p className="text-[10px] text-[#5C4D42] font-semibold">Correlation between service quality & growth</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-emerald-500"></span><span className="text-[10px] font-bold">Net Profit</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-blue-500"></span><span className="text-[10px] font-bold">Retention %</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-0 -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB80" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} dy={5} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1614', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '10px' }}
                                />
                                <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={3} fill="url(#colorProfit)" />
                                <Line type="monotone" dataKey="retention" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6', strokeWidth: 0 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3.2 Menu Popularity & Cost Center */}
                <div className="lg:col-span-4 bg-white/70 backdrop-blur-xl p-5 rounded-[1.75rem] border border-white/60 shadow-lg flex flex-col h-[400px]">
                    <h3 className="text-base font-bold text-[#2D241E] mb-1">Top Performing Dishes</h3>
                    <p className="text-[10px] text-[#5C4D42] font-semibold mb-6">Based on user ratings & order volume</p>

                    <div className="flex-1 space-y-4 overflow-y-auto pr-1 custom-scrollbar">
                        {popularItems.map((item, idx) => (
                            <div key={idx} className="relative p-3 rounded-2xl bg-white/40 border border-white/40 group overflow-hidden">
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.color.replace('bg-', 'bg-')}`}></div>
                                <div className="flex justify-between items-start mb-1.5 relative z-10">
                                    <h4 className="text-xs font-black text-[#2D241E] truncate max-w-[150px]">{item.name}</h4>
                                    <div className="flex items-center gap-0.5 text-amber-500 font-bold text-[10px]">
                                        <span className="material-symbols-outlined text-[12px] fill-current">star</span>
                                        {item.rating}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex-1 bg-gray-100 h-1 rounded-full mr-4">
                                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.sales / 1250) * 100}%` }}></div>
                                    </div>
                                    <span className="text-[10px] font-black text-[#5C4D42]">{item.sales} sold</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-[9px] font-bold text-[#5C4D42]/60 uppercase">Net Yield</p>
                            <p className="text-sm font-black text-emerald-600">88.4% Efficiency</p>
                        </div>
                        <button
                            onClick={() => handleAction('Yield Trends')}
                            className="size-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#2D241E] hover:text-white transition-all"
                        >
                            <span className="material-symbols-outlined text-[18px]">trending_up</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 4. Lower Operational Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                {/* 4.1 Kitchen KPI Monitor */}
                <div className="bg-white/70 backdrop-blur-xl p-5 rounded-[1.75rem] border border-white/60 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-[#2D241E]">Kitchen KPI Monitor</h3>
                        <div className="flex gap-2">
                            <button onClick={() => handleAction('Kitchen Leaderboard')} className="text-[10px] font-bold text-blue-600 px-2 py-1 hover:bg-blue-50 rounded-lg">Leaderboard</button>
                            <button onClick={() => handleAction('Performance Logs')} className="text-[10px] font-bold text-[#5C4D42] px-2 py-1 bg-gray-50 rounded-lg">Logs</button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {kitchenPerformance.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white/40 border border-white/40 rounded-2xl hover:bg-white/60 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 bg-[#2D241E] text-orange-400 rounded-xl flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-110 transition-transform">
                                        {item.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#2D241E]">{item.name}</p>
                                        <p className="text-[10px] text-[#5C4D42]">{item.orders} total cycles</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 text-right">
                                    <div>
                                        <p className="text-[10px] font-bold text-emerald-600">{item.onTime}</p>
                                        <p className="text-[9px] text-[#5C4D42] font-semibold uppercase">On Time</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-0.5 text-[#2D241E] font-black text-[10px]">
                                            <span className="material-symbols-outlined text-[12px] text-amber-500 fill-current">star_half</span>
                                            {item.rating}
                                        </div>
                                        <p className="text-[9px] text-[#5C4D42] font-semibold uppercase">Rating</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4.2 Unit Economics Card (Enhanced) */}
                <div className="bg-white/70 backdrop-blur-xl p-5 rounded-[1.75rem] border border-white/60 shadow-lg flex items-center gap-6">
                    <div className="size-32 relative flex-shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={costStructure}
                                    innerRadius={45}
                                    outerRadius={60}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {costStructure.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-sm font-black text-[#2D241E]">₹4.2L</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-3">
                        <h3 className="text-sm font-black text-[#2D241E]">Current Cost Model</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {costStructure.map((item) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <span className="size-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                                    <span className="text-[10px] font-bold text-[#5C4D42]">{item.name}: {item.value}%</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl relative group">
                            <p className="text-[9px] font-bold text-indigo-700 leading-tight pr-6">Pro Tip: Kitchen payouts are 5% higher this month due to seasonal incentives.</p>
                            <button
                                onClick={() => handleAction('Cost Analysis Tool')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 size-5 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Report Engine Modal - [NEW] */}
            {showReportEngine && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2D241E]/90 backdrop-blur-lg animate-[fadeIn_0.3s]" onClick={() => setShowReportEngine(false)}></div>
                    <div className="bg-white rounded-[3rem] w-full max-w-xl p-10 shadow-2xl animate-[scaleIn_0.3s] relative z-10 border border-white/20">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-3xl font-black text-[#2D241E] italic">Digital Insights Engine</h3>
                                <p className="text-[10px] font-bold text-[#897a70] uppercase tracking-[0.2em] mt-1">Configure Analysis Parameters</p>
                            </div>
                            <button onClick={() => setShowReportEngine(false)} className="size-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all"><span className="material-symbols-outlined">close</span></button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#897a70] uppercase ml-3 tracking-widest">Timeframe</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Last 7 Days', 'Last 30 Days', 'Quarterly'].map(r => (
                                        <button
                                            key={r}
                                            onClick={() => setGenConfig({ ...genConfig, range: r })}
                                            className={`py-3 rounded-2xl text-[10px] font-black transition-all ${genConfig.range === r ? 'bg-[#2D241E] text-white shadow-lg shadow-black/20' : 'bg-gray-100 text-[#5C4D42]'}`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-[#897a70] uppercase ml-3 tracking-widest">Target Metrics</label>
                                <div className="space-y-3">
                                    {[
                                        { id: 'Summary', label: 'Executive Financial Summary', icon: 'finance' },
                                        { id: 'Kitchen', label: 'Detailed Kitchen Performance', icon: 'soup_kitchen' },
                                        { id: 'Retention', label: 'Customer Cohort Retention', icon: 'group_work' },
                                    ].map(m => (
                                        <div
                                            key={m.id}
                                            onClick={() => setGenConfig({ ...genConfig, metric: m.id })}
                                            className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex items-center justify-between ${genConfig.metric === m.id ? 'border-[#2D241E] bg-[#2D241E]/5 shadow-inner' : 'border-gray-100 hover:border-gray-200'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className={`material-symbols-outlined ${genConfig.metric === m.id ? 'text-[#2D241E]' : 'text-gray-400'}`}>{m.icon}</span>
                                                <span className={`text-xs font-black ${genConfig.metric === m.id ? 'text-[#2D241E]' : 'text-[#897a70]'}`}>{m.label}</span>
                                            </div>
                                            {genConfig.metric === m.id && <span className="material-symbols-outlined text-emerald-500">check_circle</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-10">
                            <button onClick={() => setShowReportEngine(false)} className="flex-1 py-5 bg-gray-100 text-[#5C4D42] rounded-[2rem] font-black text-xs hover:bg-gray-200 transition-all">Discard View</button>
                            <button onClick={handleGenerate} className="flex-1 py-5 bg-[#2D241E] text-white rounded-[2rem] font-black text-xs shadow-2xl shadow-black/20 hover:bg-blue-600 transition-all uppercase tracking-widest">Compile Report</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AdminReports;
