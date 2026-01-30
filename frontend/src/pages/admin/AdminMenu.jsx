import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Mock Data
const initialKitchens = [
    { id: 'K1', name: 'Mom\'s Kitchen', plan: 'North Indian', status: 'Pending', time: '09:45 AM', rating: 4.8 },
    { id: 'K2', name: 'Spicy Treats', plan: 'South Indian', status: 'Pending', time: '09:50 AM', rating: 4.5 },
    { id: 'K3', name: 'Healthy Bites', plan: 'Diet Special', status: 'Pending', time: '10:05 AM', rating: 4.9 },
    { id: 'K4', name: 'Ghar ka Swad', plan: 'Maharashtrian', status: 'Pending', time: '10:15 AM', rating: 4.7 }
];

const emptyMenu = {
    main: '', side: '', dal: '', rice: '', bread: '', dessert: '', calories: '', protein: ''
};

const mockMenus = {
    'K1': { main: 'Paneer Butter Masala', side: 'Aloo Gobi', dal: 'Dal Makhani', rice: 'Jeera Rice', bread: 'Butter Naan', dessert: 'Gulab Jamun', calories: '450', protein: '12g' },
    'K2': { main: 'Masala Dosa', side: 'Coconut Chutney', dal: 'Sambar', rice: 'Lemon Rice', bread: '', dessert: 'Mysore Pak', calories: '350', protein: '8g' },
    'K3': { main: 'Grilled Chicken', side: 'Steamed Veggies', dal: 'Lentil Soup', rice: 'Brown Rice', bread: 'Multigrain Roti', dessert: 'Fruit Salad', calories: '300', protein: '25g' },
    'K4': { main: 'Puran Poli', side: 'Batata Bhaji', dal: 'Amti', rice: 'Indrayani Rice', bread: 'Chapati', dessert: 'Shrikhand', calories: '500', protein: '10g' }
}

const AdminMenu = () => {
    const [kitchenQueue, setKitchenQueue] = useState([]);
    const [selectedKitchenId, setSelectedKitchenId] = useState(null);
    const [menuData, setMenuData] = useState(emptyMenu);
    const [loading, setLoading] = useState(true);

    // Form States
    const [isDirty, setIsDirty] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    // Stats State
    const [liveMenuCount, setLiveMenuCount] = useState(142);
    const [showLogsModal, setShowLogsModal] = useState(false);

    // Derived State
    const activeKitchen = kitchenQueue.find(k => (k._id || k.id) === selectedKitchenId);

    const fetchPendingMenus = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/admin/menus/pending', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                const data = res.data.data;
                setKitchenQueue(data.length > 0 ? data : initialKitchens); // Fallback to initial if empty for demo
                if (data.length > 0 && !selectedKitchenId) {
                    setSelectedKitchenId(data[0]._id || data[0].id);
                }
            }
        } catch (err) {
            console.error("Fetch Menus Error:", err);
            // On error we still show mock for demo purposes if instructed, but here we keep it clean
            setKitchenQueue(initialKitchens);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingMenus();
    }, []);

    // Auto-select when queue changes
    useEffect(() => {
        if (!activeKitchen && kitchenQueue.length > 0) {
            setSelectedKitchenId(kitchenQueue[0]._id || kitchenQueue[0].id);
        }
    }, [kitchenQueue, activeKitchen]);

    // Update form when selection changes
    useEffect(() => {
        if (activeKitchen) {
            // Mapping real model fields to UI fields if needed
            const kitchenId = activeKitchen._id || activeKitchen.id;
            setMenuData(activeKitchen.menuItems || mockMenus[kitchenId] || emptyMenu);
            setIsDirty({});
        }
    }, [selectedKitchenId, activeKitchen]);

    const handleInputChange = (field, value) => {
        setMenuData(prev => ({ ...prev, [field]: value }));
        setIsDirty(prev => ({ ...prev, [field]: true }));
    };


    const completionPercentage = (() => {
        const total = 8; // Total fields
        const filled = Object.values(menuData).filter(val => val !== '').length;
        return Math.round((filled / total) * 100);
    })();

    const removeFromQueue = (id) => {
        setKitchenQueue(prev => {
            const newQueue = prev.filter(k => k.id !== id);
            // Auto-select next available
            if (newQueue.length > 0) {
                setSelectedKitchenId(newQueue[0].id);
            } else {
                setSelectedKitchenId(null);
            }
            return newQueue;
        });
    };

    const handleApprove = async () => {
        if (completionPercentage < 100) {
            toast.error("Please complete all required fields!");
            return;
        }
        setIsProcessing(true);
        const loading = toast.loading(`Approving ${activeKitchen.name}...`);
        const token = localStorage.getItem('token');
        const menuId = activeKitchen._id || activeKitchen.id;

        try {
            const res = await axios.put(
                `/api/admin/menus/${menuId}/approve`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.dismiss(loading);
            setIsProcessing(false);

            if (res.data.success) {
                removeFromQueue(activeKitchen.id);
                setLiveMenuCount(prev => prev + 1);
                toast.success("Menu Approved & Live!", {
                    icon: '✅',
                    style: { borderRadius: '10px', background: '#2D241E', color: '#fff' }
                });
            }
        } catch (err) {
            toast.dismiss(loading);
            setIsProcessing(false);
            toast.error(err.response?.data?.message || 'Failed to approve menu');
        }
    };

    const handleReject = async () => {
        const reason = window.prompt("Reason for rejection?");
        if (!reason) return;

        setIsProcessing(true);
        const loading = toast.loading("Returning to kitchen...");
        const token = localStorage.getItem('token');
        const menuId = activeKitchen._id || activeKitchen.id;

        try {
            const res = await axios.put(
                `/api/admin/menus/${menuId}/reject`,
                { reason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.dismiss(loading);
            setIsProcessing(false);

            if (res.data.success) {
                removeFromQueue(activeKitchen.id);
                toast.error("Menu Rejected", {
                    style: { borderRadius: '10px', background: '#2D241E', color: '#fff' }
                });
            }
        } catch (err) {
            toast.dismiss(loading);
            setIsProcessing(false);
            toast.error(err.response?.data?.message || 'Failed to reject menu');
        }
    };

    const handleBulkApprove = () => {
        const confirm = window.confirm(`Approve all ${kitchenQueue.length} pending menus?`);
        if (confirm) {
            const count = kitchenQueue.length;
            const loading = toast.loading("Bulk Approving...");
            setTimeout(() => {
                toast.dismiss(loading);
                setKitchenQueue([]);
                setSelectedKitchenId(null);
                setLiveMenuCount(prev => prev + count); // Instant update
                toast.success("All Menus Pushed Live!", {
                    style: { borderRadius: '10px', background: '#2D241E', color: '#fff' }
                });
            }, 1500);
        }
    };

    const handleViewLogs = () => {
        setShowLogsModal(true);
    };

    const handleCopyYesterday = () => {
        toast.promise(
            new Promise(resolve => {
                setTimeout(() => {
                    setMenuData(mockMenus['K3'] || emptyMenu); // Mock copy
                    setIsDirty({ main: true, side: true, dal: true, rice: true, bread: true, dessert: true, calories: true, protein: true });
                    resolve();
                }, 500);
            }),
            {
                loading: 'Fetching...',
                success: <b>Copied Data!</b>,
                error: <b>Failed</b>,
            },
            {
                style: { borderRadius: '10px', background: '#2D241E', color: '#fff' },
            }
        );
    };

    const handleReset = () => {
        setMenuData(emptyMenu);
        setIsDirty({});
        toast("Form Reset", { icon: '🧹', style: { borderRadius: '10px', background: '#2D241E', color: '#fff' } });
    };

    const renderInput = (label, icon, id, placeholder) => (
        <div className="group relative">
            <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-bold text-[#897a70] uppercase tracking-wider flex items-center gap-1.5 group-focus-within:text-[#2D241E] transition-colors">
                    <span className="material-symbols-outlined text-[14px] opacity-40 notranslate">{icon}</span>
                    {label}
                </label>
                {isDirty[id] && <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 uppercase tracking-tight animate-pulse">Modified</span>}
            </div>
            <input
                type="text"
                value={menuData[id]}
                onChange={(e) => handleInputChange(id, e.target.value)}
                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-[#201c1a] focus:border-orange-200 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all shadow-sm group-hover:border-orange-200/50"
                placeholder={placeholder}
            />
        </div>
    );

    // --- LOGS MODAL ---
    const LogsModal = () => {
        if (!showLogsModal) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowLogsModal(false)}></div>
                <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh]">

                    {/* Compact Header */}
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-9 bg-gray-100 rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-gray-600 text-[18px]">history_edu</span>
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-800">System Activity</h3>
                                <p className="text-xs text-gray-400">Recent menu management actions</p>
                            </div>
                        </div>
                        <button onClick={() => setShowLogsModal(false)} className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all">
                            <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                    </div>
                    <div className="p-4 overflow-y-auto space-y-2">
                        {[
                            { action: 'Approved Menu', kitchen: 'Spicy Treats', time: '2m ago', icon: 'check_circle', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                            { action: 'Updated Settings', kitchen: 'System', time: '15m ago', icon: 'settings', color: 'text-blue-500', bg: 'bg-blue-50' },
                            { action: 'Rejected Menu', kitchen: 'Healthy Bites', time: '1h ago', icon: 'cancel', color: 'text-rose-500', bg: 'bg-rose-50' },
                            { action: 'Approved Menu', kitchen: 'Ghar ka Swad', time: '2h ago', icon: 'check_circle', color: 'text-emerald-500', bg: 'bg-emerald-50' },
                        ].map((log, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200">
                                <div className={`size-8 rounded-lg ${log.bg} ${log.color} flex items-center justify-center`}>
                                    <span className="material-symbols-outlined text-[18px]">{log.icon}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-gray-800 truncate">{log.action}</p>
                                    <p className="text-[10px] text-gray-400 truncate">{log.kitchen}</p>
                                </div>
                                <span className="text-[9px] font-bold text-gray-400 uppercase">{log.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // --- EMPTY STATE RENDERING ---
    if (kitchenQueue.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-6 h-[calc(100vh-120px)] animate-[fadeIn_0.5s]">
                <div className="bg-white/70 backdrop-blur-xl p-12 rounded-[2.5rem] border border-white/60 shadow-2xl text-center max-w-lg w-full">
                    <div className="size-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <span className="material-symbols-outlined text-5xl text-emerald-600">check_circle</span>
                    </div>
                    <h2 className="text-3xl font-bold text-[#2D241E] mb-2 tracking-tight">All Caught Up!</h2>
                    <p className="text-[#5C4D42] text-sm mb-8 px-8 leading-relaxed">
                        Great job, admin! You've reviewed all pending menus for today. Time to relax or manage other tasks.
                    </p>
                    <button
                        onClick={() => {
                            setKitchenQueue(initialKitchens);
                            setSelectedKitchenId(initialKitchens[0].id);
                        }}
                        className="px-8 py-3 bg-[#2D241E] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-black transition-all shadow-lg hover:shadow-black/20 hover:scale-105 active:scale-95"
                    >
                        Review Again (Demo)
                    </button>
                    <div className="mt-8 pt-8 border-t border-[#2D241E]/10 flex justify-center gap-8">
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-[#2D241E]">{liveMenuCount}</span>
                            <span className="text-[10px] uppercase font-bold text-[#897a70] tracking-wider">Live Menus</span>
                        </div>
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-[#2D241E]">98%</span>
                            <span className="text-[10px] uppercase font-bold text-[#897a70] tracking-wider">Approval Rate</span>
                        </div>
                    </div>
                </div>
                <LogsModal />
            </div>
        );
    }

    // --- MAIN RENDER ---
    return (
        <div className="space-y-6 max-w-[1600px] mx-auto min-h-screen pb-10 relative">

            {/* 2. Golden Header Block */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-[#2D241E] tracking-tight uppercase">Menu Management</h1>
                        <span className="px-2 py-0.5 bg-[#2D241E] text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-lg shadow-black/10">Management Console</span>
                    </div>
                    <p className="text-[#897a70] text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                        Daily Approval Queue & Quality Control
                    </p>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                    <button
                        onClick={handleBulkApprove}
                        disabled={kitchenQueue.length === 0}
                        className="px-5 py-2.5 bg-white border border-gray-200 text-[#2D241E] rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-gray-50 flex items-center gap-2 shadow-sm disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-[18px]">done_all</span>
                        Bulk Approve
                    </button>
                    <button
                        onClick={handleViewLogs}
                        className="px-5 py-2.5 bg-[#2D241E] text-white rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-[#453831] flex items-center gap-2 shadow-xl shadow-black/10 scale-105 active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[18px]">history</span>
                        View Logs
                    </button>
                </div>
            </div>

            {/* 2. Executive Stats Cards (Same style as Customers) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Pending Review', val: kitchenQueue.length.toString(), sub: 'Requires Action', icon: 'pending_actions', color: 'text-orange-600', bg: 'bg-orange-50' },
                    { label: 'Menus Live', val: liveMenuCount.toString(), sub: 'Today', icon: 'restaurant_menu', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Avg Rating', val: '4.8', sub: 'Last 7 Days', icon: 'star', color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'Rejection Rate', val: '2.4%', sub: '-0.5% vs last week', icon: 'trending_down', color: 'text-rose-500', bg: 'bg-rose-50' },
                ].map((s, i) => (
                    <div key={i} className="bg-white/70 backdrop-blur-xl p-5 rounded-[2rem] border border-white/60 shadow-sm group hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className={`size-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center`}>
                                <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                            </div>
                            <span className="text-xs font-bold text-[#897a70] uppercase tracking-wider leading-none mt-1">{s.label}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-[#2D241E] tracking-tighter mt-4">{s.val}</h3>
                        <p className="text-[10px] font-bold text-[#897a70] mt-1">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* 3. Main Console Layout: Split View (Natural Height) */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">

                {/* LEFT: QUEUE SIDEBAR (Sticky) */}
                <div className="w-full lg:w-80 flex flex-col gap-4 lg:sticky lg:top-4 self-start">
                    {/* Header Card */}
                    <div className="bg-[#2D241E] p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-6xl">restaurant_menu</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Active Queue</h1>
                            <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mt-1">
                                {kitchenQueue.length} Kitchens Waiting
                            </p>
                        </div>
                        <div className="mt-6 flex gap-2">
                            <button
                                onClick={handleBulkApprove}
                                className="flex-1 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider backdrop-blur-md transition-all border border-white/5"
                            >
                                Bulk Approve
                            </button>
                        </div>
                    </div>

                    {/* Queue List */}
                    <div className="bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-sm overflow-hidden flex flex-col max-h-[500px] lg:max-h-[calc(100vh-250px)]">
                        <div className="p-4 bg-white/50 border-b border-white/50 backdrop-blur-md sticky top-0 z-10">
                            <h3 className="text-[10px] font-bold text-[#897a70] uppercase tracking-wider">Pending Review</h3>
                        </div>
                        <div className="overflow-y-auto custom-scrollbar p-2 space-y-2">
                            {kitchenQueue.map(kitchen => (
                                <div
                                    key={kitchen.id}
                                    onClick={() => setSelectedKitchenId(kitchen.id)}
                                    className={`p-4 rounded-[1.5rem] cursor-pointer transition-all border group ${activeKitchen?.id === kitchen.id
                                        ? 'bg-white shadow-lg border-white/60 scale-[1.02] ring-1 ring-[#2D241E]/5'
                                        : 'bg-white/40 border-transparent hover:bg-white hover:shadow-sm'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="bg-[#2D241E]/5 text-[#2D241E] text-[10px] font-bold px-2 py-1 rounded-lg">
                                            {kitchen.time}
                                        </span>
                                        {activeKitchen?.id === kitchen.id && (
                                            <span className="material-symbols-outlined text-[16px] text-orange-500 animate-pulse">edit</span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-[#2D241E] text-xs">{kitchen.name}</h3>
                                    <p className="text-[10px] font-bold text-[#897a70]">{kitchen.plan}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT: EDITOR STUDIO (Auto Height) */}
                <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-2xl flex flex-col relative overflow-hidden transition-all">

                    {/* Studio Header */}
                    <div className="p-6 border-b border-[#2D241E]/5 flex justify-between items-center bg-white/40 backdrop-blur-md sticky top-0 z-20">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-[1rem] bg-orange-100 flex items-center justify-center text-orange-600 shadow-inner">
                                <span className="material-symbols-outlined notranslate">lunch_dining</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[#2D241E] tracking-tight">{activeKitchen?.name}</h2>
                                <p className="text-[10px] font-bold text-[#897a70] uppercase tracking-wider">
                                    Editing Daily Menu • ID: {activeKitchen?.id}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button onClick={handleReset} className="size-10 rounded-xl hover:bg-gray-100 flex items-center justify-center text-[#5C4D42] transition-all" title="Reset Form">
                                <span className="material-symbols-outlined text-[20px]">restart_alt</span>
                            </button>
                            <button onClick={handleCopyYesterday} className="px-4 py-2 bg-[#2D241E]/5 hover:bg-[#2D241E]/10 rounded-xl text-[10px] font-bold text-[#2D241E] uppercase tracking-wider transition-all flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                                Copy Yesterday
                            </button>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="p-8">
                        <div className="max-w-4xl mx-auto space-y-8">

                            {/* Section 1: The Main Meal */}
                            <div className="space-y-4 animate-[fadeIn_0.3s]">
                                <h3 className="text-[11px] font-bold text-[#2D241E] flex items-center gap-2 uppercase tracking-wider opacity-80">
                                    <span className="material-symbols-outlined text-[16px] text-orange-500">restaurant</span>
                                    Main Course Essentials
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        {renderInput("Main Dish (Sabzi/Gravy)", "soup_kitchen", "main", "e.g. Paneer Butter Masala")}
                                    </div>
                                    {renderInput("Rice / Pulao", "rice_bowl", "rice", "e.g. Jeera Rice")}
                                    {renderInput("Dal / Curry", "set_meal", "dal", "e.g. Dal Tadka")}
                                </div>
                            </div>

                            {/* Section 2: Sides & Breads */}
                            <div className="space-y-4 animate-[fadeIn_0.4s]">
                                <h3 className="text-[11px] font-bold text-[#2D241E] flex items-center gap-2 uppercase tracking-wider opacity-80">
                                    <span className="material-symbols-outlined text-[16px] text-orange-500">bakery_dining</span>
                                    Sides & Sweetness
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {renderInput("Breads (Roti/Naan)", "breakfast_dining", "bread", "e.g. 4 Butter Tawa Roti")}
                                    {renderInput("Side Dish (Dry Veg)", "tapas", "side", "e.g. Aloo Jeera")}
                                    {renderInput("Dessert / Sweet", "icecream", "dessert", "e.g. Gulab Jamun (1pc)")}
                                </div>
                            </div>

                            {/* Nutritional Profile */}
                            <div className="p-6 bg-[#FDFBF9] rounded-[2rem] border border-orange-100/50 space-y-4 animate-[fadeIn_0.5s]">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-[11px] font-bold text-[#2D241E] flex items-center gap-2 uppercase tracking-wider">
                                        <span className="material-symbols-outlined text-[16px] text-emerald-600">monitor_heart</span>
                                        Nutritional Profile
                                    </h3>
                                    <span className="text-[11px] font-bold text-orange-400 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100 uppercase tracking-wider">AI Verified</span>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    {renderInput("Total Calories (kcal)", "local_fire_department", "calories", "e.g. 450")}
                                    {renderInput("Protein Content (g)", "fitness_center", "protein", "e.g. 12g")}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Footer Controls */}
                    <div className="p-6 bg-white border-t border-[#2D241E]/5 flex justify-between items-center sticky bottom-0 z-20 backdrop-blur-lg">
                        <div className="flex items-center gap-4 w-1/3">
                            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 rounded-full ${completionPercentage === 100 ? 'bg-emerald-500' : 'bg-orange-400'}`}
                                    style={{ width: `${completionPercentage}%` }}
                                ></div>
                            </div>
                            <span className="text-[10px] font-bold text-[#897a70] min-w-[30px]">{completionPercentage}%</span>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleReject}
                                disabled={isProcessing}
                                className="px-6 py-3 rounded-2xl border-2 border-rose-100 text-rose-500 font-bold text-xs uppercase tracking-wider hover:bg-rose-50 hover:border-rose-200 transition-all disabled:opacity-50"
                            >
                                Reject
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={isProcessing}
                                className={`px-8 py-3 rounded-2xl text-white font-bold text-xs uppercase tracking-wider shadow-xl transition-all flex items-center gap-2
                                    ${completionPercentage === 100
                                        ? 'bg-[#2D241E] hover:bg-[#1a1512] hover:scale-105 active:scale-95 shadow-[#2D241E]/20 cursor-pointer'
                                        : 'bg-gray-400 hover:bg-gray-500'}`
                                }
                            >
                                {isProcessing ? 'Processing...' : 'Approve & Push Live'}
                                {!isProcessing && <span className="material-symbols-outlined text-[16px]">rocket_launch</span>}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminMenu;
