import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
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
    const [showReportEngine, setShowReportEngine] = useState(false); // Reporting System
    const [genConfig, setGenConfig] = useState({ range: 'Last 30 Days', metric: 'Summary' });
    const [isGenerating, setIsGenerating] = useState(false);

    // Mock Data States - Simulating dynamic reports
    const [currentRevenueData, setCurrentRevenueData] = useState(revenueData);
    const [metrics, setMetrics] = useState([
        { label: 'EBITDA', val: 424000, change: '+12.4%', color: 'from-emerald-500 to-emerald-600', sub: 'Net Profit Margin', prefix: '₹', suffix: 'L' },
        { label: 'Avg Delivery', val: 28, change: '-2.1%', color: 'from-blue-500 to-indigo-600', sub: 'Order Fulfillment Time', prefix: '', suffix: 'm' },
        { label: 'Churn Rate', val: 2.5, change: '-1.2%', color: 'from-rose-400 to-rose-600', sub: 'User Attrition Score', prefix: '', suffix: '%' },
        { label: 'Avg Rating', val: 4.85, change: '+0.2%', color: 'from-amber-400 to-yellow-600', sub: 'Global Satisfaction', prefix: '', suffix: '/5' },
    ]);

    const [genLogs, setGenLogs] = useState([]);
    const [showDrilldown, setShowDrilldown] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState(null);
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditStep, setAuditStep] = useState(0); // 0: Idle, 1: Scanning, 2: Validating, 3: Completed

    const handleGenerate = () => {
        setIsGenerating(true);
        setGenLogs(["Initializing Intelligence Hub...", "Establishing secure bridge to Regional Data...", "Fetching transactional updates (JSON)..."]);

        const possibleLogs = [
            "Normalizing unit economics for Q1...",
            "Merging retention curves...",
            "Analyzing kitchen latencies (Regional Hub)...",
            "Calculating churn coefficients...",
            "Optimizing resource allocation vectors...",
            "Finalizing executive summary..."
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < possibleLogs.length) {
                setGenLogs(prev => [...prev.slice(-3), possibleLogs[i]]);
                i++;
            } else {
                clearInterval(interval);
                setIsGenerating(false);
                setShowReportEngine(false);
                setGenLogs([]);

                // Randomize Chart Data
                const newData = revenueData.map(d => ({
                    ...d,
                    profit: d.profit + Math.floor(Math.random() * 5000),
                    retention: Math.min(100, d.retention + Math.floor(Math.random() * 3))
                }));
                setCurrentRevenueData(newData);

                // Randomize Metrics
                setMetrics(prev => prev.map(m => ({
                    ...m,
                    val: m.label === 'EBITDA' ? m.val + Math.floor(Math.random() * 10000) :
                        m.label === 'Avg Rating' ? Math.min(5, m.val + (Math.random() * 0.05)) :
                            m.label === 'Churn Rate' ? Math.max(0, m.val - (Math.random() * 0.1)) :
                                m.val
                })));

                // Contextual Auto-Tab Switch
                if (genConfig.metric === 'Summary') setActiveTab('Overview');
                if (genConfig.metric === 'Kitchen') setActiveTab('Menu Perf');
                if (genConfig.metric === 'Retention') setActiveTab('Retention');

                toast.success(`Report Compiled: ${genConfig.metric}`, {
                    icon: '📑',
                    style: { borderRadius: '15px', background: '#2D241E', color: '#fff' }
                });
            }
        }, 400);
    };

    const handleTriggerAudit = () => {
        setIsAuditing(true);
        setAuditStep(1);

        toast('Audit Initialized: Scanning System Servers', { icon: '🔍', style: { borderRadius: '15px', background: '#2D241E', color: '#fff' } });

        setTimeout(() => {
            setAuditStep(2);
            toast('Compliance Check: Data Validation', { icon: '🛡️', style: { borderRadius: '15px', background: '#2D241E', color: '#fff' } });

            setTimeout(() => {
                setAuditStep(3);
                toast.success('Audit Completed: Certificate Issued', { style: { borderRadius: '15px', background: '#2D241E', color: '#fff' } });

                setTimeout(() => {
                    setIsAuditing(false);
                    setAuditStep(0);
                }, 2000);
            }, 2500);
        }, 2000);
    };

    const handleAction = (label) => {
        if (label.includes('Drilldown')) {
            const metricKey = label.replace(' Drilldown', '');
            setSelectedMetric(metricKey);
            setShowDrilldown(true);
            return;
        }

        let msg = `${label} initialized`;
        let icon = '🚀';

        if (label.includes('Drilldown')) {
            msg = `Opening detailed analysis for ${label.replace(' Drilldown', '')}...`;
            icon = '📉';
        } else if (label.includes('Restocking')) {
            msg = `Stock alert sent to inventory for ${label.replace('Restocking ', '')}`;
            icon = '📦';
        } else if (label.includes('Kitchen Leaderboard')) {
            msg = "Fetching global kitchen rankings...";
            icon = '🏆';
        } else if (label.includes('logs') || label.includes('Logs')) {
            msg = "Retrieving system access logs...";
            icon = 'security';
        } else if (label.includes('Cost Analysis')) {
            msg = "Opening Unit Economics Modeler...";
            icon = 'account_balance';
        } else if (label.includes('Full Ledger')) {
            msg = "Downloading Q1 2026 Transaction History (PDF)...";
            icon = 'cloud_download';
        } else if (label.includes('Transaction')) {
            msg = "Opening Receipt View...";
            icon = 'receipt';
        } else if (label.includes('Edit')) {
            msg = "Opening Menu Editor Mode...";
            icon = 'edit_note';
        } else if (label.includes('Audit')) {
            handleTriggerAudit();
            return;
        } else if (label.includes('Contacting') || label.includes('Reach Out')) {
            msg = `Dialing secure line to ${label.replace('Contacting ', '').replace('Reach Out ', '')}...`;
            icon = 'call';
        } else if (label.includes('Matrix')) {
            msg = `Generating sales-vs-satisfaction analytics for ${label.replace('View Matrix for ', '')}...`;
            icon = 'grid_view';
        } else if (label.includes('Report') || label.includes('Export')) {
            msg = "Exporting granular dataset to CSV/PDF...";
            icon = 'database';
        }

        toast.success(msg, {
            icon: icon,
            style: {
                borderRadius: '12px',
                background: '#2D241E',
                color: '#fff',
                fontSize: '10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255,255,255,0.1)'
            }
        });
    };

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto min-h-screen pb-10 relative">


            {/* 2. Golden Header Block */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-[#2D241E] tracking-tight uppercase">Analytics & Intelligence</h1>
                        <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-lg shadow-orange-500/10">Reporting Hub</span>
                    </div>
                    <p className="text-[#897a70] text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Consolidated Business Intelligence Center
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-white/40 p-1.5 rounded-2xl border border-white/60 backdrop-blur-md relative z-10">
                    <div className="flex gap-1">
                        {['Overview', 'Finance', 'Menu Perf', 'Retention'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setActiveTab(tab);
                                    toast(`Viewing ${tab} Dashboard`, { icon: '📊', style: { fontSize: '12px' } });
                                }}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-[#2D241E] text-white shadow-md scale-105' : 'text-[#897a70] hover:bg-white'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="w-px h-4 bg-gray-200 mx-1 hidden sm:block"></div>
                    <button
                        onClick={() => toast.success("Exporting Report as PDF...", { icon: '📥' })}
                        className="size-8 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-[#2D241E] shadow-sm ml-1"
                    >
                        <span className="material-symbols-outlined text-[18px]">download</span>
                    </button>
                </div>
            </div>


            {/* Content Area Based on Tab */}
            < div className="relative z-10 min-h-[60vh]" >

                {/* --- OVERVIEW TAB --- */}
                {
                    activeTab === 'Overview' && (
                        <div className="space-y-4 animate-slide-up">
                            {/* Top Metric Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {metrics.map((item, i) => (
                                    <div key={i} className="bg-white/70 backdrop-blur-xl p-4 rounded-[2rem] border border-white/60 shadow-sm group hover:shadow-md transition-all cursor-pointer" onClick={() => handleAction(`${item.label} Drilldown`)}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-bold text-[#897a70] uppercase tracking-wider">{item.label}</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.change.startsWith('+') || item.change.startsWith('-2') ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{item.change}</span>
                                        </div>
                                        <h3 className="text-3xl font-bold text-[#2D241E] tracking-tight">
                                            {item.prefix}{typeof item.val === 'number' && item.val >= 1000 ? (item.val / 100000).toFixed(2) : item.val}{item.suffix}
                                        </h3>
                                        <p className="text-[10px] text-[#5C4D42]/80 font-bold mt-1">{item.sub}</p>
                                        <div className={`h-1.5 w-full bg-gray-100 mt-4 rounded-full overflow-hidden`}>
                                            <div className={`h-full bg-gradient-to-r ${item.color} w-[70%]`}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* AI Insights Bar */}
                            <div className="bg-[#F5F2EB]/50 backdrop-blur-md rounded-2xl border border-[#2D241E]/5 p-4 flex flex-col md:flex-row items-center gap-6">
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="size-10 rounded-full bg-[#2D241E] flex items-center justify-center text-white">
                                        <span className="material-symbols-outlined text-[20px] animate-pulse">psychology</span>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-bold text-[#2D241E] uppercase tracking-wider">Neural Summary</h4>
                                        <p className="text-[10px] font-bold text-[#897a70] uppercase">Strategic Recommendation</p>
                                    </div>
                                </div>
                                <p className="text-[11px] font-medium text-[#2D241E]/70 leading-relaxed italic">
                                    "Revenue projected to hit ₹5L threshold by next month. Consider increasing delivery incentives for South-West cluster to optimize fulfillment speed."
                                </p>
                                <button onClick={() => handleAction('Full AI Report')} className="ml-auto text-[10px] font-bold text-orange-600 uppercase tracking-wider hover:underline whitespace-nowrap">View Detailed Wisdom →</button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                {/* Growth Graph - Now part of Overview */}
                                <div className="lg:col-span-8 bg-white/70 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/60 shadow-lg flex flex-col h-[400px]">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h3 className="text-base font-bold text-[#2D241E]">Profit vs Retention Curve</h3>
                                            <p className="text-[10px] font-bold text-[#897a70] uppercase tracking-wider mt-1">Correlation between service quality & growth</p>
                                        </div>
                                        {/* Legend */}
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5">
                                                <span className="size-2 rounded-full bg-emerald-500"></span><span className="text-[10px] font-bold text-[#2D241E]">Net Profit</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="size-2 rounded-full bg-blue-500"></span><span className="text-[10px] font-bold text-[#2D241E]">Retention %</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full min-h-0 -ml-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={currentRevenueData}>
                                                <defs>
                                                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB80" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 9, fontWeight: 700 }} dy={10} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 9, fontWeight: 700 }} />
                                                <Tooltip contentStyle={{ backgroundColor: '#2D241E', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '10px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }} itemStyle={{ color: '#fff' }} />
                                                <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={3} fill="url(#colorProfit)" />
                                                <Line type="monotone" dataKey="retention" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6', strokeWidth: 0, stroke: '#fff' }} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Popular Items - Overview Summary */}
                                <div className="lg:col-span-4 bg-white/70 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/60 shadow-lg flex flex-col h-[400px]">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="text-base font-bold text-[#2D241E]">Kitchen KPI Monitor</h3>
                                        <button onClick={() => handleAction('Kitchen Leaderboard')} className="text-[10px] font-bold bg-[#2D241E] text-white px-2 py-1 rounded-lg uppercase tracking-wider shadow-lg shadow-black/10">Leaderboard</button>
                                    </div>
                                    <p className="text-xs font-bold text-[#897a70] uppercase tracking-wider mb-6">Real-time performance audits</p>

                                    <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                                        {kitchenPerformance.map((k, idx) => (
                                            <div key={idx} className="p-4 rounded-[1.5rem] bg-white border border-gray-100 group hover:border-[#2D241E]/40 transition-all cursor-pointer" onClick={() => handleAction(`Audit for ${k.name}`)}>
                                                <div className="flex justify-between items-center mb-3">
                                                    <div>
                                                        <h4 className="text-[11px] font-bold text-[#2D241E] uppercase tracking-wide">{k.name}</h4>
                                                        <p className="text-[10px] font-bold text-[#897a70]">{k.orders} orders processed</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[11px] font-bold text-emerald-600">{k.onTime}</p>
                                                        <p className="text-[10px] font-bold text-[#897a70] uppercase">On-Time</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={(e) => { e.stopPropagation(); handleAction(`Logs for ${k.name}`); }} className="flex-1 py-1.5 bg-gray-50 text-[#2D241E] text-[10px] font-bold rounded-lg uppercase tracking-wider hover:bg-gray-100">Logs</button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleAction(`Audit for ${k.name}`); }} className="flex-1 py-1.5 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-lg uppercase tracking-wider hover:bg-orange-100">Audit</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* --- FINANCE TAB --- */}
                {
                    activeTab === 'Finance' && (
                        <div className="space-y-4 animate-slide-up">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Cost Structure Pie */}
                                <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 shadow-lg flex flex-col items-center h-[400px]">
                                    <div className="flex justify-between items-center w-full mb-6 shrink-0">
                                        <h3 className="text-base font-bold text-[#2D241E]">Unit Economics</h3>
                                        <button onClick={() => handleAction('Cost Analysis')} className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl border border-emerald-100 uppercase tracking-wider hover:bg-emerald-100 transition-all">Deep Drilldown</button>
                                    </div>
                                    <div className="flex items-center justify-center gap-10 w-full flex-1">
                                        <div className="size-48 relative flex-shrink-0">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={costStructure} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                                        {costStructure.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                <p className="text-[10px] font-bold text-[#897a70] uppercase tracking-wider">Total cost</p>
                                                <span className="text-2xl font-bold text-[#2D241E]">₹4.2L</span>
                                            </div>
                                        </div>
                                        <div className="space-y-4 flex-1">
                                            <div className="space-y-3">
                                                {costStructure.map((item) => (
                                                    <div key={item.name} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <span className="size-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                                                            <p className="text-[11px] font-bold text-[#2D241E] uppercase tracking-wide">{item.name}</p>
                                                        </div>
                                                        <p className="text-[10px] font-bold text-[#897a70]">{item.value}%</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* [NEW] Liquidity Trend Graph */}
                                <div className="bg-[#2D241E] p-8 rounded-[2.5rem] shadow-lg flex flex-col h-[400px] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 size-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
                                    <div className="flex justify-between items-center mb-6 relative z-10 text-white">
                                        <div>
                                            <h3 className="text-base font-bold italic">Liquidity Velocity</h3>
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mt-1">Cash flow health monitor</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-emerald-400">₹8.42L</p>
                                            <p className="text-[10px] font-bold uppercase text-white/40 tracking-tight">Liquid Capital</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full min-h-0 -ml-4 relative z-10">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={revenueData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FFFFFF10" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#FFFFFF40', fontSize: 9 }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#FFFFFF40', fontSize: 9 }} />
                                                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', color: '#000' }} />
                                                <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={4} dot={{ r: 6, fill: '#10B981', strokeWidth: 0 }} activeDot={{ r: 8, strokeWidth: 0 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center relative z-10">
                                        <p className="text-[10px] font-bold text-white/60">Risk Assessment:</p>
                                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Minimal Exposure</span>
                                    </div>
                                </div>
                            </div>

                            {/* Transaction Engine Table Refinement */}
                            <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 shadow-lg">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#2D241E]">Real-time Transaction Ledger</h3>
                                        <p className="text-[10px] font-bold text-[#897a70] uppercase tracking-wider mt-1">Indore Node • Secure Sync</p>
                                    </div>
                                    <button onClick={() => handleAction('Full Ledger')} className="px-6 py-2 bg-[#2D241E] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-orange-600 transition-all shadow-xl shadow-black/10">Download PDF</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="pb-4 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Tx ID</th>
                                                <th className="pb-4 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Entity</th>
                                                <th className="pb-4 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Category</th>
                                                <th className="pb-4 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Amount</th>
                                                <th className="pb-4 text-[11px] font-bold text-[#897a70] uppercase tracking-wider text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {[
                                                { id: '#TRX-9421', user: 'Zomato Bulk', cat: 'B2B Fulfillment', amount: '₹14,200', status: 'Settled', col: 'text-emerald-500' },
                                                { id: '#TRX-9422', user: 'Cloud Kitchen A', cat: 'Weekly Payout', amount: '₹-28,400', status: 'Processing', col: 'text-amber-500' },
                                                { id: '#TRX-9423', user: 'Amazon AWS', cat: 'Infra Cost', amount: '₹-5,200', status: 'Settled', col: 'text-rose-500' },
                                                { id: '#TRX-9424', user: 'Direct Sub', cat: 'User Renewal', amount: '₹1,200', status: 'Settled', col: 'text-emerald-500' },
                                            ].map((tx, i) => (
                                                <tr key={i} className="group hover:bg-gray-50/50 transition-all cursor-pointer" onClick={() => handleAction(`Transaction ${tx.id}`)}>
                                                    <td className="py-4 text-xs font-bold text-[#2D241E]">{tx.id}</td>
                                                    <td className="py-4 text-xs font-bold text-[#5C4D42]">{tx.user}</td>
                                                    <td className="py-4 text-[10px] font-bold text-[#897a70] uppercase tracking-tight">{tx.cat}</td>
                                                    <td className="py-4 text-xs font-bold text-[#2D241E]">{tx.amount}</td>
                                                    <td className="py-4 text-[10px] font-bold text-right">
                                                        <span className={`px-2 py-1 rounded-lg bg-gray-100 ${tx.col} shadow-sm uppercase tracking-tight`}>{tx.status}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* --- MENU PERF TAB --- */}
                {
                    activeTab === 'Menu Perf' && (
                        <div className="space-y-4 animate-slide-up">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                {/* Flavor Intel Radar */}
                                <div className="lg:col-span-5 bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 shadow-lg flex flex-col items-center h-[450px]">
                                    <h3 className="text-base font-bold text-[#2D241E] self-start">Flavor Intelligence</h3>
                                    <p className="text-xs font-bold text-[#897a70] uppercase tracking-wider mt-1 self-start mb-6">Culinary demand profile (Indore)</p>
                                    <div className="flex-1 w-full min-h-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                                                { subject: 'Spiciness', A: 120, fullMark: 150 },
                                                { subject: 'Sweetness', A: 98, fullMark: 150 },
                                                { subject: 'Creamy', A: 86, fullMark: 150 },
                                                { subject: 'Tangy', A: 99, fullMark: 150 },
                                                { subject: 'Crispy', A: 110, fullMark: 150 },
                                            ]}>
                                                <PolarGrid stroke="#E5E7EB" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#897a70', fontSize: 10, fontWeight: 700 }} />
                                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                                <Radar name="Demand" dataKey="A" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-4 flex gap-4 w-full">
                                        <div className="flex-1 p-2 bg-orange-50 rounded-xl text-center border border-orange-100">
                                            <p className="text-[11px] font-bold text-orange-600">Spike Detected</p>
                                            <p className="text-[10px] font-bold text-[#897a70] uppercase tracking-wider">Spicy Category</p>
                                        </div>
                                        <div className="flex-1 p-2 bg-blue-50 rounded-xl text-center border border-blue-100">
                                            <p className="text-[11px] font-bold text-blue-600">Stable</p>
                                            <p className="text-[10px] font-bold text-[#897a70] uppercase tracking-wider">Creamy Base</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Performance List */}
                                <div className="lg:col-span-7 bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 shadow-lg flex flex-col h-[450px]">
                                    <div className="flex justify-between items-center mb-8 shrink-0">
                                        <h3 className="text-xl font-bold text-[#2D241E]">Item Velocity Matrix</h3>
                                        <button onClick={() => handleAction('Restocking Overview')} className="px-6 py-2.5 bg-orange-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-xl shadow-orange-500/20 hover:scale-105 transition-all">Restocking Needed (4)</button>
                                    </div>
                                    <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                                        {popularItems.map((item, i) => (
                                            <div key={i} className="p-4 bg-white rounded-[1.5rem] border border-gray-100 flex items-center justify-between group hover:border-orange-200 transition-all cursor-pointer" onClick={() => handleAction(`View Matrix for ${item.name}`)}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`size-12 rounded-2xl ${item.color} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform`}>
                                                        <span className="material-symbols-outlined text-[20px]">restaurant</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-[#2D241E] uppercase tracking-tight">{item.name}</h4>
                                                        <div className="flex gap-2 mt-1.5">
                                                            <span className="px-2 py-0.5 bg-gray-100 rounded-md text-[10px] font-bold text-[#5C4D42]">{item.rating} ★</span>
                                                            <span className="px-2 py-0.5 bg-indigo-50 rounded-md text-[10px] font-bold text-indigo-600">{item.sales} Orders</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-right">
                                                        <p className="text-[11px] font-bold text-[#2D241E]">88%</p>
                                                        <p className="text-[10px] font-bold text-[#897a70] uppercase">Efficiency</p>
                                                    </div>
                                                    <button onClick={(e) => { e.stopPropagation(); handleAction(`Edit ${item.name}`); }} className="size-8 rounded-lg border border-gray-100 flex items-center justify-center hover:bg-[#2D241E] hover:text-white transition-all shadow-sm">
                                                        <span className="material-symbols-outlined text-[16px]">edit_note</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* --- RETENTION TAB --- */}
                {
                    activeTab === 'Retention' && (
                        <div className="space-y-4 animate-slide-up">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                {/* Stickiness Scoreboard */}
                                <div className="lg:col-span-4 bg-[#2D241E] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group h-[400px] flex flex-col">
                                    <div className="absolute top-0 right-0 size-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors"></div>
                                    <div className="relative z-10">
                                        <h3 className="text-xl font-bold italic">Stickiness Score</h3>
                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mt-1">DAU / MAU Ratio</p>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                                        <div className="text-6xl font-bold text-emerald-400 tracking-tighter">68<span className="text-2xl text-white/40">%</span></div>
                                        <p className="text-[11px] font-bold uppercase text-emerald-400/60 mt-2 tracking-[0.3em]">Elite Tier</p>
                                    </div>
                                    <div className="relative z-10 space-y-3">
                                        <div className="flex justify-between text-[10px] font-bold">
                                            <span className="text-white/60">Churn Probability</span>
                                            <span className="text-rose-400">12.4%</span>
                                        </div>
                                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-rose-500 w-[12%]"></div>
                                        </div>
                                        <p className="text-[10px] text-white/40 italic leading-relaxed text-center">"User retention is 15% higher in mobile app clusters."</p>
                                    </div>
                                </div>

                                {/* Cohort Heatmap */}
                                <div className="lg:col-span-8 bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 shadow-lg h-[400px] flex flex-col">
                                    <div className="flex justify-between items-center mb-6 shrink-0">
                                        <div>
                                            <h3 className="text-base font-bold text-[#2D241E]">Cohort Retention Matrix</h3>
                                            <p className="text-[10px] font-bold text-[#897a70] uppercase tracking-wider mt-1">Behavioral cluster analysis by month</p>
                                        </div>
                                        <button onClick={() => handleAction('Export Matrix')} className="p-2 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                                            <span className="material-symbols-outlined text-[18px] text-[#2D241E]">share</span>
                                        </button>
                                    </div>
                                    <div className="flex-1 overflow-x-auto custom-scrollbar">
                                        <table className="w-full text-center border-collapse">
                                            <thead>
                                                <tr>
                                                    <th className="p-2 text-[10px] font-bold text-[#897a70] uppercase tracking-tight">Cohort</th>
                                                    <th className="p-2 text-[10px] font-bold text-[#897a70] uppercase tracking-tight">Size</th>
                                                    <th className="p-2 text-[10px] font-bold text-[#897a70] uppercase tracking-tight">Month 1</th>
                                                    <th className="p-2 text-[10px] font-bold text-[#897a70] uppercase tracking-tight">Month 2</th>
                                                    <th className="p-2 text-[10px] font-bold text-[#897a70] uppercase tracking-tight">Month 3</th>
                                                    <th className="p-2 text-[10px] font-bold text-[#897a70] uppercase tracking-tight">Month 4</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[
                                                    { m: 'Jan 26', s: '1,240', r: [100, 85, 78, 72] },
                                                    { m: 'Feb 26', s: '980', r: [100, 82, 74, 0] },
                                                    { m: 'Mar 26', s: '2,100', r: [100, 88, 0, 0] },
                                                    { m: 'Apr 26', s: '1,500', r: [100, 0, 0, 0] },
                                                ].map((row, i) => (
                                                    <tr key={i}>
                                                        <td className="p-2 text-[10px] font-bold text-[#2D241E]">{row.m}</td>
                                                        <td className="p-2 text-xs font-bold text-[#897a70]">{row.s}</td>
                                                        {row.r.map((val, j) => (
                                                            <td key={j} className="p-1">
                                                                <div
                                                                    className={`h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${val === 0 ? 'bg-gray-50 text-gray-300' : 'text-[#2D241E]'}`}
                                                                    style={{
                                                                        backgroundColor: val === 0 ? '' : `rgba(16, 185, 129, ${val / 100})`,
                                                                        color: val > 60 ? '#fff' : '#2D241E'
                                                                    }}
                                                                >
                                                                    {val > 0 ? `${val}%` : '-'}
                                                                </div>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* At Risk List overlay card */}
                            <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 p-4 flex items-center gap-4">
                                <span className="material-symbols-outlined text-rose-500 animate-bounce">warning</span>
                                <div className="flex-1">
                                    <p className="text-[11px] font-bold text-[#2D241E] uppercase tracking-wide">42 High-Value Users At Risk</p>
                                    <p className="text-[10px] text-[#5C4D42] font-medium opacity-80 italic">Users with 0 orders in last 14 days but active subscriptions.</p>
                                </div>
                                <button onClick={() => handleAction('Reach Out to Risk Cluster')} className="px-4 py-2 bg-rose-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-rose-500/20">Send Retention Promo</button>
                            </div>
                        </div>
                    )
                }

            </div >

            {/* AI Report Engine Modal */}
            {
                showReportEngine && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isGenerating && setShowReportEngine(false)}></div>
                        <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh]">

                            {/* Compact Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 bg-orange-100 rounded-xl flex items-center justify-center">
                                        <span className="material-symbols-outlined text-orange-500 text-[18px]">auto_awesome</span>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-gray-800">Digital Insights Engine</h3>
                                        <p className="text-xs text-gray-500">Configure AI analysis parameters</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowReportEngine(false)} disabled={isGenerating} className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-50">
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto">
                                {/* Loading State during Generation */}
                                {isGenerating ? (
                                    <div className="py-10 flex flex-col items-center justify-center space-y-6">
                                        <div className="size-20 relative">
                                            <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                                            <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-orange-500 animate-pulse text-3xl">analytics</span>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <h4 className="text-base font-bold text-gray-800">Analyzing Market Patterns</h4>
                                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Neural Inference in progress...</p>
                                        </div>

                                        {/* Streaming Terminal Logs */}
                                        <div className="w-full bg-gray-900 rounded-xl p-4 font-mono text-[10px] text-emerald-400 space-y-1 shadow-inner">
                                            {genLogs.map((log, idx) => (
                                                <div key={idx} className="flex gap-2 opacity-80">
                                                    <span className="opacity-40">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                                                    <span>{log}</span>
                                                </div>
                                            ))}
                                            <div className="w-1.5 h-3 bg-emerald-400 animate-pulse inline-block ml-1"></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Timeframe</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['Last 7 Days', 'Last 30 Days', 'Quarterly'].map(r => (
                                                    <button
                                                        key={r}
                                                        onClick={() => setGenConfig({ ...genConfig, range: r })}
                                                        className={`py-2.5 rounded-xl text-xs font-bold transition-all ${genConfig.range === r ? 'bg-gray-900 text-white shadow-lg shadow-black/10' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                                                    >
                                                        {r}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Target Metrics</label>
                                            <div className="space-y-2">
                                                {[
                                                    { id: 'Summary', label: 'Executive Financial Summary', icon: 'finance' },
                                                    { id: 'Kitchen', label: 'Detailed Kitchen Performance', icon: 'soup_kitchen' },
                                                    { id: 'Retention', label: 'Customer Cohort Retention', icon: 'group_work' },
                                                ].map(m => (
                                                    <div
                                                        key={m.id}
                                                        onClick={() => setGenConfig({ ...genConfig, metric: m.id })}
                                                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${genConfig.metric === m.id ? 'border-gray-900 bg-gray-900/[0.02]' : 'border-gray-50 bg-gray-50 hover:bg-gray-100'}`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className={`material-symbols-outlined text-[20px] ${genConfig.metric === m.id ? 'text-gray-900' : 'text-gray-400'}`}>{m.icon}</span>
                                                            <span className={`text-xs font-bold ${genConfig.metric === m.id ? 'text-gray-900' : 'text-gray-500'}`}>{m.label}</span>
                                                        </div>
                                                        {genConfig.metric === m.id && <span className="material-symbols-outlined text-emerald-500 text-[18px]">check_circle</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {!isGenerating && (
                                    <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
                                        <button onClick={() => setShowReportEngine(false)} className="flex-1 py-3 bg-white text-gray-400 rounded-xl text-xs font-bold uppercase tracking-widest hover:text-gray-600">Discard</button>
                                        <button onClick={handleGenerate} className="flex-[2] py-3 bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-black transition-all">Compile Report</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }

            {/* Metric Drilldown Modal */}
            {
                showDrilldown && createPortal(
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDrilldown(false)}></div>
                        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative z-10 flex flex-col">

                            {/* Compact Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 bg-gray-100 rounded-xl flex items-center justify-center">
                                        <span className="material-symbols-outlined text-gray-600 text-[20px]">
                                            {selectedMetric === 'EBITDA' ? 'payments' :
                                                selectedMetric === 'Avg Delivery' ? 'local_shipping' :
                                                    selectedMetric === 'Churn Rate' ? 'person_remove' : 'star'}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-gray-800">{selectedMetric} Drilldown</h3>
                                        <p className="text-xs text-gray-400">In-depth cluster analysis • Indore Zone</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowDrilldown(false)} className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all">
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto relative z-10 custom-scrollbar">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                                    {/* Chart Area */}
                                    <div className="lg:col-span-8 space-y-6">
                                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 h-[340px] flex flex-col">
                                            <div className="flex justify-between items-center mb-6 px-1">
                                                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{selectedMetric} Variance (Last 30 Days)</h4>
                                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">Healthy</span>
                                            </div>
                                            <div className="flex-1 w-full min-h-0">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    {selectedMetric === 'EBITDA' ? (
                                                        <BarChart data={revenueData}>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB80" />
                                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 9 }} />
                                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 9 }} />
                                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                                            <Bar dataKey="profit" fill="#10B981" radius={[4, 4, 0, 0]} barSize={24} />
                                                        </BarChart>
                                                    ) : selectedMetric === 'Churn Rate' ? (
                                                        <AreaChart data={revenueData}>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB80" />
                                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 9 }} />
                                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 9 }} />
                                                            <Tooltip />
                                                            <Area type="monotone" dataKey="retention" stroke="#3B82F6" strokeWidth={3} fill="#3B82F620" />
                                                        </AreaChart>
                                                    ) : selectedMetric === 'Avg Delivery' ? (
                                                        <LineChart data={revenueData}>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB80" />
                                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 9 }} />
                                                            <YAxis domain={[0, 40]} axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 9 }} />
                                                            <Tooltip />
                                                            <Line type="stepAfter" dataKey="profit" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
                                                        </LineChart>
                                                    ) : (
                                                        <BarChart data={revenueData}>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB80" />
                                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 9 }} />
                                                            <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 9 }} />
                                                            <Tooltip />
                                                            <Bar dataKey="retention" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                                                        </BarChart>
                                                    )}
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* Data Table Section */}
                                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-50 border-b border-gray-100">
                                                        <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Dimension</th>
                                                        <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Value</th>
                                                        <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Growth</th>
                                                        <th className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {[
                                                        { dim: 'Direct Sales', val: '42%', delta: '+12%', status: 'Optimum' },
                                                        { dim: 'Subs Renewals', val: '38%', delta: '+5%', status: 'Stable' },
                                                        { dim: 'Referral Flow', val: '15%', delta: '-2%', status: 'Caution' },
                                                        { dim: 'Corporate Bulk', val: '5%', delta: '+22%', status: 'High Growth' },
                                                    ].map((row, i) => (
                                                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-4 py-2 text-[11px] font-bold text-gray-700 uppercase">{row.dim}</td>
                                                            <td className="px-4 py-2 text-[11px] font-semibold text-gray-600">{row.val}</td>
                                                            <td className={`px-4 py-2 text-[11px] font-bold ${row.delta.startsWith('+') ? 'text-emerald-600' : 'text-rose-500'}`}>{row.delta}</td>
                                                            <td className="px-4 py-2 text-right">
                                                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter ${row.status === 'Caution' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                                                    {row.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Action Shortcuts */}
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { label: 'Export Data', icon: 'database', col: 'text-blue-600', bg: 'bg-blue-50' },
                                                { label: 'Rule Editor', icon: 'gavel', col: 'text-amber-600', bg: 'bg-amber-50' },
                                                { label: 'Simulate fix', icon: 'bolt', col: 'text-emerald-600', bg: 'bg-emerald-50' },
                                            ].map((act, i) => (
                                                <button key={i} onClick={() => handleAction(act.label)} className={`p-2.5 rounded-xl ${act.bg} border border-transparent hover:border-gray-200 transition-all flex flex-col items-center gap-1 group`}>
                                                    <span className={`material-symbols-outlined text-[18px] ${act.col} group-hover:scale-110 transition-transform`}>{act.icon}</span>
                                                    <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tighter">{act.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sidebar Stats */}
                                    <div className="lg:col-span-4 space-y-3">
                                        <div className="bg-[#2D241E] text-white p-5 rounded-[1.5rem] shadow-xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 size-20 bg-emerald-500/10 rounded-full blur-2xl"></div>
                                            <h5 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-3">Neural Projection</h5>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[11px] font-bold text-white/60">Target Match</span>
                                                    <span className="text-[11px] font-bold text-emerald-400">94.2%</span>
                                                </div>
                                                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 w-[94%]"></div>
                                                </div>
                                                <p className="text-[10px] font-medium text-white/50 leading-relaxed italic">
                                                    "Projected variance remains within standard cluster bounds."
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h5 className="text-[10px] font-bold text-[#897a70] uppercase tracking-wider ml-1">Top Contributors</h5>
                                            {[
                                                { name: 'Vijay Nagar Cluster', val: '+₹2.4L', trend: 'up' },
                                                { name: 'Palasia Node', val: '+₹1.8L', trend: 'up' },
                                                { name: 'Bhawarkua Hub', val: '-₹0.2L', trend: 'down' },
                                            ].map((item, i) => (
                                                <div key={i} className="flex justify-between items-center p-2.5 bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 shadow-sm">
                                                    <span className="text-[11px] font-bold text-[#2D241E]">{item.name}</span>
                                                    <span className={`text-[11px] font-bold ${item.trend === 'up' ? 'text-emerald-600' : 'text-rose-500'}`}>{item.val}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-4 bg-white shrink-0 border-t border-[#2D241E]/5 flex gap-3">
                                <button onClick={() => !isAuditing && setShowDrilldown(false)} disabled={isAuditing} className="px-6 py-2.5 bg-gray-100 text-[#5C4D42] rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-gray-200 transition-all disabled:opacity-50">Close Analysis</button>
                                <button
                                    onClick={() => handleAction(`Audit for ${selectedMetric}`)}
                                    disabled={isAuditing}
                                    className={`flex-1 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 ${isAuditing ? 'bg-emerald-500 text-white cursor-default' : 'bg-[#2D241E] text-white hover:bg-orange-600'}`}
                                >
                                    {isAuditing ? (
                                        <>
                                            <span className="size-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                            {auditStep === 1 ? 'Scanning Nodes...' : auditStep === 2 ? 'Validating...' : 'Audit Success!'}
                                        </>
                                    ) : (
                                        'Trigger Compliance Audit'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }
        </div >
    );
};

export default AdminReports;
