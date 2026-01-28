import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';

// -- Mock Data Generators --
const generateTodayOrders = () => [
    { id: 'ORD2901', customer: 'Rahul Sharma', kitchen: 'Annapurna Rasoi', type: 'Monthly Veg', status: 'Delivered', time: '12:45 PM', zone: 'Sector 7', rider: 'Vikram (ID: 402)' },
    { id: 'ORD2902', customer: 'Priya Verma', kitchen: 'Spice Route', type: 'Weekly Non-Veg', status: 'In Transit', time: '1:10 PM', zone: 'Vijay Nagar', rider: 'Amit (ID: 881)' },
    { id: 'ORD2903', customer: 'Amit Kumar', kitchen: 'Home Taste', type: 'Trial', status: 'Preparing', time: 'Pending', zone: 'Rajwada', rider: 'Searching...' },
    { id: 'ORD2904', customer: 'Sneha Patel', kitchen: 'Annapurna Rasoi', type: 'Monthly Veg', status: 'Cancelled', time: '-', zone: 'Annapurna', rider: '-' },
    { id: 'ORD2905', customer: 'Vikram Singh', kitchen: 'Spice Route', type: 'Trial', status: 'Out for Delivery', time: '1:30 PM', zone: 'Vijay Nagar', rider: 'Rohan (ID: 102)' },
];

const generatePastOrders = () => [
    { id: 'ORD2899', customer: 'Anjali Gupta', kitchen: 'Spice Route', type: 'Monthly Veg', status: 'Delivered', time: 'Yesterday', zone: 'Sector 7', rider: 'Vikram (ID: 402)' },
    { id: 'ORD2898', customer: 'Rohan Mehra', kitchen: 'Home Taste', type: 'Trial', status: 'Delivered', time: 'Yesterday', zone: 'Rajwada', rider: 'Amit (ID: 881)' },
    { id: 'ORD2897', customer: 'Suresh Raina', kitchen: 'Annapurna Rasoi', type: 'Weekly Non-Veg', status: 'Failed', time: 'Yesterday', zone: 'Bhawarkua', rider: 'Raju (ID: 555)' },
];

const availableRiders = [
    { id: 'R1', name: 'Suresh Kumar', dist: '0.8km', status: 'Free', rating: 4.8 },
    { id: 'R2', name: 'Deepak Verma', dist: '1.2km', status: 'Busy', rating: 4.5 },
    { id: 'R3', name: 'Ankit Singh', dist: '2.5km', status: 'Free', rating: 4.9 },
    { id: 'R4', name: 'Rajesh Koothrappali', dist: '3.1km', status: 'Free', rating: 4.7 },
];

const AdminOrders = () => {
    // -- State Management --
    const [viewMode, setViewMode] = useState('Today'); // 'Today' | 'Past'
    const [orders, setOrders] = useState(generateTodayOrders());
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState(''); // [NEW] Search State
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalTab, setModalTab] = useState('Intelligence');
    const [showRiderModal, setShowRiderModal] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);

    // -- Effects --
    useEffect(() => {
        // Switch data based on view mode
        if (viewMode === 'Today') {
            setOrders(generateTodayOrders());
        } else {
            setOrders(generatePastOrders());
        }
        setFilter('All'); // Reset filter on view switch
        setSearchQuery(''); // Reset search on view switch
    }, [viewMode]);

    // -- Handlers --
    const handleCallCustomer = (order) => {
        toast.loading(`Dialing ${order.customer}...`, { id: 'call' });
        setTimeout(() => {
            toast.success("Connected", { id: 'call', icon: '📞' });
        }, 1500);
    };

    const handlePrintManifest = () => {
        setIsPrinting(true);
        toast.success("Generating Daily Manifest...", { icon: '🖨️' });
        setTimeout(() => {
            window.print();
            setIsPrinting(false);
        }, 800);
    };

    const handleAssignRider = (rider) => {
        if (!selectedOrder) return;

        toast.loading(`Assigning ${rider.name} to #${selectedOrder.id}...`);

        setTimeout(() => {
            // Update local state
            setOrders(prev => prev.map(o =>
                o.id === selectedOrder.id
                    ? { ...o, rider: `${rider.name.split(' ')[0]} (ID: ${rider.id})`, status: o.status === 'Preparing' ? 'In Transit' : o.status }
                    : o
            ));

            // Also update the selected order in view to reflect change immediately if modal stays open (though we close it)
            setSelectedOrder(prev => ({ ...prev, rider: `${rider.name.split(' ')[0]} (ID: ${rider.id})` }));

            toast.dismiss();
            toast.success(`Rider Assigned Successfully!`, { icon: '🛵' });
            setShowRiderModal(false);
        }, 1200);
    };

    const handleStatusUpdate = (newStatus) => {
        if (!selectedOrder) return;

        setOrders(prev => prev.map(o =>
            o.id === selectedOrder.id ? { ...o, status: newStatus } : o
        ));
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        toast.success(`Order Marked as ${newStatus}`);
    };

    // -- Utilities --
    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-emerald-100 text-emerald-600';
            case 'In Transit': return 'bg-blue-100 text-blue-600';
            case 'Out for Delivery': return 'bg-orange-100 text-orange-600';
            case 'Preparing': return 'bg-amber-100 text-amber-600';
            case 'Cancelled': return 'bg-red-50 text-red-500';
            case 'Failed': return 'bg-rose-100 text-rose-600';
            default: return 'bg-gray-100 text-gray-500';
        }
    };

    const filteredOrders = orders.filter(o => {
        // 1. Status Filter
        const matchesStatus = filter === 'All' ? true : o.status === filter;
        // 2. Search Filter (ID, Customer, Kitchen) [NEW]
        const matchesSearch = searchQuery === '' ? true :
            o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.kitchen.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    // -- Calculations for Stats --
    const stats = {
        total: orders.length,
        transit: orders.filter(o => o.status === 'In Transit' || o.status === 'Out for Delivery').length,
        delivered: orders.filter(o => o.status === 'Delivered').length,
        issue: orders.filter(o => o.status === 'Cancelled' || o.status === 'Failed').length
    };

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto min-h-full pb-8 animate-[fadeIn_0.5s]">

            {/* Live Ticker */}
            <div className="w-full bg-[#2D241E] text-white overflow-hidden py-1.5 rounded-xl shadow-lg flex items-center gap-4 px-4 relative z-0">
                <div className="flex items-center gap-1 shrink-0 z-10 bg-[#2D241E] pr-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-red-400">Logistics Live</span>
                </div>
                <div className="flex gap-8 animate-[marquee_20s_linear_infinite] whitespace-nowrap opacity-80 hover:opacity-100 transition-opacity">
                    {[
                        "Heavy traffic reported in Sector 7 - Re-routing drivers",
                        "Order #ORD2901 Delivered safely by Vikram",
                        "Kitchen 'Spice Route' is experiencing high volume",
                        "New 'Winter Special' batch pickup initiated",
                        "Rider #441 is currently offline"
                    ].map((item, i) => (
                        <span key={i} className="text-[10px] font-bold flex items-center gap-2">
                            <span className="size-1 bg-white/20 rounded-full"></span>
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            {/* 1. Header & Live Toggle */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black text-[#2D241E] tracking-tight flex items-center gap-2">
                        Fleet & Orders
                        <span className="px-2 py-0.5 bg-blue-500 text-white text-[9px] font-black rounded-lg uppercase tracking-wider">Dispatch</span>
                    </h2>
                    <p className="text-[#5C4D42] text-xs font-medium opacity-80 mt-0.5 font-display italic">
                        {viewMode === 'Today' ? 'Live monitoring of active deliveries.' : 'Historical archive of past orders.'}
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-white/40 p-1.5 rounded-2xl border border-white/60 backdrop-blur-md">
                    {/* Search Input */}
                    <div className="relative group">
                        <span className="absolute left-3 top-2.5 material-symbols-outlined text-[18px] text-gray-400 group-focus-within:text-[#2D241E] transition-colors">search</span>
                        <input
                            type="text"
                            placeholder="Search Order ID, Customer..."
                            className="bg-transparent border-none outline-none text-[10px] font-bold text-[#2D241E] p-2.5 pl-9 w-32 focus:w-48 transition-all placeholder:text-gray-400"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="w-px h-4 bg-gray-200 mx-1"></div>
                    <button
                        onClick={() => setViewMode('Today')}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${viewMode === 'Today' ? 'bg-[#2D241E] text-white shadow-md' : 'text-[#5C4D42] hover:bg-white/80'}`}
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setViewMode('Past')}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${viewMode === 'Past' ? 'bg-[#2D241E] text-white shadow-md' : 'text-[#5C4D42] hover:bg-white/80'}`}
                    >
                        Past Orders
                    </button>
                    <div className="w-px h-4 bg-gray-200 mx-1"></div>
                    <button
                        onClick={handlePrintManifest}
                        disabled={isPrinting}
                        className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-[10px] font-bold hover:bg-emerald-100 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-[16px]">print</span>
                        Manifest
                    </button>
                </div>
            </div>

            {/* 2. Visual Progress Summary (Dynamic) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Orders', val: stats.total, icon: 'list_alt', color: 'text-[#2D241E]', bg: 'bg-white' },
                    { label: 'Active / Transit', val: stats.transit, icon: 'local_shipping', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Delivered', val: stats.delivered, icon: 'check_circle', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Issues / Cancelled', val: stats.issue, icon: 'warning', color: 'text-red-600', bg: 'bg-red-50' },
                ].map((stat, i) => (
                    <div key={i} onClick={() => toast('Detailed analytics coming soon!', { icon: '📊', style: { fontSize: '12px' } })} className={`${stat.bg} p-5 rounded-[2rem] border border-white/60 shadow-sm flex items-center justify-between group hover:scale-[1.02] transition-transform cursor-pointer select-none`}>
                        <div>
                            <p className="text-[9px] font-black text-[#5C4D42]/60 uppercase tracking-widest">{stat.label}</p>
                            <h3 className={`text-2xl font-black ${stat.color} mt-1`}>{stat.val}</h3>
                        </div>
                        <div className={`size-12 rounded-2xl flex items-center justify-center ${stat.bg === 'bg-white' ? 'bg-gray-50' : 'bg-white/50 shadow-inner'}`}>
                            <span className={`material-symbols-outlined text-2xl ${stat.color}`}>{stat.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Filter Bar */}
            <div className="flex items-center gap-1.5 p-1.5 bg-white/50 backdrop-blur-md rounded-2xl border border-white/60 w-fit overflow-x-auto custom-scrollbar">
                {['All', 'Preparing', 'Out for Delivery', 'In Transit', 'Delivered', 'Cancelled', 'Failed'].map(t => (
                    <button
                        key={t}
                        onClick={() => setFilter(t)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all ${filter === t ? 'bg-[#2D241E] text-white shadow-md' : 'text-[#897a70] hover:text-[#2D241E] hover:bg-white/50'}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* 4. Orders Table */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-lg overflow-hidden min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/50 border-b border-gray-100">
                                <th className="px-6 py-5 text-[10px] font-black text-[#897a70] uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-5 text-[10px] font-black text-[#897a70] uppercase tracking-wider">Customer & Plan</th>
                                <th className="px-6 py-5 text-[10px] font-black text-[#897a70] uppercase tracking-wider">Kitchen Hub</th>
                                <th className="px-6 py-5 text-[10px] font-black text-[#897a70] uppercase tracking-wider">Logistics</th>
                                <th className="px-6 py-5 text-[10px] font-black text-[#897a70] uppercase tracking-wider">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-[#897a70] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-white/60 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-black text-[#2D241E]">{order.id}</p>
                                            <p className="text-[9px] font-bold text-[#897a70]">{order.time}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-bold text-[#2D241E] cursor-pointer hover:underline" onClick={() => handleCallCustomer(order)}>{order.customer}</p>
                                            <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded uppercase">{order.type}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="size-2 rounded-full bg-violet-500"></div>
                                                <p className="text-xs font-medium text-[#5C4D42]">{order.kitchen}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-bold text-[#5C4D42]">{order.zone}</p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <span className="material-symbols-outlined text-[10px] text-gray-400">two_wheeler</span>
                                                <span className={`text-[9px] font-bold ${order.rider.includes('Searching') || order.rider === '-' ? 'text-red-400 animate-pulse' : 'text-emerald-600'}`}>{order.rider}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${getStatusColor(order.status)} shadow-sm`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleCallCustomer(order)}
                                                    className="size-8 rounded-lg bg-white border border-gray-200 text-[#5C4D42] flex items-center justify-center hover:border-[#2D241E] hover:text-[#2D241E] transition-all"
                                                    title="Call Customer"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">call</span>
                                                </button>
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="size-8 rounded-lg bg-[#2D241E] text-white flex items-center justify-center hover:bg-orange-600 transition-all shadow-md shadow-black/10"
                                                    title="Track Order DNA"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">near_me</span>
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedOrder(order); setShowRiderModal(true); }}
                                                    className="size-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-all"
                                                    title="Reassign Rider"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">alt_route</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-60">
                                            <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                                <span className="material-symbols-outlined text-3xl text-gray-300">local_shipping</span>
                                            </div>
                                            <p className="text-xs font-black text-[#2D241E]">No Orders Found</p>
                                            <p className="text-[10px] font-bold text-[#897a70] mt-0.5">There are no orders with status "{filter}".</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order DNA Monitor Modal */}
            {selectedOrder && !showRiderModal && createPortal(
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

                        {/* Tab Navigation */}
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

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-4 space-y-8">

                            {/* Order Identification Card */}
                            <div className="p-5 bg-[#FDFBF9] border border-orange-100/50 rounded-[2.5rem] flex items-center gap-6 shadow-sm">
                                <div className="relative">
                                    <div className="size-20 rounded-2xl bg-[#2D241E] flex items-center justify-center text-white shadow-lg border-2 border-white">
                                        <span className="material-symbols-outlined text-4xl">inventory_2</span>
                                    </div>
                                    <div className={`absolute -bottom-2 -left-2 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase border-2 border-white shadow-sm ${selectedOrder.status === 'Cancelled' ? 'bg-red-500' : 'bg-orange-500'}`}>
                                        {selectedOrder.status === 'Delivered' ? 'Done' : 'Live'}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xl font-black text-[#2D241E] tracking-tight">#{selectedOrder.id}</h4>

                                        {/* Status Dropdown / Indicator */}
                                        <div className="relative group">
                                            <button className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase ${getStatusColor(selectedOrder.status)}`}>
                                                {selectedOrder.status}
                                            </button>
                                            {/* Mini Status Changer for Quick Action */}
                                            <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-2 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none transition-all z-20 w-32 flex flex-col gap-1">
                                                {['Preparing', 'In Transit', 'Delivered'].map(s => (
                                                    <button key={s} onClick={() => handleStatusUpdate(s)} className="text-left text-[10px] font-bold p-1.5 hover:bg-gray-50 rounded-lg text-[#2D241E]">{s}</button>
                                                ))}
                                            </div>
                                        </div>
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

                            {/* Tab Content Rendering */}
                            {modalTab === 'Intelligence' && (
                                <div className="space-y-8 animate-[fadeIn_0.3s]">
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
                                                { time: 'ETA 1:45 PM', label: 'Expected Delivery', done: selectedOrder.status === 'Delivered', active: selectedOrder.status === 'In Transit' || selectedOrder.status === 'Out for Delivery' },
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

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-[2rem] flex items-center justify-between">
                                            <div><p className="text-[9px] font-black text-blue-900/50 uppercase">Current Zone</p><h5 className="text-xl font-black text-blue-900 italic">{selectedOrder.zone}</h5></div>
                                            <span className="material-symbols-outlined text-blue-400">near_me</span>
                                        </div>
                                        <div className="p-5 bg-violet-50/50 border border-violet-100 rounded-[2rem] flex items-center justify-between">
                                            <div><p className="text-[9px] font-black text-violet-900/50 uppercase">Fleet Sync</p><h5 className="text-xl font-black text-violet-900 italic">{selectedOrder.rider}</h5></div>
                                            <span className="material-symbols-outlined text-violet-400">delivery_dining</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalTab === 'Logistics' && (
                                <div className="space-y-6 animate-[fadeIn_0.3s]">
                                    {/* Simulated Live Map */}
                                    <div className="aspect-video bg-[#E5E5E5] rounded-[2.5rem] relative overflow-hidden flex items-center justify-center shadow-inner group cursor-crosshair">
                                        {/* Map Base Pattern */}
                                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#2D241E 0.5px, transparent 0.5px), radial-gradient(#2D241E 0.5px, #E5E5E5 0.5px)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}></div>

                                        {/* Roads (Simulated) */}
                                        <div className="absolute top-1/2 left-0 w-full h-8 bg-white/50 -translate-y-1/2 flex items-center">
                                            <div className="w-full h-2 border-t border-b border-dashed border-gray-400/50"></div>
                                        </div>
                                        <div className="absolute left-1/3 top-0 h-full w-8 bg-white/50 flex justify-center">
                                            <div className="h-full w-2 border-l border-r border-dashed border-gray-400/50"></div>
                                        </div>

                                        {/* Rider Dot Simulation */}
                                        <div className="absolute top-1/2 left-1/4 size-8 bg-[#2D241E] rounded-full border-4 border-white shadow-xl flex items-center justify-center -translate-y-1/2 -translate-x-1/2 animate-[pulse_2s_infinite]">
                                            <span className="material-symbols-outlined text-white text-[14px]">two_wheeler</span>
                                        </div>

                                        {/* Destination Marker */}
                                        <div className="absolute top-1/2 left-3/4 size-8 bg-orange-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center -translate-y-1/2 -translate-x-1/2">
                                            <span className="material-symbols-outlined text-white text-[14px]">home_pin</span>
                                        </div>

                                        {/* Path Trace */}
                                        <div className="absolute top-1/2 left-1/4 h-1 bg-orange-500/30 w-1/2 -translate-y-1/2"></div>


                                        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur rounded-xl px-3 py-2 text-[10px]">
                                            <p className="font-bold text-[#2D241E]">{selectedOrder.zone} Sector Map</p>
                                            <p className="text-[#897a70]">Live Feed • Active • 2 min lag</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button className="flex-1 py-4 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 hover:bg-emerald-100 transition-all">Live Reroute</button>
                                        <button onClick={() => setShowRiderModal(true)} className="flex-1 py-4 bg-[#2D241E] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#453831] transition-all">Reassign Rider</button>
                                    </div>
                                </div>
                            )}

                            {/* Other tabs remain similar with static mock data for now, but fully rendered */}
                            {/* Manifest Tab (Order Items) */}
                            {modalTab === 'Manifest' && (
                                <div className="space-y-6 animate-[fadeIn_0.3s]">
                                    <div className="p-6 bg-[#FDFBF9] border border-orange-100/50 rounded-[2.5rem]">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-gray-100">
                                                    <th className="pb-3 text-[10px] font-black text-[#897a70] uppercase tracking-widest">Item Name</th>
                                                    <th className="pb-3 text-[10px] font-black text-[#897a70] uppercase tracking-widest text-center">Qty</th>
                                                    <th className="pb-3 text-[10px] font-black text-[#897a70] uppercase tracking-widest text-right">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {[
                                                    { name: 'Paneer Butter Masala (300ml)', qty: 1, price: '₹140' },
                                                    { name: 'Butter Tawa Roti', qty: 4, price: '₹40' },
                                                    { name: 'Jeera Rice (Half)', qty: 1, price: '₹60' },
                                                    { name: 'Gulab Jamun (2pcs)', qty: 1, price: '₹40' }
                                                ].map((item, i) => (
                                                    <tr key={i}>
                                                        <td className="py-3 text-xs font-bold text-[#2D241E]">{item.name}</td>
                                                        <td className="py-3 text-xs font-bold text-[#5C4D42] text-center">x{item.qty}</td>
                                                        <td className="py-3 text-xs font-bold text-[#2D241E] text-right">{item.price}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3 text-[10px]">
                                            <span className="font-black text-[#897a70] uppercase">Note:</span>
                                            <span className="text-[#5C4D42] italic">"Less oil in paneer, please. Send extra onions."</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button onClick={handlePrintManifest} className="flex items-center gap-2 px-6 py-3 bg-[#2D241E] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
                                            <span className="material-symbols-outlined text-[16px]">print</span>
                                            Print KOT
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Finance Tab (Cost Breakdown) */}
                            {modalTab === 'Finance' && (
                                <div className="space-y-6 animate-[fadeIn_0.3s]">
                                    <div className="p-6 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-[#897a70]">Item Total</span>
                                                <span className="font-black text-[#2D241E]">₹280.00</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-[#897a70]">Taxes & Charges</span>
                                                <span className="font-black text-[#2D241E]">₹14.00</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-[#897a70]">Delivery Fee</span>
                                                <span className="font-black text-[#2D241E]">₹25.00</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-emerald-600">
                                                <span className="font-bold">Discount (Coupon)</span>
                                                <span className="font-black">-₹30.00</span>
                                            </div>
                                            <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
                                                <span className="font-black text-[#2D241E]">Grand Total</span>
                                                <span className="font-black text-orange-600">₹289.00</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 bg-gray-50 rounded-[2rem] border border-gray-100">
                                            <p className="text-[9px] font-black text-[#897a70] uppercase mb-1">Payment Method</p>
                                            <div className="flex items-center gap-2 text-[#2D241E] font-bold text-xs">
                                                <span className="material-symbols-outlined text-[16px]">credit_card</span>
                                                UPI (PhonePe)
                                            </div>
                                        </div>
                                        <div className="p-5 bg-emerald-50 rounded-[2rem] border border-emerald-100">
                                            <p className="text-[9px] font-black text-emerald-700/50 uppercase mb-1">Payment Status</p>
                                            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                                                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                                Paid Successfully
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Audit Tab (Timeline) */}
                            {modalTab === 'Audit' && (
                                <div className="space-y-6 animate-[fadeIn_0.3s]">
                                    <div className="relative pl-4 space-y-6 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-gray-100">
                                        {[
                                            { action: 'Order Delivered', user: 'System (Rider App)', time: '1:45 PM', icon: 'check_circle', color: 'text-emerald-600' },
                                            { action: 'Rider Assigned (Vikram)', user: 'Admin (You)', time: '1:15 PM', icon: 'two_wheeler', color: 'text-blue-600' },
                                            { action: 'Order Picked Up', user: 'Kitchen App', time: '1:10 PM', icon: 'inventory_2', color: 'text-orange-600' },
                                            { action: 'Preparation Started', user: 'Kitchen App', time: '12:55 PM', icon: 'soup_kitchen', color: 'text-amber-600' },
                                            { action: 'Payment Verified', user: 'System (Razorpay)', time: '12:45 PM', icon: 'payments', color: 'text-[#2D241E]' },
                                            { action: 'Order Placed', user: 'Customer App', time: '12:44 PM', icon: 'shopping_bag', color: 'text-gray-400' },
                                        ].map((log, i) => (
                                            <div key={i} className="relative pl-6">
                                                <span className={`absolute left-[-5px] top-1 bg-white ring-4 ring-white material-symbols-outlined text-[16px] ${log.color} bg-white`}>{log.icon}</span>
                                                <p className="text-xs font-black text-[#2D241E]">{log.action}</p>
                                                <p className="text-[10px] text-[#897a70] font-medium mt-0.5">by {log.user} • {log.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 pb-10 bg-white border-t border-gray-50 flex items-center justify-end gap-10 shrink-0">
                            <button onClick={() => setSelectedOrder(null)} className="text-[12px] font-black text-[#897a70] hover:text-[#2D241E] transition-colors">Close</button>
                            <button onClick={() => {
                                toast.success('Order Record Updated');
                                setSelectedOrder(null);
                            }} className="px-12 py-5 bg-[#FF5722] text-white rounded-[1.5rem] text-[12px] font-black shadow-[0_10px_25px_-5px_rgba(255,87,34,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all">Save Changes</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Rider Assignment Modal */}
            {selectedOrder && showRiderModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2D241E]/80 backdrop-blur-md animate-[fadeIn_0.3s]" onClick={() => setShowRiderModal(false)}></div>
                    <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-[scaleIn_0.3s] relative z-20 border border-white/20">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-black text-[#2D241E]">Assign Rider</h3>
                                <p className="text-[10px] font-bold text-[#897a70]">Zone: {selectedOrder.zone} • Order: {selectedOrder.id}</p>
                            </div>
                            <button onClick={() => setShowRiderModal(false)} className="size-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100">
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        </div>
                        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {availableRiders.map(rider => (
                                <button
                                    key={rider.id}
                                    onClick={() => handleAssignRider(rider)}
                                    className="w-full p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/50 transition-all flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-xs group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                                            {rider.name.charAt(0)}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-black text-[#2D241E]">{rider.name}</p>
                                            <p className="text-[10px] font-bold text-[#897a70]">
                                                {rider.dist} away • ⭐ {rider.rating}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${rider.status === 'Free' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {rider.status}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AdminOrders;
