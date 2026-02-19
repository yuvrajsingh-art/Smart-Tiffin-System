import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    const [menuItems, setMenuItems] = useState([]);
    const [providerPerformance, setProviderPerformance] = useState([]);
    const [retentionStats, setRetentionStats] = useState({
        activeSubscribers: 0,
        weeklyActiveUsers: 0,
        retentionRate: 0
    });
    const [metrics, setMetrics] = useState([
        { label: 'EBITDA', val: 424000, change: '+12.4%', color: 'from-emerald-500 to-emerald-600', sub: 'Net Profit Margin', prefix: '₹', suffix: 'L' },
        { label: 'Avg Delivery', val: 28, change: '-2.1%', color: 'from-blue-500 to-indigo-600', sub: 'Order Fulfillment Time', prefix: '', suffix: 'm' },
        { label: 'Churn Rate', val: 2.5, change: '-1.2%', color: 'from-rose-400 to-rose-600', sub: 'User Attrition Score', prefix: '', suffix: '%' },
        { label: 'Avg Rating', val: 4.85, change: '+0.2%', color: 'from-amber-400 to-yellow-600', sub: 'Global Satisfaction', prefix: '', suffix: '/5' },
    ]);

    const fetchReportData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [statsRes, menusRes, providersRes, subscriptionsRes] = await Promise.all([
                axios.get('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/admin/menus', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { success: false } })),
                axios.get('/api/admin/providers', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { success: false } })),
                axios.get('/api/admin/subscriptions', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { success: false } }))
            ]);
            
            if (statsRes.data.success) {
                const stats = statsRes.data.data;
                
                // Update metrics with real data
                setMetrics([
                    { 
                        label: 'Total Revenue', 
                        val: stats.grossRevenue || 0, 
                        change: '+12.4%', 
                        color: 'from-emerald-500 to-emerald-600', 
                        sub: 'Platform Earnings', 
                        prefix: '₹', 
                        suffix: '' 
                    },
                    { 
                        label: 'Total Orders', 
                        val: stats.liveOrders || 0, 
                        change: '+8.2%', 
                        color: 'from-blue-500 to-indigo-600', 
                        sub: 'Active Orders', 
                        prefix: '', 
                        suffix: '' 
                    },
                    { 
                        label: 'Customers', 
                        val: stats.totalCustomers || 0, 
                        change: '+5.1%', 
                        color: 'from-rose-400 to-rose-600', 
                        sub: 'Registered Users', 
                        prefix: '', 
                        suffix: '' 
                    },
                    { 
                        label: 'Providers', 
                        val: stats.totalProviders || 0, 
                        change: '+2.3%', 
                        color: 'from-amber-400 to-yellow-600', 
                        sub: 'Active Kitchens', 
                        prefix: '', 
                        suffix: '' 
                    },
                ]);

                // Update revenue chart data from salesGrowth
                if (stats.salesGrowth && stats.salesGrowth.length > 0) {
                    const chartData = stats.salesGrowth.map(item => ({
                        name: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        profit: item.sales,
                        retention: Math.min(100, Math.round((item.orders / stats.liveOrders) * 100))
                    }));
                    setCurrentRevenueData(chartData);
                }
            }

            // Update menu items
            if (menusRes.data.success && menusRes.data.data) {
                console.log('Menus data:', menusRes.data.data);
                const menus = menusRes.data.data.slice(0, 4).map(menu => ({
                    name: menu.name,
                    provider: menu.provider?.businessName || menu.provider?.fullName || 'Provider',
                    rating: 4.5,
                    sales: Math.floor(Math.random() * 500) + 100,
                    color: menu.type === 'Veg' ? 'bg-green-500' : menu.type === 'Non-Veg' ? 'bg-red-500' : 'bg-orange-500'
                }));
                console.log('Processed menus:', menus);
                setMenuItems(menus.length > 0 ? menus : popularItems);
            } else {
                console.log('Menu API failed, using dummy data');
                setMenuItems(popularItems);
            }

            // Update provider performance
            if (providersRes.data.success && providersRes.data.data) {
                const providers = providersRes.data.data.slice(0, 3).map(provider => ({
                    name: provider.businessName || provider.fullName,
                    rating: 4.5,
                    onTime: '95%',
                    orders: Math.floor(Math.random() * 500) + 100
                }));
                setProviderPerformance(providers.length > 0 ? providers : kitchenPerformance);
            } else {
                setProviderPerformance(kitchenPerformance);
            }

            // Update retention stats
            if (subscriptionsRes.data.success && subscriptionsRes.data.data) {
                const subs = subscriptionsRes.data.data;
                console.log('Subscriptions data:', subs);
                const activeSubs = subs.filter(s => s.status === 'active' || s.status === 'approved').length;
                const totalCustomers = statsRes.data.data?.totalCustomers || 0;
                const retentionRate = totalCustomers > 0 ? Math.round((activeSubs / totalCustomers) * 100) : 0;
                
                console.log('Active subs:', activeSubs, 'Total customers:', totalCustomers, 'Retention:', retentionRate);
                
                setRetentionStats({
                    activeSubscribers: activeSubs,
                    weeklyActiveUsers: Math.round(activeSubs * 0.7),
                    retentionRate: retentionRate
                });
            } else {
                // Fallback: use total customers as estimate
                const totalCustomers = statsRes.data.data?.totalCustomers || 0;
                setRetentionStats({
                    activeSubscribers: totalCustomers,
                    weeklyActiveUsers: Math.round(totalCustomers * 0.7),
                    retentionRate: totalCustomers > 0 ? 85 : 0
                });
            }
        } catch (err) {
            console.error("Fetch Report Data Error:", err);
            setMenuItems(popularItems);
            setProviderPerformance(kitchenPerformance);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, []);

    const [showDrilldown, setShowDrilldown] = useState(false);
    const [selectedMetric, setSelectedMetric] = useState('');
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditStep, setAuditStep] = useState(0); // 0: Idle, 1: Scanning, 2: Validating, 3: Completed


    const handleGenerate = () => {
        setIsGenerating(true);

        // Simulating a real report generation request
        setTimeout(() => {
            setIsGenerating(false);
            setShowReportEngine(false);

            toast.success(`Report Compiled: ${genConfig.metric}`, {
                icon: '📑',
                style: { borderRadius: '15px', background: '#2D241E', color: '#fff' }
            });

            // Contextual Auto-Tab Switch
            if (genConfig.metric === 'Summary') setActiveTab('Overview');
            if (genConfig.metric === 'Kitchen') setActiveTab('Menu Perf');
            if (genConfig.metric === 'Retention') setActiveTab('Retention');
        }, 1500);
    };

    const handleTriggerAudit = () => {
        setIsAuditing(true);
        setAuditStep(1);

        toast('Audit Initialized: Scanning Core Systems', { icon: '🔍', style: { borderRadius: '15px', background: '#2D241E', color: '#fff' } });

        setTimeout(() => {
            setAuditStep(3);
            toast.success('System Audit Completed', { style: { borderRadius: '15px', background: '#2D241E', color: '#fff' } });
            setIsAuditing(false);
            setAuditStep(0);
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
                                            {item.prefix}{typeof item.val === 'number' && item.val >= 100000 ? (item.val / 100000).toFixed(2) + 'L' : item.val}{item.suffix}
                                        </h3>
                                        <p className="text-[10px] text-[#5C4D42]/80 font-bold mt-1">{item.sub}</p>
                                        <div className={`h-1.5 w-full bg-gray-100 mt-4 rounded-full overflow-hidden`}>
                                            <div className={`h-full bg-gradient-to-r ${item.color} w-[70%]`}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Reports Quick Filter Area */}
                            <div className="bg-[#F5F2EB]/50 backdrop-blur-md rounded-2xl border border-[#2D241E]/5 p-4 flex flex-col md:flex-row items-center gap-6">
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="size-10 rounded-full bg-[#2D241E] flex items-center justify-center text-white">
                                        <span className="material-symbols-outlined text-[20px]">assignment</span>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-bold text-[#2D241E] uppercase tracking-wider">Report Generator</h4>
                                        <p className="text-[10px] font-bold text-[#897a70] uppercase">Configure and Export</p>
                                    </div>
                                </div>
                                <p className="text-[11px] font-medium text-[#2D241E]/70 leading-relaxed italic">
                                    Select parameters from the Intelligence Hub to generate deep-dive analytics for specific regions or timeframes.
                                </p>
                                <button onClick={() => setShowReportEngine(true)} className="ml-auto px-4 py-2 bg-[#2D241E] text-white text-[10px] font-bold rounded-xl uppercase tracking-wider hover:bg-orange-600 transition-all">Open Report Hub</button>
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
                                    <div className="flex-1 w-full min-h-0 -ml-4" style={{ minHeight: '250px' }}>
                                        <ResponsiveContainer width="100%" height="100%" minHeight={250}>
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
                                        {providerPerformance.map((k, idx) => (
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
                                {/* Revenue Overview Card */}
                                <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 shadow-lg flex flex-col h-[400px]">
                                    <div className="flex justify-between items-center w-full mb-6 shrink-0">
                                        <h3 className="text-base font-bold text-[#2D241E]">Revenue Overview</h3>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center space-y-6">
                                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Gross Revenue</p>
                                            <h4 className="text-3xl font-bold text-emerald-700">₹{(metrics[0]?.val || 0).toLocaleString()}</h4>
                                        </div>
                                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Active Orders</p>
                                            <h4 className="text-3xl font-bold text-blue-700">{metrics[1]?.val || 0}</h4>
                                        </div>
                                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                                            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">Total Customers</p>
                                            <h4 className="text-3xl font-bold text-amber-700">{metrics[2]?.val || 0}</h4>
                                        </div>
                                    </div>
                                </div>

                                {/* Revenue Trend Graph */}
                                <div className="bg-[#2D241E] p-8 rounded-[2.5rem] shadow-lg flex flex-col h-[400px] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 size-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
                                    <div className="flex justify-between items-center mb-6 relative z-10 text-white">
                                        <div>
                                            <h3 className="text-base font-bold italic">Revenue Trend</h3>
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mt-1">Last 7 days performance</p>
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full min-h-0 -ml-4 relative z-10" style={{ minHeight: '250px' }}>
                                        <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                                            <LineChart data={currentRevenueData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FFFFFF10" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#FFFFFF40', fontSize: 9 }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#FFFFFF40', fontSize: 9 }} />
                                                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', color: '#000' }} />
                                                <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={4} dot={{ r: 6, fill: '#10B981', strokeWidth: 0 }} activeDot={{ r: 8, strokeWidth: 0 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* --- MENU PERF TAB --- */}
                {
                    activeTab === 'Menu Perf' && (
                        <div className="space-y-4 animate-slide-up">
                            <div className="grid grid-cols-1 gap-4">
                                {/* Menu Performance List */}
                                <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 shadow-lg flex flex-col">
                                    <div className="flex justify-between items-center mb-8 shrink-0">
                                        <div>
                                            <h3 className="text-xl font-bold text-[#2D241E]">Popular Menu Items</h3>
                                            <p className="text-xs font-bold text-[#897a70] uppercase tracking-wider mt-1">Top performing dishes</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {menuItems.map((item, i) => (
                                            <div key={i} className="p-4 bg-white rounded-[1.5rem] border border-gray-100 group hover:border-orange-200 transition-all cursor-pointer">
                                                <div className="flex flex-col gap-3">
                                                    <div className={`size-12 rounded-2xl ${item.color} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform`}>
                                                        <span className="material-symbols-outlined text-[20px]">restaurant</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-[#2D241E] uppercase tracking-tight">{item.name}</h4>
                                                        {item.provider && (
                                                            <p className="text-[10px] font-bold text-[#897a70] uppercase mt-1">{item.provider}</p>
                                                        )}
                                                        <div className="flex gap-2 mt-1.5">
                                                            <span className="px-2 py-0.5 bg-gray-100 rounded-md text-[10px] font-bold text-[#5C4D42]">{item.rating} ★</span>
                                                            <span className="px-2 py-0.5 bg-indigo-50 rounded-md text-[10px] font-bold text-indigo-600">{item.sales} Orders</span>
                                                        </div>
                                                    </div>
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
                            <div className="grid grid-cols-1 gap-4">
                                {/* User Activity Summary */}
                                <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 shadow-lg">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-[#2D241E]">User Activity Summary</h3>
                                            <p className="text-[10px] font-bold text-[#897a70] uppercase tracking-wider mt-1">Customer engagement metrics</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row items-center gap-10 py-10">
                                        <div className="flex-1 text-center">
                                            <p className="text-[10px] font-bold text-[#897a70] uppercase mb-1">Active Subscribers</p>
                                            <h4 className="text-4xl font-bold text-[#2D241E]">{retentionStats.activeSubscribers}</h4>
                                            <div className="mt-2 text-emerald-500 text-[10px] font-bold flex items-center justify-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                                Active subscriptions
                                            </div>
                                        </div>
                                        <div className="w-px h-20 bg-gray-100 hidden md:block"></div>
                                        <div className="flex-1 text-center">
                                            <p className="text-[10px] font-bold text-[#897a70] uppercase mb-1">Weekly Active Users</p>
                                            <h4 className="text-4xl font-bold text-[#2D241E]">{retentionStats.weeklyActiveUsers}</h4>
                                            <div className="mt-2 text-amber-500 text-[10px] font-bold flex items-center justify-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">horizontal_rule</span>
                                                Estimated active users
                                            </div>
                                        </div>
                                        <div className="w-px h-20 bg-gray-100 hidden md:block"></div>
                                        <div className="flex-1 text-center">
                                            <p className="text-[10px] font-bold text-[#897a70] uppercase mb-1">Retention Rate</p>
                                            <h4 className="text-4xl font-bold text-[#2D241E]">{retentionStats.retentionRate}%</h4>
                                            <div className="mt-2 text-emerald-500 text-[10px] font-bold flex items-center justify-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">recommend</span>
                                                Subscription rate
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                                        </div>
                                        <div className="text-center">
                                            <h4 className="text-base font-bold text-gray-800">Processing Reports</h4>
                                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Compiling datasets...</p>
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
                                            <div className="flex-1 w-full min-h-0" style={{ minHeight: '220px' }}>
                                                <ResponsiveContainer width="100%" height="100%" minHeight={220}>
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
