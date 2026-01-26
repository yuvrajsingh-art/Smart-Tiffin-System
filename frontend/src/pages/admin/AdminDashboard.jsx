import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

const StatCard = ({ title, value, subtext, icon, trend, trendValue, color, delay }) => (
    <div className={`bg-white/70 backdrop-blur-2xl p-4 rounded-2xl border border-white/60 shadow-md shadow-black/[0.02] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden animate-[fadeIn_0.6s_ease-out]`} style={{ animationDelay: delay }}>
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
    return (
        <div className="space-y-4 max-w-[1600px] mx-auto min-h-full pb-4">

            {/* 1. Header & Quick Alerts */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 animate-[fadeIn_0.5s]">
                <div>
                    <h2 className="text-xl font-black text-[#2D241E] tracking-tight">Super Admin Console</h2>
                    <p className="text-[#5C4D42] text-xs font-medium opacity-80">System Overview • {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-xl text-[10px] font-bold text-rose-700 animate-pulse">
                        <span className="material-symbols-outlined text-[14px]">warning</span>
                        2 Critical Alerts
                    </div>
                    <div className="flex items-center gap-2 bg-white/60 p-1 rounded-xl border border-white/50 backdrop-blur-md shadow-sm">
                        <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-[#2D241E] text-white shadow-sm">Live</button>
                        <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-[#5C4D42] hover:bg-white/80">Reports</button>
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
                />
                <StatCard
                    title="Active Subs"
                    value="1,842"
                    trend="up"
                    trendValue="120 New"
                    icon="card_membership"
                    color="text-blue-600"
                    delay="100ms"
                />
                <StatCard
                    title="Live Orders"
                    value="428"
                    trend="up"
                    trendValue="Lunch"
                    icon="soup_kitchen"
                    color="text-orange-500"
                    delay="200ms"
                />
                <StatCard
                    title="Providers"
                    value="15"
                    trend="up"
                    trendValue="2 Pending"
                    icon="storefront"
                    color="text-violet-600"
                    delay="300ms"
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

                        <div className="grid grid-cols-3 gap-2 text-center">
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
                    </div>
                </div>

                {/* 3.2 Financial & Growth Graph (Width: 6/12) */}
                <div className="lg:col-span-6 bg-white/70 backdrop-blur-xl p-5 rounded-[1.5rem] border border-white/60 shadow-lg flex flex-col h-[340px]">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-sm font-bold text-[#2D241E]">System Growth</h3>
                            <p className="text-[10px] text-[#5C4D42]">Revenue vs Active Subs</p>
                        </div>
                        <div className="flex gap-2">
                            <span className="size-2 rounded-full bg-orange-500"></span> <span className="text-[10px] font-bold">Rev</span>
                            <span className="size-2 rounded-full bg-blue-500"></span> <span className="text-[10px] font-bold">Users</span>
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
                            {pendingApprovals.map((item) => (
                                <div key={item.id} className="p-2.5 bg-white/50 rounded-xl border border-white/40 hover:bg-white transition-all cursor-pointer group">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white ${item.type === 'Provider' ? 'bg-violet-500' : 'bg-red-500'}`}>{item.type}</span>
                                        <span className="text-[9px] text-[#5C4D42]">{item.time} ago</span>
                                    </div>
                                    <p className="text-xs font-bold text-[#2D241E] leading-tight">{item.name}</p>
                                    <p className="text-[10px] text-[#5C4D42]">{item.req}</p>
                                    <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="flex-1 py-1 bg-[#2D241E] text-white text-[9px] font-bold rounded">Approve</button>
                                        <button className="px-2 py-1 bg-gray-200 text-[#5C4D42] text-[9px] font-bold rounded">View</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Recent Registrations & Menu Status (Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Registrations */}
                <div className="bg-white/70 backdrop-blur-xl p-4 rounded-2xl border border-white/60 shadow-md">
                    <h3 className="text-sm font-bold text-[#2D241E] mb-3">Recent Signups</h3>
                    <div className="space-y-3">
                        {recentSignups.map((user) => (
                            <div key={user.id} className="flex items-center gap-3">
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
                    <button className="bg-[#2D241E] text-white rounded-xl p-3 flex flex-col items-center justify-center gap-1 hover:bg-[#453831] transition-colors">
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                        <span className="text-[10px] font-bold">New Plan</span>
                    </button>
                    <button className="bg-white text-[#2D241E] border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center gap-1 hover:border-orange-500 hover:text-orange-600 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">group_add</span>
                        <span className="text-[10px] font-bold">Add User</span>
                    </button>
                    <button className="bg-white text-[#2D241E] border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center gap-1 hover:border-blue-500 hover:text-blue-600 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">campaign</span>
                        <span className="text-[10px] font-bold">Broadcast</span>
                    </button>
                    <button className="bg-white text-[#2D241E] border border-gray-200 rounded-xl p-3 flex flex-col items-center justify-center gap-1 hover:border-red-500 hover:text-red-600 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">settings</span>
                        <span className="text-[10px] font-bold">Settings</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
