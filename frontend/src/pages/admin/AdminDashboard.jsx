import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { createPortal } from 'react-dom';
import { useSocket } from '../../context/SocketContext';
import AdminStatCard from '../../components/admin/AdminStatCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';

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
    menu: { lunch: { dish: '--', type: '--' }, dinner: { dish: '--', type: '--' } },
    systemHealth: { status: 'Stable', node: 'Primary', traffic: 'Normal' }
};




const AdminDashboard = () => {
    const navigate = useNavigate();
    const socket = useSocket();
    const [showBroadcast, setShowBroadcast] = useState(false);
    const [showLogs, setShowLogs] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false); // New
    const [searchResults, setSearchResults] = useState(null); // New
    const [searchQuery, setSearchQuery] = useState('');
    const [broadcastMsg, setBroadcastMsg] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [approvals, setApprovals] = useState([]);
    const [systemHealth, setSystemHealth] = useState('Stable');
    const [loading, setLoading] = useState(true);
    const [broadcast, setBroadcast] = useState(null);
    const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
    const formRef = React.useRef(null);

    // 🔹 Real-time Stats State
    const [stats, setStats] = useState(initialStats);

    // 🔹 Fetch Stats from Backend
    const fetchStats = async () => {
        try {
            setLoading(true);
            const [statsRes, settingsRes] = await Promise.all([
                axios.get('/api/admin/stats'),
                axios.get('/api/admin/settings')
            ]);

            if (statsRes.data.success) {
                setStats(prev => ({
                    ...prev,
                    ...statsRes.data.data,
                    salesGrowth: (statsRes.data.data.salesGrowth || []).map(d => ({
                        name: d._id.slice(5).replace('-', '/'),
                        sales: d.sales,
                        orders: d.orders
                    }))
                }));
                // Approval queue state sync
                setApprovals((statsRes.data.data.pendingApprovals || []).map(apr => ({
                    id: apr._id,
                    type: 'Provider',
                    name: apr.fullName,
                    req: 'Join Request',
                    time: new Date(apr.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    email: apr.email
                })));
            }

            if (settingsRes.data.success) {
                const settings = settingsRes.data.data;
                if (settings.activeBroadcast && settings.activeBroadcast.isActive) {
                    setBroadcast(settings.activeBroadcast.message);
                } else {
                    setBroadcast(null);
                }
            }
        } catch (error) {
            console.error("Fetch Stats Error:", error.message);
            toast.error("Failed to sync with cloud nodes");
        } finally {
            setLoading(false);
        }
    };

    const handleDismissBroadcast = async () => {
        try {
            await axios.delete('/api/admin/broadcast');
            setBroadcast(null);
        } catch (error) {
            console.error("Dismiss Broadcast Error:", error.message);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // 🔹 Socket.io Listeners for Live Notifications
    useEffect(() => {
        if (!socket) return;

        socket.on('admin-notification', (data) => {
            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-white border-l-4 border-indigo-500 shadow-xl rounded-xl p-4 flex items-start gap-3 pointer-events-auto`}>
                    <div className="bg-indigo-50 p-2 rounded-full">
                        <span className="material-symbols-outlined text-indigo-600">notifications_active</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-[#2D241E]">{data.title || 'Notification'}</p>
                        <p className="text-[10px] text-gray-500 font-medium">{data.message}</p>
                    </div>
                </div>
            ), { duration: 5000 });

            fetchStats();
        });

        socket.on('new-order', (data) => {
            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-white border-l-4 border-emerald-500 shadow-xl rounded-xl p-4 flex items-start gap-3 pointer-events-auto`}>
                    <div className="bg-emerald-50 p-2 rounded-full">
                        <span className="material-symbols-outlined text-emerald-600">shopping_cart</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-[#2D241E]">New Order Received!</p>
                        <p className="text-[10px] text-gray-500 font-medium">#{data.order?.id} from {data.order?.customer}</p>
                    </div>
                </div>
            ), { duration: 6000 });

            fetchStats();
        });

        return () => {
            socket.off('admin-notification');
            socket.off('new-order');
        };
    }, [socket]);



    const handleGlobalSearch = async (e) => {
        if (e.key === 'Enter' && searchQuery) {
            if (searchQuery.length < 2) return toast.error("Type at least 2 characters");
            const toastId = toast.loading(`Searching for "${searchQuery}"...`);
            try {
                const { data } = await axios.get(`/api/admin/search?query=${searchQuery}`);
                if (data.success) {
                    setSearchResults(data.data);
                    setShowSearchModal(true);
                    toast.dismiss(toastId);
                }
            } catch (error) {
                toast.error("Search failed", { id: toastId });
            }
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

        setIsSending(true);
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
        } finally {
            setIsSending(false);
        }
    };

    const handleAddNewCustomer = async (e) => {
        try {
            if (e && e.preventDefault) e.preventDefault();
            const form = formRef.current;
            if (!form) return;

            const name = form.elements['name']?.value;
            const email = form.elements['email']?.value;
            const phone = form.elements['phone']?.value;
            const password = form.elements['password']?.value;
            const address = form.elements['address']?.value;

            if (!name || !email || !phone || !password) {
                toast.error("Please fill all required fields");
                return;
            }

            const procToast = toast.loading("Creating customer profile...");
            const token = localStorage.getItem('token');

            const res = await axios.post(
                '/api/admin/customers',
                {
                    fullName: name,
                    email,
                    mobile: phone,
                    address,
                    password: password
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                toast.dismiss(procToast);
                toast.success(`Customer ${name} added successfully`, {
                    style: { borderRadius: '15px', background: '#2D241E', color: '#fff' }
                });
                setShowAddCustomerModal(false);
                // Optionally refresh some dashboard stats here
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add customer");
            console.error("Add Customer Error:", err);
        }
    };





    return (
        <div className="space-y-6 max-w-[1600px] mx-auto min-h-screen pb-10 relative">
            {/* Header Block */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">

                        <h1 className="text-2xl font-bold text-[#2D241E] tracking-tight uppercase">Admin Dashboard</h1>
                        <span className="px-2 py-0.5 bg-[#2D241E] text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-lg shadow-black/10">MAIN</span>
                    </div>
                    <p className="text-[#897a70] text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-emerald-500"></span>
                        Live Overview • {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px] group-focus-within:text-[#2D241E] transition-colors">search</span>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleGlobalSearch}
                            className="pl-10 pr-4 py-3 bg-white/70 backdrop-blur-xl border border-white/60 rounded-2xl text-[10px] font-bold outline-none focus:ring-4 focus:ring-[#2D241E]/5 w-[280px] transition-all uppercase placeholder:text-gray-300 shadow-lg"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xl p-1 rounded-2xl border border-white/60 shadow-lg">
                        <button className="px-5 py-2 rounded-xl text-[10px] font-bold bg-[#2D241E] text-white shadow-xl shadow-black/20 uppercase tracking-wider">Live</button>
                        <button onClick={() => navigate('/admin/reports')} className="px-5 py-2 rounded-xl text-[10px] font-bold text-[#5C4D42] hover:bg-white/80 uppercase tracking-wider transition-all">Reports</button>
                    </div>
                    <button onClick={() => setShowBroadcast(true)} className="size-11 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 hover:scale-110 active:scale-95 transition-all">
                        <span className="material-symbols-outlined text-[20px]">campaign</span>
                    </button>
                </div>
            </div>




            {loading ? (
                <div className="space-y-6 animate-pulse">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <SkeletonLoader type="card" count={4} className="h-40" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                        <div className="lg:col-span-3 h-[420px] bg-gray-50 rounded-[2.5rem] border border-gray-100 p-6 relative overflow-hidden">
                            <SkeletonLoader type="text" count={1} className="w-1/2 mb-8 bg-gray-200" />
                            <div className="size-40 rounded-full border-[12px] border-gray-200 mx-auto mb-8"></div>
                            <SkeletonLoader type="text" count={3} className="mb-2 bg-gray-200" />
                        </div>
                        <div className="lg:col-span-6 h-[420px] bg-gray-50 rounded-[2.5rem] border border-gray-100 p-6">
                            <SkeletonLoader type="text" count={1} className="w-40 mb-6 bg-gray-200" />
                            <div className="h-64 bg-gray-200 rounded-xl w-full"></div>
                        </div>
                        <div className="lg:col-span-3 h-[420px] bg-gray-50 rounded-[2.5rem] border border-gray-100 p-6">
                            <SkeletonLoader type="text" count={1} className="w-32 mb-6 bg-gray-200" />
                            <SkeletonLoader type="text" count={6} className="h-12 mb-3 bg-gray-200" />
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Durable Broadcast Hub */}
                    {broadcast && (
                        <div className="bg-[#2D241E] p-4 rounded-3xl text-white shadow-2xl relative overflow-hidden group mb-6 animate-[slideIn_0.5s]">
                            <div className="absolute top-0 right-0 size-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all duration-700"></div>
                            <div className="relative flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 bg-white/10 rounded-2xl flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-[20px]">campaign</span>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5 italic">Live System Broadcast</h4>
                                        <p className="text-sm font-bold text-white italic tracking-tight">{broadcast}</p>
                                    </div>
                                </div>
                                <button onClick={handleDismissBroadcast} className="size-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <AdminStatCard
                            title="Total Sales (GMV)"
                            value={`₹${(stats.grossRevenue || 0).toLocaleString()}`}
                            trend="up"
                            trendValue="+18.4%"
                            icon="payments"
                            color="text-emerald-600"
                            delay="0ms"
                            onClick={() => navigate('/admin/finance')}
                        />
                        <AdminStatCard
                            title="Platform Earnings"
                            value={`₹${(stats.adminCommission || 0).toLocaleString()}`}
                            trend="up"
                            trendValue={`${stats.settings?.baseCommission || 15}% Fee`}
                            icon="account_balance_wallet"
                            color="text-blue-600"
                            delay="100ms"
                            onClick={() => navigate('/admin/finance')}
                        />
                        <AdminStatCard
                            title="Payable to Kitchens"
                            value={`₹${(stats.providerPayouts || 0).toLocaleString()}`}
                            trend="up"
                            trendValue="Payouts"
                            icon="handshake"
                            color="text-orange-500"
                            delay="200ms"
                            onClick={() => navigate('/admin/finance')}
                        />
                        <AdminStatCard
                            title="Active Users"
                            value={stats.totalCustomers || 0}
                            trend="up"
                            trendValue="+12.5%"
                            icon="group"
                            color="text-violet-600"
                            delay="300ms"
                            onClick={() => navigate('/admin/customers')}
                        />
                    </div>
            )}

                    {/* 3. Main Operations Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

                        {/* 3.1 Live Operations / Delivery Status (Width: 3/12) */}
                        <div className="lg:col-span-3 bg-white/70 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/60 shadow-lg flex flex-col h-[420px] relative overflow-hidden group">
                            <div className="absolute -top-24 -right-24 size-48 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors"></div>
                            <div className="flex items-center justify-between mb-6 relative z-10">
                                <h3 className="text-xs font-bold text-[#2D241E] uppercase tracking-wider flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-red-500 animate-pulse"></span>
                                    Delivery Status
                                </h3>
                                <span className="text-xs font-bold text-[#897a70] uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-lg italic">Live</span>
                            </div>

                            <div className="flex-1 flex flex-col justify-center space-y-6 relative z-10">
                                {/* Refined Progress Circle */}
                                <div className="relative size-36 mx-auto">
                                    <svg className="size-full rotate-[-90deg]" viewBox="0 0 36 36">
                                        <circle cx="18" cy="18" r="16" fill="transparent" stroke="#E5E7EB60" strokeWidth="2.5" />
                                        <circle cx="18" cy="18" r="16" fill="transparent" stroke="#FB923C" strokeWidth="2.5" strokeDasharray={`${stats.deliveryMetrics.completionRate}, 100`} strokeLinecap="round" className="animate-[dash_1.5s_ease-out]" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-bold text-[#2D241E] tracking-tight">{stats.deliveryMetrics.completionRate}%</span>
                                        <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mt-1">Completed</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: 'Done', val: stats.deliveryMetrics.settled, col: 'text-emerald-600', bg: 'bg-emerald-50' },
                                        { label: 'On Way', val: stats.deliveryMetrics.transit, col: 'text-orange-600', bg: 'bg-orange-50' },
                                        { label: 'Ready', val: stats.deliveryMetrics.staged, col: 'text-gray-500', bg: 'bg-gray-50' },
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
                                    View All Orders
                                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                </button>
                            </div>
                        </div>

                        {/* 3.2 Financial & Growth Graph (Width: 6/12) */}
                        <div className="lg:col-span-6 bg-white/70 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/60 shadow-lg flex flex-col h-[420px] relative overflow-hidden group">
                            <div className="absolute -bottom-24 -left-24 size-48 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
                            <div className="flex justify-between items-center mb-6 relative z-10">
                                <div>
                                    <h3 className="text-xs font-bold text-[#2D241E] uppercase tracking-wider italic">Revenue & Orders</h3>
                                    <p className="text-xs text-[#897a70] font-bold uppercase tracking-wider mt-0.5 opacity-80">Last 7 Days Performance</p>
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
                                    <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-orange-500 shadow-lg"></span><span className="text-xs font-bold uppercase tracking-wider text-[#5C4D42]">Sales</span></div>
                                    <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-blue-500 shadow-lg"></span><span className="text-xs font-bold uppercase tracking-wider text-[#5C4D42]">Orders</span></div>
                                </div>
                                <ResponsiveContainer width="100%" height="100%" minHeight={300}>
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
                        <div className="lg:col-span-3 bg-white/70 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/60 shadow-lg flex flex-col h-[420px] relative overflow-hidden group">
                            <div className="absolute top-0 left-0 size-full bg-[#F5F2EB]/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            <div className="flex items-center justify-between mb-6 relative z-10">
                                <h3 className="text-xs font-bold text-[#2D241E] uppercase tracking-wider">Pending Requests</h3>
                                <span className="flex items-center justify-center bg-rose-500 text-white font-bold text-xs px-2 py-0.5 rounded-lg shadow-lg shadow-rose-500/20">{approvals.length}</span>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar relative z-10">
                                <div className="space-y-4">
                                    {approvals.length === 0 ? (
                                        <div className="text-center py-16">
                                            <div className="size-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                                                <span className="material-symbols-outlined text-emerald-500 text-3xl">done_all</span>
                                            </div>
                                            <p className="text-xs font-bold text-[#2D241E] uppercase tracking-wider italic opacity-40">All Clear</p>
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
                                            <p className="text-sm font-bold text-[#2D241E] leading-tight mb-1">{(typeof item.name === 'string' ? item.name : 'Unknown')}</p>
                                            <p className="text-xs font-bold text-[#897a70] uppercase tracking-tight">{(typeof item.req === 'string' ? item.req : 'Request')}</p>
                                            <div className="flex gap-2 mt-4 opacity-0 group-hover/card:opacity-100 transition-all translate-y-2 group-hover/card:translate-y-0">
                                                <button
                                                    onClick={() => handleApprove(item.id, item.name)}
                                                    className="flex-1 py-2 bg-[#2D241E] text-white text-[10px] font-bold rounded-xl hover:bg-emerald-600 transition-all uppercase tracking-wider"
                                                >
                                                    Confirm
                                                </button>
                                                <button className="px-4 py-2 bg-gray-50 border border-gray-100 text-[#5C4D42] text-[10px] font-bold rounded-xl uppercase tracking-wider">View</button>
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
                                <h4 className="text-sm font-bold italic tracking-tight uppercase">System Status</h4>
                                <p className="text-xs text-white/40 font-bold uppercase tracking-wider mt-0.5">Live Status: <span className="text-emerald-400">{stats.systemHealth?.nodeStatus || 'Online'}</span></p>
                            </div>
                        </div>
                        <div className="flex items-center gap-8 relative z-10 pr-2">
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">Ping</p>
                                <p className="text-sm font-bold italic">{stats.systemHealth?.latency || '0ms'}</p>
                            </div>
                            <div className="w-px h-10 bg-white/10"></div>
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">Traffic</p>
                                <p className="text-sm font-bold italic">{stats.systemHealth?.traffic || 'Normal'}</p>
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
                                <h3 className="text-xs font-bold text-[#2D241E] uppercase tracking-wider">New Users</h3>
                                <button onClick={() => navigate('/admin/customers')} className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider">View All</button>
                            </div>
                            <div className="space-y-4 relative z-10 min-h-[200px]">
                                {stats.recentSignups.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full opacity-50 py-10">
                                        <span className="material-symbols-outlined text-4xl mb-2 text-[#2D241E]">person_off</span>
                                        <p className="text-xs font-bold uppercase text-[#897a70]">No New Users</p>
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
                                            <p className="text-sm font-bold text-[#2D241E] truncate italic">{(typeof (user.fullName || user.name) === 'string' ? (user.fullName || user.name) : 'Unknown User')}</p>
                                            <p className="text-xs font-bold text-[#897a70] uppercase tracking-tight">{user.email || (typeof user.plan === 'string' ? user.plan : '') || 'No Details'}</p>
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
                                <h3 className="text-xs font-bold text-[#2D241E] uppercase tracking-wider">Today's Menu</h3>
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider italic shadow-sm">Active</span>
                            </div>
                            <div className="flex gap-4 mb-3 relative z-10">
                                <div className="flex-1 p-4 bg-orange-50/50 rounded-[1.5rem] border border-orange-100/50 text-center hover:bg-orange-50 hover:shadow-lg transition-all cursor-default relative overflow-hidden">
                                    <span className="material-symbols-outlined text-[20px] text-orange-600 mb-2">sunny</span>
                                    <p className="text-sm font-bold text-[#2D241E] uppercase tracking-tight truncate px-1">{(typeof stats.menu?.lunch?.dish === 'string' ? stats.menu.lunch.dish : 'No Menu')}</p>
                                    <p className="text-[10px] font-bold text-[#897a70] uppercase tracking-wider mt-0.5">{(typeof stats.menu?.lunch?.type === 'string' ? stats.menu.lunch.type : '-') || '-'} • Lunch</p>
                                    {!stats.menu?.lunch?.dish && <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center font-bold text-xs text-gray-400">Not Set</div>}
                                </div>
                                <div className="flex-1 p-4 bg-indigo-50/50 rounded-[1.5rem] border border-indigo-100/50 text-center hover:bg-indigo-50 hover:shadow-lg transition-all cursor-default relative overflow-hidden">
                                    <span className="material-symbols-outlined text-[20px] text-indigo-600 mb-2">nightlight</span>
                                    <p className="text-sm font-bold text-[#2D241E] uppercase tracking-tight truncate px-1">{(typeof stats.menu?.dinner?.dish === 'string' ? stats.menu.dinner.dish : 'No Menu')}</p>
                                    <p className="text-[10px] font-bold text-[#897a70] uppercase tracking-wider mt-0.5">{(typeof stats.menu?.dinner?.type === 'string' ? stats.menu.dinner.type : '-') || '-'} • Dinner</p>
                                    {!stats.menu?.dinner?.dish && <div className="absolute inset-0 bg-gray-50/80 flex items-center justify-center font-bold text-xs text-gray-400">Not Set</div>}
                                </div>
                            </div>
                            <button onClick={() => navigate('/admin/menu')} className="w-full py-3 mt-1 bg-white/60 border border-white/40 text-xs font-bold text-[#5C4D42] rounded-xl hover:bg-white hover:text-[#2D241E] uppercase tracking-wider transition-all shadow-sm">Manage Menu</button>
                        </div>

                        {/* Operations Control */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Create Plan', icon: 'auto_awesome', path: '/admin/plans', col: 'bg-[#2D241E]', text: 'text-white' },
                                { label: 'Add User', icon: 'person_add', action: () => setShowAddCustomerModal(true), col: 'bg-white', text: 'text-[#2D241E]' },
                                { label: 'Settings', icon: 'manufacturing', path: '/admin/settings', col: 'bg-white', text: 'text-[#2D241E]' },
                                { label: 'Finance', icon: 'token', path: '/admin/finance', col: 'bg-white', text: 'text-[#2D241E]' },
                            ].map((btn, i) => (
                                <button
                                    key={i}
                                    onClick={btn.action ? btn.action : () => navigate(btn.path)}
                                    className={`${btn.col} ${btn.text} rounded-[1.5rem] p-4 flex flex-col items-center justify-center gap-2 border border-black/5 hover:scale-[1.05] active:scale-[0.95] transition-all shadow-xl hover:shadow-2xl relative overflow-hidden group`}
                                >
                                    <div className="absolute -top-4 -right-4 size-10 bg-white/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <span className="material-symbols-outlined text-[22px]">{btn.icon}</span>
                                    <span className="text-xs font-bold uppercase tracking-wider text-center">{btn.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Broadcast Modal */}
                    {
                        showBroadcast && createPortal(
                            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowBroadcast(false)}></div>
                                <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh]">

                                    {/* Compact Header */}
                                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="size-9 bg-blue-100 rounded-xl flex items-center justify-center">
                                                <span className="material-symbols-outlined text-blue-600 text-[20px]">record_voice_over</span>
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-gray-800">Broadcast Message</h3>
                                                <p className="text-xs text-gray-500">Reach all users instantly</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setShowBroadcast(false)} className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600">
                                            <span className="material-symbols-outlined text-[18px]">close</span>
                                        </button>
                                    </div>

                                    <div className="p-5 space-y-4">
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Message Content</label>
                                                <span className={`text-[10px] font-bold ${broadcastMsg.length > 130 ? 'text-red-500' : 'text-gray-400'}`}>
                                                    {broadcastMsg.length}/140
                                                </span>
                                            </div>
                                            <textarea
                                                placeholder="Write your announcement..."
                                                value={broadcastMsg}
                                                onChange={(e) => setBroadcastMsg(e.target.value)}
                                                className="w-full h-32 bg-gray-50 border border-gray-100 focus:border-blue-500 focus:bg-white rounded-xl p-4 text-sm text-gray-800 outline-none resize-none transition-all"
                                            />
                                        </div>

                                        <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-3">
                                            <span className="material-symbols-outlined text-blue-500 text-[18px] mt-0.5">info</span>
                                            <p className="text-[11px] font-medium text-blue-700 italic leading-snug">
                                                This alert will be visible at the top of the dashboard for every active user in the system.
                                            </p>
                                        </div>

                                        <div className="flex gap-2 pt-2">
                                            <button onClick={() => setShowBroadcast(false)} className="flex-1 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600">Cancel</button>
                                            <button
                                                onClick={sendBroadcast}
                                                disabled={isSending || !broadcastMsg.trim()}
                                                className="flex-[2] py-3 bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {isSending ? 'Sending Alert...' : 'Broadcast Alert'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>,
                            document.body
                        )
                    }

                    {/* System Logs Modal */}
                    {
                        showLogs && createPortal(
                            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowLogs(false)}></div>
                                <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh]">

                                    {/* Compact Header */}
                                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="size-9 bg-gray-100 rounded-xl flex items-center justify-center">
                                                <span className="material-symbols-outlined text-gray-600 text-[20px]">history</span>
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-gray-800">System Activity</h3>
                                                <p className="text-xs text-gray-500">Live events & audit trail</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-100 transition-all">Extract Report</button>
                                            <button onClick={() => setShowLogs(false)} className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600">
                                                <span className="material-symbols-outlined text-[18px]">close</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                        {stats.activityLogs.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                                                <span className="material-symbols-outlined text-5xl mb-2">history</span>
                                                <p className="text-sm font-bold uppercase tracking-widest">No Recent Activity</p>
                                            </div>
                                        ) : stats.activityLogs.map((log, i) => (
                                            <div key={i} className="flex items-start gap-4 p-3 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 rounded-xl transition-all group">
                                                <div className={`mt-0.5 size-10 rounded-lg flex items-center justify-center ${log.color} bg-opacity-10 shadow-sm flex-shrink-0`}>
                                                    <span className="material-symbols-outlined text-[18px]">{log.icon || 'info'}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <p className="text-[11px] font-bold text-gray-800 uppercase tracking-tight truncate">{(typeof log.event === 'string' ? log.event : 'System Event')}</p>
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase">
                                                            {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">
                                                        {log.detail || 'System operation executed successfully.'}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 mt-1.5">
                                                        <div className="size-1.5 rounded-full bg-emerald-500"></div>
                                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                                                            ADMIN: {log.admin?.fullName || 'SYSTEM'} • NODE_01
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>,
                            document.body
                        )
                    }

                    {/* Global Search Results Modal */}
                    {
                        showSearchModal && searchResults && createPortal(
                            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSearchModal(false)}></div>
                                <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh]">

                                    {/* Compact Header */}
                                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="size-9 bg-gray-100 rounded-xl flex items-center justify-center">
                                                <span className="material-symbols-outlined text-gray-600 text-[20px]">search</span>
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-gray-800">Search Results</h3>
                                                <p className="text-xs text-gray-500">Results for "{searchQuery}"</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setShowSearchModal(false)} className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600">
                                            <span className="material-symbols-outlined text-[18px]">close</span>
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-5 space-y-6">

                                        {/* 1. Users Section */}
                                        {searchResults?.users?.length > 0 && (
                                            <div>
                                                <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-4 border-b border-indigo-100 pb-2">Users ({searchResults?.users?.length})</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {searchResults.users.map(u => (
                                                        <div key={u._id} onClick={() => navigate(`/admin/customers?search=${u.email}`)} className="p-4 bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-lg cursor-pointer transition-all group">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`size-10 rounded-full flex items-center justify-center text-white text-xs font-bold ${u.role === 'provider' ? 'bg-violet-500' : 'bg-blue-500'}`}>
                                                                    {u.fullName[0]}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-[#2D241E] group-hover:text-indigo-600 transition-colors">{(typeof u.fullName === 'string' ? u.fullName : 'User')}</p>
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase">{(typeof u.role === 'string' ? u.role : 'Role')} • {(typeof u.status === 'string' ? u.status : 'Status')}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* 2. Providers Section */}
                                        {searchResults?.providerProfiles?.length > 0 && (
                                            <div>
                                                <h4 className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-4 border-b border-orange-100 pb-2">Kitchens ({searchResults?.providerProfiles?.length})</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {searchResults.providerProfiles.map(p => (
                                                        <div key={p._id} onClick={() => navigate(`/admin/providers?search=${p.messName}`)} className="p-4 bg-white rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-lg cursor-pointer transition-all flex justify-between items-center group">
                                                            <div>
                                                                <p className="text-sm font-bold text-[#2D241E] group-hover:text-orange-600 transition-colors">{(typeof p.messName === 'string' ? p.messName : 'Kitchen')}</p>
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase">Owner: {(typeof p.fullName === 'string' ? p.fullName : 'Unknown')}</p>
                                                            </div>
                                                            <span className="material-symbols-outlined text-orange-400">restaurant</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* 3. Orders Section */}
                                        {searchResults.orders.length > 0 && (
                                            <div>
                                                <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-4 border-b border-emerald-100 pb-2">Orders ({searchResults?.orders?.length})</h4>
                                                <div className="space-y-2">
                                                    {searchResults.orders.map(o => (
                                                        <div key={o._id} onClick={() => navigate(`/admin/orders?id=${o._id}`)} className="p-4 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg cursor-pointer transition-all flex items-center justify-between group">
                                                            <div className="flex items-center gap-4">
                                                                <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                                    <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-bold text-[#2D241E] group-hover:text-emerald-700">Order #{o._id.slice(-6).toUpperCase()}</p>
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Customer: {o.customer?.fullName || 'N/A'}</p>
                                                                </div>
                                                            </div>
                                                            <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-lg">{o.status}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Empty State */}
                                        {searchResults.users.length === 0 && searchResults.orders.length === 0 && searchResults.providerProfiles.length === 0 && (
                                            <div className="text-center py-12 opacity-50">
                                                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">travel_explore</span>
                                                <p className="text-sm font-bold text-[#2D241E] uppercase">No Matches Found</p>
                                                <p className="text-xs text-gray-400 font-bold mt-1">Try searching keywords like "John", "Tiffin", or Order IDs</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>,
                            document.body
                        )
                    }
                    {/* Add Customer Modal */}
                    {
                        showAddCustomerModal && createPortal(
                            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddCustomerModal(false)}></div>
                                <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[88vh]">

                                    {/* Compact Header */}
                                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-base font-bold text-gray-800">Add New Customer</h3>
                                            <p className="text-xs text-gray-500">Create a new customer profile</p>
                                        </div>
                                        <button onClick={() => setShowAddCustomerModal(false)} className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600">
                                            <span className="material-symbols-outlined text-[18px]">close</span>
                                        </button>
                                    </div>

                                    {/* Form Body */}
                                    <form ref={formRef} className="p-5 space-y-4 overflow-y-auto flex-1">
                                        <div className="flex items-center gap-4">
                                            <div className="size-14 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                                                <span className="material-symbols-outlined text-[20px]">person_add</span>
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-[10px] font-medium text-gray-500 mb-1 block uppercase tracking-wider font-bold">Full Name *</label>
                                                <input name="name" type="text" required placeholder="Enter name..." className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-[#2D241E] transition-colors" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[10px] font-medium text-gray-500 mb-1 block uppercase tracking-wider font-bold">Email *</label>
                                                <input name="email" type="email" required placeholder="customer@email.com" className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-[#2D241E] transition-colors" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-medium text-gray-500 mb-1 block uppercase tracking-wider font-bold">Phone *</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">+91</span>
                                                    <input name="phone" type="tel" required placeholder="00000 00000" className="w-full border border-gray-200 pl-10 pr-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-[#2D241E] transition-colors" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3">
                                            <div>
                                                <label className="text-[10px] font-medium text-gray-500 mb-1 block uppercase tracking-wider font-bold">Set Password *</label>
                                                <input name="password" type="password" required placeholder="Create password..." className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-[#2D241E] transition-colors" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-medium text-gray-500 mb-1 block uppercase tracking-wider font-bold">Address</label>
                                            <textarea name="address" placeholder="Enter delivery address..." className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-[#2D241E] transition-colors h-20 resize-none" />
                                        </div>
                                    </form>

                                    {/* Compact Footer */}
                                    <div className="p-3 border-t border-gray-100 flex justify-end gap-2">
                                        <button onClick={() => setShowAddCustomerModal(false)} className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600">Cancel</button>
                                        <button onClick={handleAddNewCustomer} className="px-5 py-2 bg-[#2D241E] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-black/10">
                                            <span className="material-symbols-outlined text-[16px]">person_add</span>
                                            Create Profile
                                        </button>
                                    </div>
                                </div>
                            </div>,
                            document.body
                        )
                    }
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
