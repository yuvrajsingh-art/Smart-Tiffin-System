import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';

const ordersData = [
    { id: 'ORD2901', customer: 'Rahul Sharma', kitchen: 'Annapurna Rasoi', type: 'Monthly Veg', status: 'Delivered', time: '12:45 PM', zone: 'Sector 7' },
    { id: 'ORD2902', customer: 'Priya Verma', kitchen: 'Spice Route', type: 'Weekly Non-Veg', status: 'In Transit', time: '1:10 PM', zone: 'Vijay Nagar' },
    { id: 'ORD2903', customer: 'Amit Kumar', kitchen: 'Home Taste', type: 'Trial', status: 'Preparing', time: 'Pending', zone: 'Rajwada' },
    { id: 'ORD2904', customer: 'Sneha Patel', kitchen: 'Annapurna Rasoi', type: 'Monthly Veg', status: 'Cancelled', time: '-', zone: 'Annapurna' },
    { id: 'ORD2905', customer: 'Vikram Singh', kitchen: 'Spice Route', type: 'Trial', status: 'Out for Delivery', time: '1:30 PM', zone: 'Vijay Nagar' },
];

const AdminOrders = () => {
    const [filter, setFilter] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalTab, setModalTab] = useState('Intelligence');

    const handleAction = (type, id) => {
        toast.success(`${type} action for ${id}`, {
            style: { borderRadius: '10px', background: '#2D241E', color: '#fff', fontSize: '10px' }
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-emerald-100 text-emerald-600';
            case 'In Transit': return 'bg-blue-100 text-blue-600';
            case 'Out for Delivery': return 'bg-orange-100 text-orange-600';
            case 'Preparing': return 'bg-amber-100 text-amber-600';
            case 'Cancelled': return 'bg-red-50 text-red-500';
            default: return 'bg-gray-100 text-gray-500';
        }
    };

    const filteredOrders = filter === 'All' ? ordersData : ordersData.filter(o => o.status === filter);

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto min-h-full pb-8 animate-[fadeIn_0.5s]">

            {/* 1. Header & Live Toggle */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black text-[#2D241E] tracking-tight flex items-center gap-2">
                        Live Order Tracking
                        <span className="size-2 rounded-full bg-red-500 animate-pulse"></span>
                    </h2>
                    <p className="text-[#5C4D42] text-xs font-medium opacity-80 mt-0.5 font-display italic">Monitoring 1,248 active deliveries for Lunch.</p>
                </div>

                <div className="flex items-center gap-2 bg-white/40 p-1.5 rounded-2xl border border-white/60 backdrop-blur-md">
                    <button className="px-4 py-2 rounded-xl text-[10px] font-bold bg-[#2D241E] text-white shadow-md">Today</button>
                    <button className="px-4 py-2 rounded-xl text-[10px] font-bold text-[#5C4D42] hover:bg-white/80 transition-all">Past Orders</button>
                    <div className="w-px h-4 bg-gray-200 mx-1"></div>
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-[10px] font-bold hover:bg-emerald-100 transition-all">
                        <span className="material-symbols-outlined text-[16px]">print</span>
                        Manifest
                    </button>
                </div>
            </div>

            {/* 2. Visual Progress Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Orders', val: '428', icon: 'list_alt', color: 'text-[#2D241E]', bg: 'bg-white' },
                    { label: 'In Transit', val: '125', icon: 'local_shipping', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Delivered', val: '280', icon: 'check_circle', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Delayed', val: '23', icon: 'history', color: 'text-red-600', bg: 'bg-red-50' },
                ].map((stat, i) => (
                    <div key={i} className={`${stat.bg} p-5 rounded-[2rem] border border-white/60 shadow-sm flex items-center justify-between group hover:scale-[1.02] transition-transform cursor-pointer`}>
                        <div>
                            <p className="text-[9px] font-black text-[#5C4D42]/60 uppercase tracking-widest">{stat.label}</p>
                            <h3 className={`text-2xl font-black ${stat.color}`}>{stat.val}</h3>
                        </div>
                        <div className={`size-12 rounded-2xl flex items-center justify-center ${stat.bg === 'bg-white' ? 'bg-gray-50' : 'bg-white/50 shadow-inner'}`}>
                            <span className={`material-symbols-outlined text-2xl ${stat.color}`}>{stat.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Filter Bar */}
            <div className="flex items-center gap-1.5 p-1.5 bg-white/50 backdrop-blur-md rounded-2xl border border-white/60 w-fit overflow-x-auto">
                {['All', 'Preparing', 'Out for Delivery', 'In Transit', 'Delivered', 'Cancelled'].map(t => (
                    <button
                        key={t}
                        onClick={() => setFilter(t)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all ${filter === t ? 'bg-[#2D241E] text-white shadow-md' : 'text-[#897a70] hover:text-[#2D241E] hover:bg-white/50'}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* 4. Live Orders Table */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/50 border-b border-gray-100">
                                <th className="px-6 py-5 text-[10px] font-black text-[#897a70] uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-5 text-[10px] font-black text-[#897a70] uppercase tracking-wider">Customer & Plan</th>
                                <th className="px-6 py-5 text-[10px] font-black text-[#897a70] uppercase tracking-wider">Kitchen Hub</th>
                                <th className="px-6 py-5 text-[10px] font-black text-[#897a70] uppercase tracking-wider">Delivery Zone</th>
                                <th className="px-6 py-5 text-[10px] font-black text-[#897a70] uppercase tracking-wider">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-[#897a70] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="group hover:bg-white/60 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-xs font-black text-[#2D241E]">{order.id}</p>
                                        <p className="text-[9px] font-bold text-[#897a70]">{order.time}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-xs font-bold text-[#2D241E]">{order.customer}</p>
                                        <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded uppercase">{order.type}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="size-2 rounded-full bg-violet-500"></div>
                                            <p className="text-xs font-medium text-[#5C4D42]">{order.kitchen}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-[#5C4D42]">{order.zone}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${getStatusColor(order.status)} shadow-sm`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="size-8 rounded-lg bg-[#2D241E] text-white flex items-center justify-center hover:bg-orange-600 transition-all shadow-md shadow-black/10"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">near_me</span>
                                            </button>
                                            <button
                                                onClick={() => handleAction('Contact', order.id)}
                                                className="size-8 rounded-lg bg-white border border-gray-200 text-[#5C4D42] flex items-center justify-center hover:border-[#2D241E] transition-all"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">call</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order DNA Monitor Modal - [NEW FUSION] */}
            {selectedOrder && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2D241E]/80 backdrop-blur-md animate-[fadeIn_0.3s]" onClick={() => setSelectedOrder(null)}></div>
                    <div className="bg-white rounded-[3rem] w-full max-w-3xl overflow-hidden shadow-2xl animate-[scaleIn_0.3s] relative z-10 border border-black/5 flex flex-col max-h-[92vh]">

                        {/* Modal Header [DNA STYLE] */}
                        <div className="p-8 pb-4 flex justify-between items-start shrink-0">
                            <div>
                                <h3 className="text-2xl font-black text-[#2D241E]">Order DNA</h3>
                                <p className="text-[11px] font-bold text-[#897a70] mt-1">Live tracking & cluster logistics intelligence</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="size-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all">
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        </div>

                        {/* Tab Navigation - Operational Control */}
                        <div className="px-8 mb-4 shrink-0 overflow-x-auto no-scrollbar">
                            <div className="flex gap-1 bg-gray-50 p-1.5 rounded-[1.5rem] border border-black/5 w-fit">
                                {[
                                    { id: 'Intelligence', label: 'Intelligence', icon: 'near_me' },
                                    { id: 'Manifest', label: 'Manifest', icon: 'list_alt' },
                                    { id: 'Logistics', label: 'Logistics', icon: 'local_shipping' },
                                    { id: 'Finance', label: 'Financials', icon: 'payments' },
                                    { id: 'Audit', label: 'Audit Trail', icon: 'history' },
                                ].map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setModalTab(t.id)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-tight transition-all whitespace-nowrap ${modalTab === t.id ? 'bg-[#2D241E] text-white shadow-lg' : 'text-[#897a70] hover:bg-white hover:text-[#2D241E]'}`}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Modal Content - Scrollable Region */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-4 space-y-8">

                            {/* Order Identification Card */}
                            <div className="p-5 bg-[#FDFBF9] border border-orange-100/50 rounded-[2.5rem] flex items-center gap-6 shadow-sm">
                                <div className="relative">
                                    <div className="size-20 rounded-2xl bg-[#2D241E] flex items-center justify-center text-white shadow-lg border-2 border-white">
                                        <span className="material-symbols-outlined text-4xl">inventory_2</span>
                                    </div>
                                    <div className="absolute -bottom-2 -left-2 bg-orange-500 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase border-2 border-white shadow-sm">Live</div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xl font-black text-[#2D241E] tracking-tight">#{selectedOrder.id}</h4>
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#897a70]">
                                            <span className="material-symbols-outlined text-[14px]">account_circle</span>
                                            {selectedOrder.customer}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#897a70]">
                                            <span className="material-symbols-outlined text-[14px]">store</span>
                                            {selectedOrder.kitchen}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {modalTab === 'Intelligence' && (
                                <div className="space-y-8 animate-[fadeIn_0.3s]">
                                    {/* Timeline */}
                                    <div className="space-y-4">
                                        <h5 className="text-[11px] font-black text-[#2D241E] uppercase tracking-widest flex items-center gap-2">
                                            <span className="material-symbols-outlined text-orange-500 text-[18px]">route</span>
                                            Delivery Pulse
                                        </h5>
                                        <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-[2.5rem] space-y-6">
                                            {[
                                                { time: '12:40 PM', label: 'Order Confirmed', done: true },
                                                { time: '1:05 PM', label: 'Kitchen Handover', done: true },
                                                { time: '1:15 PM', label: 'Pickup Completed', done: selectedOrder.status !== 'Preparing' },
                                                { time: 'ETA 1:45 PM', label: 'Expected Delivery', done: false, active: true },
                                            ].map((step, i) => (
                                                <div key={i} className="flex gap-4 relative">
                                                    {i < 3 && <div className={`absolute left-[5px] top-4 w-px h-8 ${step.done ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>}
                                                    <div className={`size-3 rounded-full mt-1.5 z-10 ${step.done ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : step.active ? 'bg-orange-500 animate-pulse' : 'bg-gray-200'}`}></div>
                                                    <div>
                                                        <p className={`text-[11px] font-black ${step.done ? 'text-[#2D241E]' : 'text-[#897a70]'}`}>{step.label}</p>
                                                        <p className="text-[9px] font-bold text-[#897a70]/60 uppercase">{step.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Quick Info Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-[2rem] flex items-center justify-between">
                                            <div><p className="text-[9px] font-black text-blue-900/50 uppercase">Current Zone</p><h5 className="text-xl font-black text-blue-900 italic">{selectedOrder.zone}</h5></div>
                                            <span className="material-symbols-outlined text-blue-400">near_me</span>
                                        </div>
                                        <div className="p-5 bg-violet-50/50 border border-violet-100 rounded-[2rem] flex items-center justify-between">
                                            <div><p className="text-[9px] font-black text-violet-900/50 uppercase">Fleet Sync</p><h5 className="text-xl font-black text-violet-900 italic">Agent ID: 441</h5></div>
                                            <span className="material-symbols-outlined text-violet-400">delivery_dining</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalTab === 'Manifest' && (
                                <div className="space-y-6 animate-[fadeIn_0.3s]">
                                    <div className="p-6 bg-gray-50 rounded-[2.5rem] space-y-4">
                                        <p className="text-[10px] font-black text-[#897a70] uppercase tracking-widest ml-1">Included Items</p>
                                        <div className="flex justify-between items-center p-5 bg-white rounded-3xl shadow-sm border border-black/5">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#2D241E]"><span className="material-symbols-outlined">lunch_dining</span></div>
                                                <div><p className="text-sm font-black text-[#2D241E]">{selectedOrder.type}</p><p className="text-[9px] text-[#897a70] font-bold">QTY: 1 • Standard Cluster Packaging</p></div>
                                            </div>
                                            <p className="text-sm font-black text-[#2D241E]">Live</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 bg-white border border-gray-100 rounded-[2rem] space-y-2">
                                            <p className="text-[10px] font-black text-[#897a70] uppercase">Kitchen Credentials</p>
                                            <p className="text-xs font-black text-[#2D241E]">{selectedOrder.kitchen}</p>
                                            <p className="text-[9px] font-bold text-[#897a70]">Indore Central Hub • Grade A</p>
                                        </div>
                                        <div className="p-5 bg-white border border-gray-100 rounded-[2rem] space-y-2">
                                            <p className="text-[10px] font-black text-[#897a70] uppercase">Customer Notes</p>
                                            <p className="text-xs font-black text-[#2D241E]">Leave at security gate</p>
                                            <p className="text-[9px] font-bold text-blue-600">Priority Instruction</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalTab === 'Logistics' && (
                                <div className="space-y-6 animate-[fadeIn_0.3s]">
                                    <div className="aspect-video bg-gray-100 rounded-[2.5rem] relative overflow-hidden flex items-center justify-center">
                                        <div className="absolute inset-0 bg-[#2D241E]/5 bg-[radial-gradient(#2D241E_1px,transparent_1px)] [background-size:20px_20px]"></div>
                                        <div className="relative z-10 text-center space-y-4">
                                            <div className="size-16 bg-[#2D241E] text-white rounded-[1.5rem] flex items-center justify-center mx-auto shadow-2xl animate-bounce"><span className="material-symbols-outlined text-3xl">map</span></div>
                                            <div><h4 className="text-sm font-black text-[#2D241E]">Cluster Map View</h4><p className="text-[10px] font-bold text-[#897a70]">{selectedOrder.zone} Corridor Mapping</p></div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button className="flex-1 py-4 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">Live Reroute</button>
                                        <button className="flex-1 py-4 bg-[#2D241E] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Assign Backup</button>
                                    </div>
                                </div>
                            )}

                            {modalTab === 'Finance' && (
                                <div className="space-y-6 animate-[fadeIn_0.3s]">
                                    <div className="p-8 bg-[#2D241E] rounded-[2.5rem] text-white flex justify-between items-center shadow-xl">
                                        <div>
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Gross Revenue</p>
                                            <h4 className="text-4xl font-black mt-1 italic tracking-tight">₹142.00</h4>
                                        </div>
                                        <span className="material-symbols-outlined text-4xl text-emerald-400">payments</span>
                                    </div>
                                    <div className="space-y-3 p-2">
                                        {[
                                            { label: 'Base Fare', val: '₹120.00' },
                                            { label: 'Logistics Fee', val: '₹15.00' },
                                            { label: 'Platform GST', val: '₹7.00' },
                                        ].map((row, i) => (
                                            <div key={i} className="flex justify-between items-center text-[11px] font-bold">
                                                <span className="text-[#897a70] uppercase">{row.label}</span>
                                                <span className="text-[#2D241E]">{row.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {modalTab === 'Audit' && (
                                <div className="space-y-4 animate-[fadeIn_0.3s]">
                                    <p className="text-[10px] font-black text-[#897a70] uppercase tracking-widest ml-1">System Audit Logs</p>
                                    {[
                                        { action: 'Status Changed to Transit', by: 'System Auto-Sync', time: '1:15 PM' },
                                        { action: 'Handover Verified', by: 'Annapurna Kitchen', time: '1:05 PM' },
                                        { action: 'Order Created', by: 'Rahul Sharma', time: '12:40 PM' },
                                    ].map((log, i) => (
                                        <div key={i} className="p-4 bg-white border border-gray-100 rounded-2xl flex justify-between items-center shadow-sm">
                                            <div><p className="text-xs font-black text-[#2D241E]">{log.action}</p><p className="text-[9px] text-[#897a70] font-bold">BY: {log.by}</p></div>
                                            <p className="text-[9px] font-black text-[#897a70]">{log.time}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer [DNA STYLE] */}
                        <div className="p-8 pb-10 bg-white border-t border-gray-50 flex items-center justify-end gap-10 shrink-0">
                            <button onClick={() => setSelectedOrder(null)} className="text-[12px] font-black text-[#897a70] hover:text-[#2D241E] transition-colors">Close</button>
                            <button onClick={() => {
                                toast.success('Order Record Locked & Verified');
                                setSelectedOrder(null);
                            }} className="px-12 py-5 bg-[#FF5722] text-white rounded-[1.5rem] text-[12px] font-black shadow-[0_10px_25px_-5px_rgba(255,87,34,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all">Save Changes</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AdminOrders;
