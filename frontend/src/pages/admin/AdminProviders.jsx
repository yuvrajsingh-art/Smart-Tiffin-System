import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';

const AdminProviders = () => {
    const formRef = useRef(null);
    // Mock Data
    const [providers, setProviders] = useState([
        { id: 'KIT001', name: 'Annapurna Rasoi', owner: 'Mrs. Sharma', phone: '9876543210', email: 'annapurna@gmail.com', location: 'Indore, Sector 7', capacity: 500, currentLoad: 200, rating: 4.8, status: 'Active', joins: '01 Jan 2024', earnings: '₹1.2L', fssai: '21458796325874', type: 'Pure Veg' },
        { id: 'KIT002', name: 'Spice Route', owner: 'Vicky Kaushal', phone: '9988776655', email: 'spice@route.com', location: 'Indore, Vijay Nagar', capacity: 300, currentLoad: 150, rating: 4.5, status: 'Active', joins: '05 Jan 2024', earnings: '₹85K', fssai: '22558877441122', type: 'Veg/Non-Veg' },
        { id: 'KIT003', name: 'Home Taste', owner: 'Suman Lata', phone: '8877665544', email: 'suman@hometaste.com', location: 'Indore, Rajwada', capacity: 100, currentLoad: 80, rating: 4.9, status: 'Active', joins: '10 Jan 2024', earnings: '₹42K', fssai: '23669988552233', type: 'Pure Veg' },
        { id: 'KIT004', name: 'Healthy Bites', owner: 'Dr. Rahul', phone: '7766554433', email: 'doc@healthy.com', location: 'Indore, Annapurna', capacity: 200, currentLoad: 0, rating: 0, status: 'Pending', joins: '25 Jan 2024', earnings: '₹0', fssai: '24770099663344', type: 'Diet' },
        { id: 'KIT005', name: 'Tasty Tiffin', owner: 'Rajesh Kumar', phone: '9822334455', email: 'rajesh@tasty.com', location: 'Indore, Saket', capacity: 150, currentLoad: 0, rating: 0, status: 'Pending', joins: '26 Jan 2024', earnings: '₹0', fssai: '25881100774455', type: 'Pure Veg' },
        { id: 'KIT006', name: "Mom's Magic", owner: 'Sunita Devi', phone: '9122334455', email: 'mom@magic.com', location: 'Indore, LIG', capacity: 80, currentLoad: 0, rating: 0, status: 'Pending', joins: '27 Jan 2024', earnings: '₹0', fssai: '26992211885566', type: 'Pure Veg' },
        { id: 'KIT007', name: 'The Diet Hub', owner: 'Amit Verma', phone: '9222334455', email: 'amit@diethub.com', location: 'Indore, Palasia', capacity: 250, currentLoad: 0, rating: 0, status: 'Pending', joins: '27 Jan 2024', earnings: '₹0', fssai: '27003322996677', type: 'Diet Special' },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All');
    const [selectedKitchen, setSelectedKitchen] = useState(null); // For DNA Modal
    const [showRegisterModal, setShowRegisterModal] = useState(false); // For Add Modal
    const [editingKitchen, setEditingKitchen] = useState(null); // For Edit Modal
    const [showRequestsModal, setShowRequestsModal] = useState(false); // For Requests Modal

    // Derived Data
    const filteredProviders = providers.filter(pro => {
        const matchesSearch = pro.name.toLowerCase().includes(searchQuery.toLowerCase()) || pro.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'All' || pro.status === filter;
        return matchesSearch && matchesFilter;
    });

    // Mock Pending Requests
    const pendingRequests = providers.filter(p => p.status === 'Pending');

    const handleAction = (type, name) => {
        toast.success(`${type} action triggered for ${name}`, {
            style: { borderRadius: '10px', background: '#2D241E', color: '#fff', fontSize: '10px' }
        });
    };

    const handleApproveRequest = (id, name) => {
        setProviders(prev => prev.map(p => p.id === id ? {
            ...p,
            status: 'Active',
            currentLoad: 0,
            rating: 0,
            earnings: '₹0',
            commission: p.commission || '10%',
            hours: p.hours || '8AM - 10PM'
        } : p));

        toast.success(`${name} Approved! Now live on the platform.`, {
            icon: '🚀',
            style: { borderRadius: '10px', background: '#2D241E', color: '#fff' }
        });

        if (pendingRequests.length <= 1) setShowRequestsModal(false);
    };

    const handleRejectRequest = (id, name) => {
        setProviders(prev => prev.filter(p => p.id !== id));
        toast.error(`${name}'s application has been rejected.`, {
            icon: '❌',
            style: { borderRadius: '10px', background: '#2D241E', color: '#fff' }
        });
        if (pendingRequests.length <= 1) setShowRequestsModal(false);
    };

    const handleToggleStatus = (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
        setProviders(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
        toast.success(`Kitchen status changed to ${newStatus}`, {
            icon: newStatus === 'Active' ? '✅' : '🚫',
            style: { borderRadius: '10px', background: '#2D241E', color: '#fff' }
        });
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to remove ${name}?`)) {
            setProviders(prev => prev.filter(p => p.id !== id));
            toast.success(`${name} has been removed.`, { icon: '🗑️', style: { borderRadius: '10px', background: '#2D241E', color: '#fff' } });
            if (selectedKitchen?.id === id) setSelectedKitchen(null);
        }
    };

    // --- Modal Handlers ---
    const handleSaveNew = (e) => {
        console.log("handleSaveNew called");
        try {
            if (e && e.preventDefault) e.preventDefault();
            const form = formRef.current;
            if (!form) {
                console.error("Form Ref is null!");
                toast.error("Internal Error: Form not found");
                return;
            }

            // Immediate feedback
            const procToast = toast.loading("Processing registration...");

            const name = form.elements['name']?.value;
            if (!name) {
                toast.dismiss(procToast);
                toast.error("Kitchen Name is required");
                return;
            }

            const newKitchen = {
                id: `KIT${Math.floor(100 + Math.random() * 900)}`,
                name: name,
                owner: form.elements['owner']?.value || '',
                phone: form.elements['phone']?.value || '',
                email: form.elements['email']?.value || '',
                emergency: form.elements['emergency']?.value || '',
                location: form.elements['location']?.value || '',
                city: form.elements['city']?.value || 'Indore',
                pincode: form.elements['pincode']?.value || '',
                capacity: parseInt(form.elements['capacity']?.value) || 0,
                currentLoad: 0,
                rating: 0,
                status: 'Active',
                joins: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
                earnings: '₹0',
                fssai: form.elements['fssai']?.value || '',
                type: form.elements['type']?.value || 'Pure Veg',
                commission: form.elements['commission']?.value || '10%',
                hours: form.elements['hours']?.value || '8AM - 10PM',
                accNo: form.elements['accNo']?.value || '',
                ifsc: form.elements['ifsc']?.value || '',
                payoutCycle: form.elements['payoutCycle']?.value || 'Weekly'
            };

            setProviders(prev => [newKitchen, ...prev]);
            toast.dismiss(procToast);
            toast.success(`${newKitchen.name} Registered Successfully!`, {
                icon: '🍳',
                style: { borderRadius: '10px', background: '#2D241E', color: '#fff' }
            });

            setShowRegisterModal(false);
            setEditingKitchen(null);
        } catch (err) {
            console.error("Registration Logic Error:", err);
            toast.error("Error: " + err.message);
        }
    };

    const handleUpdate = (e) => {
        console.log("handleUpdate called");
        try {
            if (e && e.preventDefault) e.preventDefault();
            const form = formRef.current;
            if (!form) return;

            const procToast = toast.loading("Saving changes...");

            setProviders(prev => prev.map(p => p.id === editingKitchen.id ? {
                ...p,
                name: form.elements['name']?.value,
                owner: form.elements['owner']?.value,
                phone: form.elements['phone']?.value,
                email: form.elements['email']?.value,
                emergency: form.elements['emergency']?.value,
                location: form.elements['location']?.value,
                city: form.elements['city']?.value,
                pincode: form.elements['pincode']?.value,
                capacity: parseInt(form.elements['capacity']?.value) || 0,
                type: form.elements['type']?.value,
                fssai: form.elements['fssai']?.value,
                commission: form.elements['commission']?.value,
                hours: form.elements['hours']?.value,
                accNo: form.elements['accNo']?.value,
                ifsc: form.elements['ifsc']?.value,
                payoutCycle: form.elements['payoutCycle']?.value
            } : p));

            toast.dismiss(procToast);
            toast.success('Kitchen Profile Updated!', {
                icon: '💾',
                style: { borderRadius: '10px', background: '#2D241E', color: '#fff' }
            });

            setEditingKitchen(null);
            setShowRegisterModal(false);
        } catch (err) {
            console.error("Update Logic Error:", err);
            toast.error("Failed to update.");
        }
    };

    const handleLoginAs = (kitchen) => {
        if (window.confirm(`Simulate login as ${kitchen.name}?`)) {
            toast.success(`Logged in as ${kitchen.name}`, {
                icon: '🔐',
                style: { borderRadius: '10px', background: '#2D241E', color: '#fff' }
            });
            // In a real app, this would redirect with an auth token
        }
    };

    const handleForcePayout = (kitchen) => {
        if (window.confirm(`Process immediate payout for ${kitchen.name}?`)) {
            toast.success(`Payout processed for ${kitchen.name}`, {
                icon: '💸',
                style: { borderRadius: '10px', background: '#2D241E', color: '#fff' }
            });
        }
    };

    return (
        <div className="space-y-4 max-w-[1600px] mx-auto min-h-full pb-6 animate-[fadeIn_0.5s]">

            {/* Live Ticker */}
            <div className="w-full bg-[#2D241E] text-white overflow-hidden py-1.5 rounded-xl shadow-lg flex items-center gap-4 px-4 relative z-0">
                <div className="flex items-center gap-1 shrink-0 z-10 bg-[#2D241E] pr-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-orange-400">Kitchen Ops</span>
                </div>
                <div className="flex gap-8 animate-[marquee_25s_linear_infinite] whitespace-nowrap opacity-80 hover:opacity-100 transition-opacity">
                    {[
                        "Annapurna Rasoi passed hygiene audit (2h ago)",
                        "New application: 'Tasty Tiffin' pending review",
                        "Spice Route updated menu for Tomorrow (10m ago)",
                        "Payout processed for batch #882 (1h ago)"
                    ].map((item, i) => (
                        <span key={i} className="text-[10px] font-bold flex items-center gap-2">
                            <span className="size-1 bg-white/20 rounded-full"></span>
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black text-[#2D241E] tracking-tight flex items-center gap-2">
                        Kitchen Management
                        <span className="px-2 py-0.5 bg-violet-500 text-white text-[9px] font-black rounded-lg uppercase tracking-wider">Partners</span>
                    </h2>
                    <p className="text-[#5C4D42] text-xs font-medium opacity-80 mt-0.5">Approve new kitchens, monitor quality, and track payouts.</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowRequestsModal(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-white text-violet-600 rounded-xl border border-violet-100 text-[10px] font-bold hover:bg-violet-50 transition-all relative"
                    >
                        <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                        Requests
                        {pendingRequests.length > 0 && (
                            <span className="absolute -top-1 -right-1 size-4 bg-red-500 text-white flex items-center justify-center text-[8px] rounded-full border-2 border-white animate-bounce">{pendingRequests.length}</span>
                        )}
                    </button>
                    <button
                        onClick={() => {
                            setEditingKitchen(null);
                            setShowRegisterModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-[#2D241E] text-white rounded-xl text-[10px] font-bold hover:bg-[#453831] shadow-lg shadow-[#2D241E]/10 transition-all"
                    >
                        <span className="material-symbols-outlined text-[16px]">add_business</span>
                        Register Kitchen
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Active Kitchens', val: providers.filter(p => p.status === 'Active').length, icon: 'storefront', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Total Capacity', val: providers.reduce((acc, p) => acc + (p.status === 'Active' ? p.capacity : 0), 0), icon: 'restaurant', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Avg Rating', val: (providers.filter(p => p.rating > 0).reduce((acc, p) => acc + p.rating, 0) / (providers.filter(p => p.rating > 0).length || 1)).toFixed(1), icon: 'star', color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Pending Apps', val: pendingRequests.length, icon: 'pending_actions', color: 'text-violet-600', bg: 'bg-violet-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white/70 backdrop-blur-xl p-5 rounded-[2rem] border border-white/60 shadow-sm group hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className={`size-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                                <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
                            </div>
                            <span className="text-[9px] font-black text-[#897a70] uppercase tracking-widest leading-none mt-1">{stat.label}</span>
                        </div>
                        <h3 className="text-2xl font-black text-[#2D241E] tracking-tighter mt-4">{stat.val}</h3>
                    </div>
                ))}
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="flex-1 w-full bg-white/70 backdrop-blur-xl p-2.5 rounded-[1.75rem] border border-white/60 shadow-sm flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
                        <input
                            type="text"
                            placeholder="Find kitchens..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl text-xs font-medium focus:ring-2 focus:ring-[#2D241E]/10 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-1.5 p-1 bg-gray-50 rounded-2xl overflow-x-auto w-full sm:w-auto">
                        {['All', 'Active', 'Pending', 'Suspended'].map(t => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className={`px-4 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all ${filter === t ? 'bg-[#2D241E] text-white shadow-lg' : 'text-[#897a70] hover:text-[#2D241E]'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Providers Table */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[1.75rem] border border-white/60 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[10px] font-black text-[#5C4D42] uppercase tracking-wider">Kitchen Identity</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[#5C4D42] uppercase tracking-wider">Capacity & Load</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[#5C4D42] uppercase tracking-wider">Stats</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[#5C4D42] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProviders.length > 0 ? (
                                filteredProviders.map((pro) => (
                                    <tr key={pro.id} className="group hover:bg-white/60 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-[1rem] bg-orange-100 text-orange-600 flex items-center justify-center text-lg font-black shadow-sm overflow-hidden">
                                                    {pro.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-xs font-black text-[#2D241E]">{pro.name}</p>
                                                        <span className={`px-1.5 py-0.5 text-[8px] font-black rounded uppercase ${pro.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : pro.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                                                            {pro.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] text-[#897a70] font-bold">{pro.location}</p>
                                                    <p className="text-[9px] text-[#897a70] opacity-70">Owner: {pro.owner}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-32">
                                                <div className="flex justify-between text-[9px] font-bold mb-1">
                                                    <span>{pro.currentLoad} Active Orders</span>
                                                    <span className="text-[#897a70]">{pro.capacity} Max</span>
                                                </div>
                                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${pro.currentLoad / pro.capacity > 0.8 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                                        style={{ width: `${(pro.currentLoad / pro.capacity) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1 text-[11px] font-bold text-[#2D241E]">
                                                    <span className="material-symbols-outlined text-amber-400 text-[16px]">star</span>
                                                    {pro.rating}
                                                </div>
                                                <div className="h-4 w-px bg-gray-200"></div>
                                                <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                                                    {pro.earnings}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {pro.status === 'Pending' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleApproveRequest(pro.id, pro.name)}
                                                            className="size-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-all shadow-sm"
                                                            title="Approve Request"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectRequest(pro.id, pro.name)}
                                                            className="size-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 transition-all shadow-sm"
                                                            title="Reject Request"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">cancel</span>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleToggleStatus(pro.id, pro.status)}
                                                            className={`size-8 rounded-xl flex items-center justify-center transition-all shadow-sm ${pro.status === 'Active' ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                                                            title={pro.status === 'Active' ? 'Suspend Kitchen' : 'Activate Kitchen'}
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">{pro.status === 'Active' ? 'block' : 'check_circle'}</span>
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingKitchen(pro)}
                                                            className="size-8 rounded-xl bg-gray-50 text-[#5C4D42] flex items-center justify-center hover:bg-[#2D241E] hover:text-white transition-all shadow-sm"
                                                            title="Edit Details"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">edit_square</span>
                                                        </button>
                                                        <button
                                                            onClick={() => setSelectedKitchen(pro)}
                                                            className="size-8 rounded-xl bg-[#2D241E] text-white flex items-center justify-center hover:bg-violet-600 transition-all shadow-lg shadow-black/10"
                                                            title="View Kitchen DNA"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(pro.id, pro.name)}
                                                            className="size-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                            title="Delete Kitchen"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">delete</span>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-60">
                                            <div className="size-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                <span className="material-symbols-outlined text-4xl text-gray-300">store_off</span>
                                            </div>
                                            <p className="text-sm font-black text-[#2D241E]">No kitchens found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODALS --- */}

            {/* 1. Requests Review Modal - [COMPACT & STREAMLINED] */}
            {showRequestsModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2D241E]/80 backdrop-blur-sm animate-[fadeIn_0.3s]" onClick={() => setShowRequestsModal(false)}></div>
                    <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl animate-[scaleIn_0.3s] relative z-10 border border-white/20 flex flex-col max-h-[80vh]">
                        {/* Texture */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2D241E 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                        {/* Compact Header */}
                        <div className="p-6 pb-4 flex justify-between items-center bg-[#2D241E] text-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="size-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined text-orange-400 text-[18px]">verified</span>
                                </div>
                                <h3 className="text-lg font-black tracking-tight">Join Requests</h3>
                            </div>
                            <button onClick={() => setShowRequestsModal(false)} className="size-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                                <span className="material-symbols-outlined text-[18px] text-white">close</span>
                            </button>
                        </div>

                        {/* Streamlined List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-1 space-y-1 bg-gray-50/50">
                            {pendingRequests.length > 0 ? (
                                pendingRequests.map(req => (
                                    <div key={req.id} className="bg-white p-4 flex items-center gap-4 transition-all hover:bg-orange-50/30 border-b border-gray-100 last:border-0">

                                        {/* Avatar */}
                                        <div className="size-11 rounded-xl bg-orange-100 flex items-center justify-center text-lg font-black text-orange-600 shrink-0">
                                            {req.name.charAt(0)}
                                        </div>

                                        {/* Simplified Info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[13px] font-black text-[#2D241E] truncate leading-none">{req.name}</h4>
                                            <p className="text-[10px] font-bold text-[#897a70] mt-1.5 truncate">by {req.owner} • {req.type}</p>
                                        </div>

                                        {/* Compact Actions */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => handleApproveRequest(req.id, req.name)}
                                                className="size-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"
                                                title="Approve"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">check</span>
                                            </button>
                                            <button
                                                onClick={() => handleRejectRequest(req.id, req.name)}
                                                className="size-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                                                title="Reject"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">close</span>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center opacity-60">
                                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">inbox</span>
                                    <p className="text-xs font-black text-[#2D241E]">No pending requests</p>
                                </div>
                            )}
                        </div>

                        {/* Sticky Bottom Summary */}
                        <div className="p-3 bg-white border-t border-gray-100 flex justify-center">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{pendingRequests.length} Pending Actions</span>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* 2. Kitchen DNA Modal */}
            {selectedKitchen && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2D241E]/80 backdrop-blur-md animate-[fadeIn_0.3s]" onClick={() => setSelectedKitchen(null)}></div>
                    <div className="bg-white rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl animate-[scaleIn_0.3s] relative z-10 border border-white/20 flex flex-col max-h-[92vh]">
                        {/* Texture */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2D241E 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                        {/* Modal Header */}
                        <div className="p-8 pb-4 flex justify-between items-start shrink-0">
                            <div>
                                <h3 className="text-2xl font-black text-[#2D241E] tracking-tight">Kitchen DNA</h3>
                                <p className="text-[11px] font-bold text-[#897a70] mt-1">Operational ID: {selectedKitchen.id}</p>
                            </div>
                            <button onClick={() => setSelectedKitchen(null)} className="size-9 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all">
                                <span className="material-symbols-outlined text-[18px] text-[#5C4D42]">close</span>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-8 space-y-6">

                            {/* Profile Card */}
                            <div className="p-5 bg-[#FDFBF9] border border-orange-100/50 rounded-[2.5rem] flex items-center gap-6 shadow-sm">
                                <div className="size-20 rounded-2xl bg-orange-100 flex items-center justify-center text-3xl font-black text-orange-600 shadow-inner">
                                    {selectedKitchen.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xl font-black text-[#2D241E] tracking-tight">{selectedKitchen.name}</h4>
                                        <div className="flex gap-2">
                                            {selectedKitchen.status === 'Pending' && (
                                                <button onClick={() => handleApproveRequest(selectedKitchen.id, selectedKitchen.name)} className="px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all">
                                                    Approve Application
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-[11px] font-bold text-[#897a70]">{selectedKitchen.location} {selectedKitchen.pincode && `• ${selectedKitchen.pincode}`} • {selectedKitchen.type}</p>
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#2D241E]">
                                            <span className="material-symbols-outlined text-[16px] text-orange-500">account_circle</span>
                                            {selectedKitchen.owner}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#2D241E]">
                                            <span className="material-symbols-outlined text-[16px] text-blue-500">call</span>
                                            {selectedKitchen.phone}
                                        </div>
                                        {selectedKitchen.emergency && (
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-600">
                                                <span className="material-symbols-outlined text-[16px]">contact_urgent</span>
                                                SOS: {selectedKitchen.emergency}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-violet-600">
                                            <span className="material-symbols-outlined text-[16px]">payments</span>
                                            Rate: {selectedKitchen.commission || '10%'}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 mt-2.5">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-[#897a70] flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                                            {selectedKitchen.hours || '8AM - 10PM'}
                                        </span>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md">
                                            <span className="material-symbols-outlined text-[14px]">receipt_long</span>
                                            ID: {selectedKitchen.fssai || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Business & Banking Grid */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-3xl">
                                    <h5 className="text-[9px] font-black text-emerald-700 uppercase tracking-widest mb-2">Banking Payout</h5>
                                    <p className="text-[11px] font-black text-[#2D241E] truncate">A/C: {selectedKitchen.accNo || '•••• 7829'}</p>
                                    <p className="text-[9px] font-bold text-[#5C4D42] mt-1 uppercase">IFSC: {selectedKitchen.ifsc || 'SBIN0001021'}</p>
                                </div>
                                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-3xl">
                                    <h5 className="text-[9px] font-black text-blue-700 uppercase tracking-widest mb-2">Service City</h5>
                                    <p className="text-[11px] font-black text-[#2D241E]">{selectedKitchen.city || 'Indore'}</p>
                                    <p className="text-[9px] font-bold text-[#5C4D42] mt-1 uppercase">PIN: {selectedKitchen.pincode || '452001'}</p>
                                </div>
                                <div className="p-4 bg-violet-50/50 border border-violet-100 rounded-3xl">
                                    <h5 className="text-[9px] font-black text-violet-700 uppercase tracking-widest mb-2">Settlement</h5>
                                    <p className="text-[11px] font-black text-[#2D241E]">{selectedKitchen.payoutCycle || 'Weekly'}</p>
                                    <p className="text-[9px] font-bold text-[#5C4D42] mt-1 uppercase">Batch: #882</p>
                                </div>
                            </div>

                            {/* --- Super Admin Section [NEW] --- */}
                            <div className="p-5 bg-orange-50/50 border border-orange-100 rounded-[2.5rem] relative overflow-hidden">
                                <div className="absolute top-0 left-0 bg-orange-100 px-4 py-1.5 rounded-br-2xl border-b border-r border-orange-200">
                                    <span className="text-[10px] font-black text-orange-700 uppercase tracking-widest flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
                                        Super Admin Controls
                                    </span>
                                </div>

                                <div className="mt-8 grid grid-cols-2 gap-6">
                                    {/* Action Buttons */}
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => handleLoginAs(selectedKitchen)}
                                            className="w-full py-3 bg-[#2D241E] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2D241E]/20"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">login</span>
                                            Login as Kitchen
                                        </button>
                                        <button
                                            onClick={() => handleForcePayout(selectedKitchen)}
                                            className="w-full py-3 bg-white border border-gray-200 text-[#2D241E] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">payments</span>
                                            Force Payout
                                        </button>
                                    </div>

                                    {/* Metrics & Remarks */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-bold text-[#897a70] border-b border-orange-100 pb-2">
                                            <span>Hygiene Score</span>
                                            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">98/100</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-bold text-[#897a70] border-b border-orange-100 pb-2">
                                            <span>Late Deliveries (This Month)</span>
                                            <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg">2 Orders</span>
                                        </div>
                                        <textarea
                                            placeholder="Internal Admin Remarks (Only visible to Super Admin)..."
                                            className="w-full bg-white border border-orange-100 rounded-xl p-3 text-[10px] font-medium text-[#2D241E] resize-none focus:outline-none focus:border-orange-300 h-20 shadow-inner"
                                        ></textarea>
                                    </div>

                                    {/* Audit Log [NEW] */}
                                    <div className="col-span-2 pt-4 border-t border-orange-100/50">
                                        <h5 className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[14px]">history</span>
                                            Audit Trail
                                        </h5>
                                        <div className="space-y-1.5">
                                            {[
                                                { action: 'Payout of ₹12,400 Processed', time: '2h ago', by: 'System Automation' },
                                                { action: 'Menu Updated (Winter Special)', time: '5h ago', by: 'Kitchen Owner' },
                                                { action: 'Commission Adjusted to 12%', time: '1d ago', by: 'Super Admin (You)' }
                                            ].map((log, i) => (
                                                <div key={i} className="flex justify-between items-center text-[10px] font-medium text-[#2D241E] bg-white/60 p-2 rounded-lg border border-orange-50 hover:bg-white transition-all">
                                                    <span className="truncate flex-1">{log.action}</span>
                                                    <span className="text-[#897a70] text-[9px] shrink-0 ml-4">{log.time} • {log.by}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Graphics */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-gray-50/50 border border-gray-100 rounded-[2rem] relative overflow-hidden">
                                    <h5 className="text-[10px] font-black text-[#897a70] uppercase tracking-widest mb-3">Today's Load</h5>
                                    <div className="flex items-end justify-between h-20 px-2 pb-2">
                                        {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                                            <div key={i} className="w-2 bg-orange-200 rounded-t-full transition-all hover:bg-orange-500" style={{ height: `${h}%` }}></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-5 bg-gray-50/50 border border-gray-100 rounded-[2rem]">
                                    <h5 className="text-[10px] font-black text-[#897a70] uppercase tracking-widest mb-3">Menu Snapshot</h5>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2 text-[10px] font-bold text-[#2D241E]">
                                            <span className="size-1.5 rounded-full bg-emerald-500"></span> Paneer Butter Masala
                                        </li>
                                        <li className="flex items-center gap-2 text-[10px] font-bold text-[#2D241E]">
                                            <span className="size-1.5 rounded-full bg-emerald-500"></span> Dal Fry + Jeera Rice
                                        </li>
                                        <li className="flex items-center gap-2 text-[10px] font-bold text-[#2D241E]">
                                            <span className="size-1.5 rounded-full bg-emerald-500"></span> 4 Butter Roti
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Documents Section */}
                            <div>
                                <h5 className="text-[10px] font-black text-[#897a70] uppercase tracking-widest mb-3 ml-1">Compliance Documents</h5>
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {['FSSAI License', 'Owner Aadhar', 'Kitchen Photos', 'Fire Safety Noc'].map((doc, i) => (
                                        <div key={i} className="min-w-[120px] h-24 bg-white border border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-orange-500/50 transition-all cursor-pointer group">
                                            <span className="material-symbols-outlined text-gray-400 group-hover:text-orange-500 transition-colors">folder_open</span>
                                            <span className="text-[9px] font-bold text-[#5C4D42]">{doc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* 3. Register/Edit Kitchen Modal - [POLISHED & COMPREHENSIVE] */}
            {(showRegisterModal || editingKitchen) && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2D241E]/80 backdrop-blur-md animate-[fadeIn_0.3s]" onClick={() => { setShowRegisterModal(false); setEditingKitchen(null); }}></div>
                    <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl animate-[scaleIn_0.3s] relative z-10 border border-white/20 flex flex-col max-h-[90vh]">
                        {/* Texture */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2D241E 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                        {/* Header */}
                        <div className="p-8 pb-4 flex justify-between items-start shrink-0">
                            <div>
                                <h3 className="text-2xl font-black text-[#2D241E] tracking-tight">{editingKitchen ? 'Edit Kitchen' : 'Onboard Partner'}</h3>
                                <p className="text-[11px] font-bold text-[#897a70] mt-1">Kitchen Identity & Compliance Setup</p>
                            </div>
                            <button onClick={() => { setShowRegisterModal(false); setEditingKitchen(null); }} className="size-9 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all">
                                <span className="material-symbols-outlined text-[18px] text-[#5C4D42]">close</span>
                            </button>
                        </div>

                        {/* Form Body - Manual Submit for maximum reliability */}
                        <div className="p-8 pt-0 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                            <form ref={formRef} className="space-y-6">

                                {/* Profile Preview (only for Edit) */}
                                {editingKitchen && (
                                    <div className="p-4 bg-[#FDFBF9] border border-orange-100/50 rounded-[20px] flex items-center gap-4 mb-2">
                                        <div className="size-14 rounded-xl bg-orange-100 flex items-center justify-center text-xl font-black text-orange-600 shadow-inner">
                                            {editingKitchen.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-[#2D241E] leading-tight">{editingKitchen.name}</h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[9px] font-black rounded-md uppercase">{editingKitchen.status}</span>
                                                <span className="text-[10px] font-bold text-[#897a70]">Since {editingKitchen.joins}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Section 1: Kitchen Identity */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 px-1">
                                        <div className="size-7 bg-orange-50 rounded-lg flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[18px] text-orange-600">storefront</span>
                                        </div>
                                        <h4 className="text-[11px] font-black text-[#2D241E] uppercase tracking-widest">Kitchen Identity</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-[#897a70] uppercase ml-3 tracking-widest">Kitchen Name</label>
                                            <input name="name" type="text" defaultValue={editingKitchen?.name} className="w-full bg-white border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:border-orange-200 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none shadow-sm" placeholder="e.g. Annapurna Rasoi" required />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-[#897a70] uppercase ml-3 tracking-widest">FSSAI License No.</label>
                                            <input name="fssai" type="text" defaultValue={editingKitchen?.fssai} className="w-full bg-white border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:border-orange-200 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none shadow-sm" placeholder="14-digit number" required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-[#897a70] uppercase ml-3 tracking-widest">City</label>
                                            <input name="city" type="text" defaultValue={editingKitchen?.city || 'Indore'} className="w-full bg-white border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:border-orange-200 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none shadow-sm" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-[#897a70] uppercase ml-3 tracking-widest">Pincode</label>
                                            <input name="pincode" type="text" defaultValue={editingKitchen?.pincode} className="w-full bg-white border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:border-orange-200 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none shadow-sm" placeholder="452001" required />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-[#897a70] uppercase ml-3 tracking-widest">Type</label>
                                            <select name="type" defaultValue={editingKitchen?.type} className="w-full bg-white border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:border-orange-200 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none appearance-none shadow-sm">
                                                <option>Pure Veg</option>
                                                <option>Veg/Non-Veg</option>
                                                <option>Diet Special</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Owner & Contact Details */}
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-2 px-1">
                                        <div className="size-7 bg-violet-50 rounded-lg flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[18px] text-violet-600">badge</span>
                                        </div>
                                        <h4 className="text-[11px] font-black text-[#2D241E] uppercase tracking-widest">Owner & Contact</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-[#897a70] uppercase ml-3 tracking-widest">Owner Name</label>
                                            <input name="owner" type="text" defaultValue={editingKitchen?.owner} className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-violet-200 outline-none" placeholder="Full Name" required />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-[#897a70] uppercase ml-3 tracking-widest">Email Address</label>
                                            <input name="email" type="email" defaultValue={editingKitchen?.email} className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-violet-200 outline-none" placeholder="owner@email.com" required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-[#897a70] uppercase ml-3 tracking-widest">Primary Phone</label>
                                            <input name="phone" type="tel" defaultValue={editingKitchen?.phone} className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-violet-200 outline-none" placeholder="10-digit number" required />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-[#897a70] uppercase ml-3 tracking-widest">Emergency Contact</label>
                                            <input name="emergency" type="tel" defaultValue={editingKitchen?.emergency} className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-violet-200 outline-none" placeholder="Secondary Phone" />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Bank Details for Payouts */}
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-2 px-1">
                                        <div className="size-7 bg-emerald-50 rounded-lg flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[18px] text-emerald-600">account_balance</span>
                                        </div>
                                        <h4 className="text-[11px] font-black text-[#2D241E] uppercase tracking-widest">Payout Details (Bank)</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-[#897a70] uppercase ml-3 tracking-widest">Account Number</label>
                                            <input name="accNo" type="text" defaultValue={editingKitchen?.accNo} className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-emerald-200 outline-none" placeholder="000000000000" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-[#897a70] uppercase ml-3 tracking-widest">IFSC Code</label>
                                            <input name="ifsc" type="text" defaultValue={editingKitchen?.ifsc} className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-emerald-200 outline-none" placeholder="SBIN0001234" />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 4: Operations & Logistics */}
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-2 px-1">
                                        <div className="size-7 bg-amber-50 rounded-lg flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[18px] text-amber-600">local_shipping</span>
                                        </div>
                                        <h4 className="text-[11px] font-black text-[#2D241E] uppercase tracking-widest">Operations</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-[#897a70] uppercase ml-3 tracking-widest">Meal Capacity</label>
                                            <input name="capacity" type="number" defaultValue={editingKitchen?.capacity} className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-amber-200 outline-none" required />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-[#897a70] uppercase ml-3 tracking-widest">Commission (%)</label>
                                            <input name="commission" type="text" defaultValue={editingKitchen?.commission || '10%'} className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-amber-200 outline-none" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-[#897a70] uppercase ml-3 tracking-widest">Operational Hours</label>
                                            <input name="hours" type="text" defaultValue={editingKitchen?.hours || '8AM - 10PM'} className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-amber-200 outline-none" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-[#897a70] uppercase ml-3 tracking-widest">Payout Cycle</label>
                                            <select name="payoutCycle" defaultValue={editingKitchen?.payoutCycle || 'Weekly'} className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-amber-200 outline-none appearance-none">
                                                <option value="Weekly">Weekly</option>
                                                <option value="Bi-Weekly">Bi-Weekly</option>
                                                <option value="Monthly">Monthly</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-[#897a70] uppercase ml-3 tracking-widest">Full Operational Address</label>
                                        <textarea name="location" defaultValue={editingKitchen?.location} className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-amber-200 outline-none h-20 resize-none" placeholder="Complete address..." />
                                    </div>
                                </div>

                                {/* Section 5: Document Verification (Placeholders) */}
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-2 px-1">
                                        <div className="size-7 bg-amber-50 rounded-lg flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[18px] text-amber-600">description</span>
                                        </div>
                                        <h4 className="text-[11px] font-black text-[#2D241E] uppercase tracking-widest">Verification Documents</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['FSSAI Cert', 'Owner ID', 'Kitchen Photos', 'Other Doc'].map((doc, idx) => (
                                            <div key={idx} className="p-3 bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-white hover:border-orange-300 transition-all group">
                                                <span className="material-symbols-outlined text-gray-400 group-hover:text-orange-500 text-[20px]">cloud_upload</span>
                                                <span className="text-[10px] font-bold text-[#5C4D42]">{doc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Footer Actions */}
                        <div className="pt-6 flex gap-4 sticky bottom-0 bg-white/90 backdrop-blur-sm pb-6 px-8 border-t border-gray-100 shrink-0 rounded-b-[2.5rem]">
                            <button
                                type="button"
                                onClick={() => {
                                    if (window.confirm('Discard changes? All unsaved data will be lost.')) {
                                        setShowRegisterModal(false);
                                        setEditingKitchen(null);
                                    }
                                }}
                                className="flex-1 py-4 rounded-2xl text-[10px] font-black text-[#897a70] hover:bg-gray-100 transition-all uppercase tracking-widest"
                            >
                                Discard
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    console.log("Complete/Update Button Clicked");
                                    if (editingKitchen) handleUpdate();
                                    else handleSaveNew();
                                }}
                                className="flex-[2] py-4 bg-[#2D241E] text-white rounded-[1.5rem] text-[10px] font-black shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all uppercase tracking-widest"
                            >
                                {editingKitchen ? 'Update Kitchen Data' : 'Complete Registration'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AdminProviders;
