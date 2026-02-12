import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import { useSocket } from '../../context/SocketContext';

// -- Mock Data Generators --
// -- Mock Data Generators Removed --

const AdminOrders = () => {
    // -- State Management --
    // -- State Management --
    const [searchParams] = useSearchParams();
    const [viewMode, setViewMode] = useState('Today'); // 'Today' | 'Past'
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState(searchParams.get('id') || '');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalTab, setModalTab] = useState('Intelligence');
    const [showRiderModal, setShowRiderModal] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    const { socket } = useSocket();

    // -- Effects --
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`/api/admin/orders`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    date: viewMode.toLowerCase(),
                    search: searchQuery,
                    startDate,
                    endDate
                }
            });
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    // --- Real-time Order Updates ---
    useEffect(() => {
        if (!socket) return;

        socket.on('new-order', (data) => {
            setOrders(prev => [data.order, ...prev]);

            // Play sound
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play().catch(e => console.log('Audio play failed', e));

            toast.custom((t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-white border-l-4 border-emerald-500 shadow-xl rounded-xl p-4 flex items-start gap-3 pointer-events-auto`}>
                    <div className="bg-emerald-50 p-2 rounded-full"><span className="material-symbols-outlined text-emerald-600">local_shipping</span></div>
                    <div>
                        <p className="text-xs font-bold text-[#2D241E]">New Order Received!</p>
                        <p className="text-[10px] text-gray-500 font-medium">#{data.order.id} for {data.order.customer}</p>
                    </div>
                </div>
            ), { duration: 5000 });
        });

        return () => {
            socket.off('new-order');
        };
    }, [socket]);

    useEffect(() => {
        fetchOrders();
        setFilter('All');
    }, [viewMode, searchQuery, startDate, endDate]);

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

    const handleExportCSV = async () => {
        try {
            toast.loading("Preparing Sales Report...");
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/admin/reports/sales/download', {
                responseType: 'blob',
                headers: { Authorization: `Bearer ${token}` }
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `sales_report_${new Date().toLocaleDateString()}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.dismiss();
            toast.success("Sales Report Downloaded!");
        } catch (error) {
            toast.dismiss();
            console.error("Export Error:", error);
            toast.error("Failed to export sales report");
        }
    };


    const handleStatusUpdate = async (newStatus) => {
        if (!selectedOrder) return;
        const token = localStorage.getItem('token');
        const orderId = selectedOrder._id || selectedOrder.id;

        try {
            const res = await axios.put(
                `/api/admin/orders/${orderId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                fetchOrders();
                setSelectedOrder(prev => ({ ...prev, status: newStatus }));
                toast.success(`Order Marked as ${newStatus}`);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update status');
        }
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
            (o?.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (o?.customer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (o?.kitchen || '').toLowerCase().includes(searchQuery.toLowerCase());

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
        <div className="space-y-6 max-w-[1600px] mx-auto min-h-screen pb-10">


            {/* 1. Header & Live Toggle */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-[#2D241E] tracking-tight uppercase">Order Dispatch</h1>
                        <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-lg shadow-red-500/10">Operations Center</span>
                    </div>
                    <p className="text-[#897a70] text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-red-500 animate-pulse"></span>
                        {viewMode === 'Today' ? 'Live monitoring of active deliveries' : 'Historical archive of past orders'}
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

                    {/* Date Pickers */}
                    <div className="flex items-center gap-2 px-2">
                        <div className="flex items-center gap-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase">From</span>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="bg-transparent border-none outline-none text-[10px] font-bold text-[#2D241E] p-1 w-24"
                            />
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase">To</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="bg-transparent border-none outline-none text-[10px] font-bold text-[#2D241E] p-1 w-24"
                            />
                        </div>
                        {(startDate || endDate) && (
                            <button
                                onClick={() => { setStartDate(''); setEndDate(''); }}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                title="Clear Dates"
                            >
                                <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                        )}
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
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 text-[10px] font-bold hover:bg-blue-100 transition-all hover:scale-105 active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        Export
                    </button>
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
                            <p className="text-xs font-bold text-[#5C4D42]/60 uppercase tracking-wider">{stat.label}</p>
                            <h3 className={`text-2xl font-bold ${stat.color} mt-1`}>{stat.val}</h3>
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
                                <th className="px-6 py-5 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-5 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Customer & Plan</th>
                                <th className="px-6 py-5 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Kitchen Hub</th>
                                <th className="px-6 py-5 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Status</th>
                                <th className="px-6 py-5 text-[11px] font-bold text-[#897a70] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <SkeletonLoader type="table-row" count={5} />
                            ) : filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-white/60 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-bold text-[#2D241E]">{order.id}</p>
                                            <p className="text-[10px] font-bold text-[#897a70]">{order.time}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs font-bold text-[#2D241E] cursor-pointer hover:underline" onClick={() => handleCallCustomer(order)}>{order.customer}</p>
                                            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded uppercase tracking-wider">{order.type}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="size-2 rounded-full bg-violet-500"></div>
                                                <p className="text-xs font-medium text-[#5C4D42]">{order.kitchen}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)} shadow-sm`}>
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
                                                    title="Track Order"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">near_me</span>
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
                                            <p className="text-xs font-bold text-[#2D241E]">No Orders Found</p>
                                            <p className="text-[11px] font-bold text-[#897a70] mt-0.5">There are no orders with status "{filter}".</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && !showRiderModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
                    <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh]">

                        {/* Compact Header */}
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-bold text-gray-800">Order Details</h3>
                                <p className="text-xs text-gray-500">Live tracking & order info</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600">
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        </div>

                        {/* Tab Navigation */}
                        <div className="px-4 py-3 shrink-0 overflow-x-auto no-scrollbar border-b border-gray-100">
                            <div className="flex gap-1 bg-gray-50 p-1 rounded-xl w-fit">
                                {[
                                    { id: 'Overview', label: 'Tracking', icon: 'near_me' },
                                    { id: 'Manifest', label: 'Items', icon: 'list_alt' },
                                    { id: 'Finance', label: 'Payment', icon: 'payments' },
                                    { id: 'Audit', label: 'History', icon: 'history' },
                                ].map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setModalTab(t.id)}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${modalTab === t.id ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <span className="material-symbols-outlined text-[14px]">{t.icon}</span>
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4">

                            {/* Order Identification Card */}
                            <div className="p-5 bg-white border border-[#2D241E]/5 rounded-[2.5rem] flex items-center gap-6 shadow-sm">
                                <div className="relative">
                                    <div className="size-20 rounded-2xl bg-[#2D241E] flex items-center justify-center text-white shadow-lg border-2 border-white">
                                        <span className="material-symbols-outlined text-4xl">inventory_2</span>
                                    </div>
                                    <div className={`absolute -bottom-2 -left-2 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase border-2 border-white shadow-sm ${selectedOrder.status === 'Cancelled' ? 'bg-red-500' : 'bg-orange-500'}`}>
                                        {selectedOrder.status === 'Delivered' ? 'Done' : 'Live'}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xl font-bold text-[#2D241E] tracking-tight">#{selectedOrder.id}</h4>

                                        {/* Status Dropdown / Indicator */}
                                        <div className="relative group">
                                            <button className={`text-[11px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider ${getStatusColor(selectedOrder.status)}`}>
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
                                        <h5 className="text-xs font-bold text-[#2D241E] uppercase tracking-wider flex items-center gap-2">
                                            <span className="material-symbols-outlined text-orange-500 text-[18px]">route</span>
                                            Delivery Timeline
                                        </h5>
                                        <div className="p-6 bg-white/60 border border-white/50 rounded-[2.5rem] space-y-6 shadow-sm">
                                            {[
                                                { time: selectedOrder.timeline?.confirmed ? new Date(selectedOrder.timeline.confirmed).toLocaleTimeString() : 'Pending', label: 'Order Confirmed', done: !!selectedOrder.timeline?.confirmed },
                                                { time: selectedOrder.timeline?.cooking ? new Date(selectedOrder.timeline.cooking).toLocaleTimeString() : 'Waiting', label: 'Kitchen Handover', done: !!selectedOrder.timeline?.cooking },
                                                { time: selectedOrder.timeline?.outForDelivery ? new Date(selectedOrder.timeline.outForDelivery).toLocaleTimeString() : 'In Queue', label: 'Pickup Completed', done: !!selectedOrder.timeline?.outForDelivery },
                                                { time: selectedOrder.timeline?.delivered ? new Date(selectedOrder.timeline.delivered).toLocaleTimeString() : 'ETA TBD', label: 'Delivery Status', done: !!selectedOrder.timeline?.delivered, active: selectedOrder.status.includes('Transit') || selectedOrder.status.includes('Delivery') },
                                            ].map((step, i) => (
                                                <div key={i} className="flex gap-4 relative">
                                                    {i < 3 && <div className={`absolute left-[5px] top-4 w-px h-8 ${step.done ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>}
                                                    <div className={`size-3 rounded-full mt-1.5 z-10 ${step.done ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : step.active ? 'bg-orange-500 animate-pulse' : 'bg-gray-200'}`}></div>
                                                    <div>
                                                        <p className={`text-[11px] font-bold ${step.done ? 'text-[#2D241E]' : 'text-[#897a70]'}`}>{step.label}</p>
                                                        <p className="text-[10px] font-bold text-[#897a70]/60 uppercase tracking-wider">{step.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-5 bg-blue-50/80 border border-blue-100 rounded-[2rem] flex items-center justify-between shadow-sm">
                                        <div><p className="text-[10px] font-bold text-blue-900/50 uppercase tracking-wider">Current Zone</p><h5 className="text-xl font-bold text-blue-900 italic tracking-tight">{selectedOrder.zone}</h5></div>
                                        <span className="material-symbols-outlined text-blue-400">near_me</span>
                                    </div>
                                </div>
                            )}


                            {/* Manifest Tab (Order Items) */}
                            {modalTab === 'Manifest' && (
                                <div className="space-y-6 animate-[fadeIn_0.3s]">
                                    <div className="p-6 bg-white border border-[#2D241E]/5 rounded-[2.5rem] shadow-sm">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-gray-100">
                                                    <th className="pb-3 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Item Name</th>
                                                    <th className="pb-3 text-[11px] font-bold text-[#897a70] uppercase tracking-wider text-center">Qty</th>
                                                    <th className="pb-3 text-[11px] font-bold text-[#897a70] uppercase tracking-wider text-right">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                                    selectedOrder.items.map((item, i) => (
                                                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                                            <td className="py-3 text-xs font-bold text-[#2D241E]">{item.itemName || item.name}</td>
                                                            <td className="py-3 text-xs font-bold text-[#5C4D42] text-center">x{item.quantity || 1}</td>
                                                            <td className="py-3 text-xs font-bold text-[#2D241E] text-right">₹{item.price || '-'}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="3" className="py-4 text-center text-xs text-gray-400">No items listed</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3 text-[10px]">
                                            <span className="font-bold text-[#897a70] uppercase tracking-wider">Note:</span>
                                            <span className="text-[#5C4D42] italic">{selectedOrder.customization?.note || "No special instructions provided."}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button onClick={handlePrintManifest} className="flex items-center gap-2 px-6 py-3 bg-[#2D241E] text-white rounded-2xl text-xs font-bold uppercase tracking-wider hover:scale-105 transition-transform shadow-lg shadow-[#2D241E]/20">
                                            <span className="material-symbols-outlined text-[16px]">print</span>
                                            Print KOT
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Finance Tab (Cost Breakdown) */}
                            {modalTab === 'Finance' && (
                                <div className="space-y-6 animate-[fadeIn_0.3s]">
                                    <div className="p-6 bg-white border border-[#2D241E]/5 rounded-[2.5rem] shadow-sm">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-[#897a70]">Base Price</span>
                                                <span className="font-bold text-[#2D241E]">₹{(selectedOrder.price * 0.82).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-[#897a70]">Tax (GST 18%)</span>
                                                <span className="font-bold text-[#2D241E]">₹{(selectedOrder.price * 0.18).toFixed(2)}</span>
                                            </div>
                                            <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
                                                <span className="font-bold text-[#2D241E]">Grand Total</span>
                                                <span className="font-bold text-orange-600">₹{selectedOrder.price}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 bg-gray-50 rounded-[2rem] border border-gray-100 shadow-sm">
                                            <p className="text-[10px] font-bold text-[#897a70] uppercase mb-1 tracking-wider">Payment Method</p>
                                            <div className="flex items-center gap-2 text-[#2D241E] font-bold text-xs uppercase">
                                                <span className="material-symbols-outlined text-[16px]">credit_card</span>
                                                {selectedOrder.paymentMethod || 'Wallet'}
                                            </div>
                                        </div>
                                        <div className="p-5 bg-emerald-50 rounded-[2rem] border border-emerald-100 shadow-sm">
                                            <p className="text-[10px] font-bold text-emerald-700/50 uppercase mb-1 tracking-wider">Payment Status</p>
                                            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                                                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                                {selectedOrder.paymentStatus || 'Paid'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Audit Tab (Timeline) */}
                            {modalTab === 'Audit' && (
                                <div className="space-y-6 animate-[fadeIn_0.3s]">
                                    <div className="relative pl-4 space-y-6 before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-gray-200/50">
                                        {[
                                            { action: 'Order Delivered', user: 'System (Rider App)', time: selectedOrder.timeline?.delivered, icon: 'check_circle', color: 'text-emerald-600' },
                                            { action: 'Pickup Completed', user: 'System (Rider App)', time: selectedOrder.timeline?.outForDelivery, icon: 'two_wheeler', color: 'text-blue-600' },
                                            { action: 'Preparation Completed', user: 'Kitchen Hub', time: selectedOrder.timeline?.prepared, icon: 'inventory_2', color: 'text-orange-600' },
                                            { action: 'Kitchen Handover', user: 'Kitchen Hub', time: selectedOrder.timeline?.cooking, icon: 'soup_kitchen', color: 'text-amber-600' },
                                            { action: 'Order Placed', user: 'Customer App', time: selectedOrder.timeline?.confirmed, icon: 'shopping_bag', color: 'text-gray-400' },
                                        ].filter(l => l.time).map((log, i) => (
                                            <div key={i} className="relative pl-6 group">
                                                <span className={`absolute left-[-5px] top-1 bg-white ring-4 ring-white material-symbols-outlined text-[16px] ${log.color} bg-white shadow-sm rounded-full`}>{log.icon}</span>
                                                <p className="text-xs font-bold text-[#2D241E] group-hover:text-orange-600 transition-colors">{log.action}</p>
                                                <p className="text-[10px] text-[#897a70] font-medium mt-0.5">by {log.user} • {new Date(log.time).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Modal Footer */}
                        <div className="relative z-10 p-8 pb-10 bg-white/80 backdrop-blur-xl border-t border-[#2D241E]/5 flex items-center justify-end gap-10 shrink-0">
                            <button onClick={() => setSelectedOrder(null)} className="text-sm font-bold text-[#897a70] hover:text-[#2D241E] transition-colors">Close</button>
                            <button onClick={() => {
                                toast.success('Order Record Updated');
                                setSelectedOrder(null);
                            }} className="px-12 py-5 bg-[#FF5722] text-white rounded-[1.5rem] text-sm font-bold shadow-[0_10px_25px_-5px_rgba(255,87,34,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all">Save Changes</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

        </div>
    );
};

export default AdminOrders;
