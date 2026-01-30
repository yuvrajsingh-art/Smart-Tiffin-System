import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';

const AdminProviders = () => {
    const formRef = useRef(null);
    // Mock Data
    // Data State
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Providers
    const fetchProviders = async () => {
        try {
            const { data } = await axios.get('/api/admin/providers');
            if (data.success && Array.isArray(data.data)) {
                const transformed = data.data.map(p => ({
                    ...p,
                    id: p._id,
                    name: p.profile?.messName || p.fullName || 'Unknown',
                    owner: p.fullName || 'Unknown',
                    location: p.profile?.location?.address || p.address || 'Address Not Set',
                    status: p.isVerified ? (p.status === 'active' ? 'Active' : 'Suspended') : 'Pending',
                    type: p.profile?.legalStatus || 'Standard',
                    phone: p.profile?.phone || p.mobile || 'N/A',
                    pincode: p.profile?.location?.pincode || '',
                    city: p.profile?.location?.city || '',
                    fssai: p.profile?.fssaiNumber || 'N/A',
                    accNo: p.profile?.bankDetails?.accountNumber || 'N/A',
                    ifsc: p.profile?.bankDetails?.ifscCode || 'N/A',
                    commission: `${p.profile?.commission_rate || 15}%`,
                    hours: '8AM - 10PM',
                    capacity: 50,
                    currentLoad: 0
                }));
                setProviders(transformed);
            }
        } catch (error) {
            console.error("Error fetching providers:", error);
            toast.error("Failed to load providers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProviders();
    }, []);

    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [filter, setFilter] = useState('All');
    const [selectedKitchen, setSelectedKitchen] = useState(null); // For Profile Modal
    const [showRegisterModal, setShowRegisterModal] = useState(false); // For Add Modal
    const [editingKitchen, setEditingKitchen] = useState(null); // For Edit Modal
    const [showRequestsModal, setShowRequestsModal] = useState(false); // For Requests Modal

    // Derived Data
    const filteredProviders = (providers || []).filter(pro => {
        const matchesSearch = (pro?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || (pro?.id?.toString()?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'All' || pro?.status === filter;
        return matchesSearch && matchesFilter;
    });

    // Mock Pending Requests
    const pendingRequests = providers.filter(p => p.status === 'Pending');

    const handleAction = (type, name) => {
        toast.success(`${type} action triggered for ${name}`, {
            style: { borderRadius: '10px', background: '#2D241E', color: '#fff', fontSize: '10px' }
        });
    };

    const handleApproveRequest = async (id, name) => {
        try {
            const { data } = await axios.put(`/api/admin/providers/${id}/verify`);
            if (data.success) {
                toast.success(`${name} Approved! Now live on the platform.`, {
                    icon: '🚀',
                    style: { borderRadius: '10px', background: '#2D241E', color: '#fff' }
                });
                fetchProviders(); // Refresh list
                if (pendingRequests.length <= 1) setShowRequestsModal(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Approval Failed");
        }
    };

    const handleRejectRequest = async (id, name) => {
        if (!window.confirm(`Reject application for ${name}?`)) return;
        try {
            // Using Status Toggle to ban/suspend as rejection for now
            const { data } = await axios.put(`/api/admin/providers/${id}/status`);
            if (data.success) {
                toast.error(`${name}'s application has been rejected.`, {
                    icon: '❌',
                    style: { borderRadius: '10px', background: '#2D241E', color: '#fff' }
                });
                fetchProviders();
                if (pendingRequests.length <= 1) setShowRequestsModal(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Action Failed");
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const { data } = await axios.put(`/api/admin/providers/${id}/status`);
            if (data.success) {
                const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
                toast.success(`Kitchen status changed to ${newStatus}`, {
                    icon: newStatus === 'Active' ? '✅' : '🚫',
                    style: { borderRadius: '10px', background: '#2D241E', color: '#fff' }
                });
                fetchProviders();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Status Change Failed");
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to remove ${name}?`)) return;

        const token = localStorage.getItem('token');
        try {
            const res = await axios.delete(
                `/api/admin/providers/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                fetchProviders();
                toast.success(`${name} has been removed.`, { icon: '🗑️', style: { borderRadius: '10px', background: '#2D241E', color: '#fff' } });
                if (selectedKitchen?._id === id || selectedKitchen?.id === id) setSelectedKitchen(null);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete provider');
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
        <div className="space-y-6 max-w-[1600px] mx-auto min-h-screen pb-10 relative">

            {/* Header Block */}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-[#2D241E] tracking-tight uppercase">Provider Network</h1>
                        <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-lg shadow-emerald-500/10">{providers.filter(p => p.status === 'Active').length} LIVE</span>
                    </div>
                    <p className="text-[#897a70] text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Manage & Monitor All Kitchens
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowRequestsModal(true)}
                        className="px-5 py-2.5 bg-white border border-gray-200 text-[#2D241E] rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-gray-50 flex items-center gap-2 shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[18px]">verified</span>
                        Requests ({pendingRequests.length})
                    </button>
                    <button
                        onClick={() => setShowRegisterModal(true)}
                        className="px-5 py-2.5 bg-[#2D241E] text-white rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-[#453831] flex items-center gap-2 shadow-xl shadow-black/10 scale-105 active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[18px]">add_circle</span>
                        Add Kitchen
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                {
                    [
                        { label: 'Active Kitchens', val: providers.filter(p => p.status === 'Active').length, icon: 'storefront', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Total Capacity', val: providers.reduce((acc, p) => acc + (p.status === 'Active' ? p.capacity : 0), 0), icon: 'restaurant', color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Avg Rating', val: (providers.filter(p => p.rating > 0).reduce((acc, p) => acc + p.rating, 0) / (providers.filter(p => p.rating > 0).length || 1)).toFixed(1), icon: 'star', color: 'text-amber-600', bg: 'bg-amber-50' },
                        { label: 'Pending Apps', val: pendingRequests.length, icon: 'pending_actions', color: 'text-violet-600', bg: 'bg-violet-50' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/70 backdrop-blur-xl p-5 rounded-[2rem] border border-white/60 shadow-lg group hover:shadow-xl transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <div className={`size-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                                    <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
                                </div>
                                <span className="text-xs font-bold text-[#897a70] uppercase tracking-wider leading-none mt-1">{stat.label}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-[#2D241E] tracking-tighter mt-4">{stat.val}</h3>
                        </div>
                    ))
                }
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="flex-1 w-full bg-white/70 backdrop-blur-xl p-4 rounded-[2rem] border border-white/60 shadow-lg flex flex-col sm:flex-row items-center gap-3">
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
                                className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${filter === t ? 'bg-[#2D241E] text-white shadow-lg' : 'text-[#897a70] hover:text-[#2D241E]'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Providers Table */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[11px] font-bold text-[#5C4D42] uppercase tracking-wider">Kitchen Identity</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-[#5C4D42] uppercase tracking-wider">Capacity & Load</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-[#5C4D42] uppercase tracking-wider">Stats</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-[#5C4D42] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProviders.length > 0 ? (
                                filteredProviders.map((pro) => (
                                    <tr key={pro.id} className="group hover:bg-white/60 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-[1rem] bg-orange-100 text-orange-600 flex items-center justify-center text-lg font-bold shadow-sm overflow-hidden">
                                                    {(pro?.name || 'K').charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-bold text-[#2D241E]">{pro.name}</p>
                                                        <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded uppercase ${pro.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : pro.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                                                            {pro.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-[#897a70] font-bold">{pro.location}</p>
                                                    <p className="text-[10px] text-[#897a70] opacity-70 font-medium">Owner: {pro.owner}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-32">
                                                <div className="flex justify-between text-[11px] font-bold mb-1">
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
                                                            title="View Kitchen Profile"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(pro._id || pro.id, pro.name || pro.fullName)}
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
                                            <p className="text-base font-bold text-[#2D241E]">No kitchens found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODALS --- */}

            {/* 1. Join Requests Modal */}
            {
                showRequestsModal && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowRequestsModal(false)}></div>
                        <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh]">

                            {/* Compact Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 bg-orange-100 rounded-xl flex items-center justify-center">
                                        <span className="material-symbols-outlined text-orange-500 text-[18px]">verified</span>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-gray-800">Join Requests</h3>
                                        <p className="text-xs text-gray-500">{pendingRequests.length} pending</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowRequestsModal(false)} className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600">
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            </div>

                            {/* List */}
                            <div className="flex-1 overflow-y-auto">
                                {pendingRequests.length > 0 ? (
                                    pendingRequests.map(req => (
                                        <div key={req.id} className="p-4 flex items-center gap-3 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <div className="size-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold">
                                                {(req?.name || 'K').charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-gray-800 truncate">{req.name}</h4>
                                                <p className="text-xs text-gray-500 truncate">by {req.owner} • {req.type}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <button onClick={() => handleApproveRequest(req.id, req.name)} className="size-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all">
                                                    <span className="material-symbols-outlined text-[16px]">check</span>
                                                </button>
                                                <button onClick={() => handleRejectRequest(req.id, req.name)} className="size-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">inbox</span>
                                        <p className="text-sm font-medium text-gray-500">No pending requests</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }

            {/* 2. Kitchen Profile Modal */}
            {
                selectedKitchen && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedKitchen(null)}></div>
                        <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh]">

                            {/* Compact Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-gray-800">Kitchen Profile</h3>
                                    <p className="text-xs text-gray-500">ID: {selectedKitchen.id}</p>
                                </div>
                                <button onClick={() => setSelectedKitchen(null)} className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600">
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-4">

                                {/* Profile Card */}
                                <div className="p-5 bg-[#FDFBF9] border border-orange-100/50 rounded-[2.5rem] flex items-center gap-6 shadow-sm">
                                    <div className="size-20 rounded-2xl bg-orange-100 flex items-center justify-center text-3xl font-bold text-orange-600 shadow-inner">
                                        {(selectedKitchen?.name || 'K').charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xl font-bold text-[#2D241E] tracking-tight">{selectedKitchen.name}</h4>
                                            <div className="flex gap-2">
                                                {selectedKitchen.status === 'Pending' && (
                                                    <button onClick={() => handleApproveRequest(selectedKitchen.id, selectedKitchen.name)} className="px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-[10px] font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all">
                                                        Approve Application
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-xs font-bold text-[#897a70]">{selectedKitchen.location} {selectedKitchen.pincode && `• ${selectedKitchen.pincode}`} • {selectedKitchen.type}</p>
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
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#897a70] flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                                                <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                {selectedKitchen.hours || '8AM - 10PM'}
                                            </span>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md">
                                                <span className="material-symbols-outlined text-[14px]">receipt_long</span>
                                                ID: {selectedKitchen.fssai || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Business & Banking Grid */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-3xl">
                                        <h5 className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-2">Banking Payout</h5>
                                        <p className="text-xs font-bold text-[#2D241E] truncate">A/C: {selectedKitchen.accNo || '•••• 7829'}</p>
                                        <p className="text-[10px] font-bold text-[#5C4D42] mt-1 uppercase">IFSC: {selectedKitchen.ifsc || 'SBIN0001021'}</p>
                                    </div>
                                    <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-3xl">
                                        <h5 className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-2">Service City</h5>
                                        <p className="text-xs font-bold text-[#2D241E]">{selectedKitchen.city || 'Indore'}</p>
                                        <p className="text-[10px] font-bold text-[#5C4D42] mt-1 uppercase">PIN: {selectedKitchen.pincode || '452001'}</p>
                                    </div>
                                    <div className="p-4 bg-violet-50/50 border border-violet-100 rounded-3xl">
                                        <h5 className="text-[10px] font-bold text-violet-700 uppercase tracking-wider mb-2">Settlement</h5>
                                        <p className="text-xs font-bold text-[#2D241E]">{selectedKitchen.payoutCycle || 'Weekly'}</p>
                                        <p className="text-[10px] font-bold text-[#5C4D42] mt-1 uppercase">Batch: #882</p>
                                    </div>
                                </div>

                                {/* --- Super Admin Section [NEW] --- */}
                                <div className="p-5 bg-orange-50/50 border border-orange-100 rounded-[2.5rem] relative overflow-hidden">
                                    <div className="absolute top-0 left-0 bg-orange-100 px-4 py-1.5 rounded-br-2xl border-b border-r border-orange-200">
                                        <span className="text-xs font-bold text-orange-700 uppercase tracking-wider flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
                                            Super Admin Controls
                                        </span>
                                    </div>

                                    <div className="mt-8 grid grid-cols-2 gap-6">
                                        {/* Action Buttons */}
                                        <div className="space-y-3">
                                            <button
                                                onClick={() => handleLoginAs(selectedKitchen)}
                                                className="w-full py-3 bg-[#2D241E] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2D241E]/20"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">login</span>
                                                Login as Kitchen
                                            </button>
                                            <button
                                                onClick={() => handleForcePayout(selectedKitchen)}
                                                className="w-full py-3 bg-white border border-gray-200 text-[#2D241E] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">payments</span>
                                                Force Payout
                                            </button>
                                        </div>

                                        {/* Metrics & Remarks */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-xs font-bold text-[#897a70] border-b border-orange-100 pb-2">
                                                <span>Hygiene Score</span>
                                                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">98/100</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs font-bold text-[#897a70] border-b border-orange-100 pb-2">
                                                <span>Late Deliveries (This Month)</span>
                                                <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg">2 Orders</span>
                                            </div>
                                            <textarea
                                                placeholder="Internal Admin Remarks (Only visible to Super Admin)..."
                                                className="w-full bg-white border border-orange-100 rounded-xl p-3 text-xs font-medium text-[#2D241E] resize-none focus:outline-none focus:border-orange-300 h-20 shadow-inner"
                                            ></textarea>
                                        </div>

                                        {/* Audit Log [NEW] */}
                                        <div className="col-span-2 pt-4 border-t border-orange-100/50">
                                            <h5 className="text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[14px]">history</span>
                                                Audit Trail
                                            </h5>
                                            <div className="space-y-1.5">
                                                {[
                                                    { action: 'Payout of ₹12,400 Processed', time: '2h ago', by: 'System Automation' },
                                                    { action: 'Menu Updated (Winter Special)', time: '5h ago', by: 'Kitchen Owner' },
                                                    { action: 'Commission Adjusted to 12%', time: '1d ago', by: 'Super Admin (You)' }
                                                ].map((log, i) => (
                                                    <div key={i} className="flex justify-between items-center text-[11px] font-medium text-[#2D241E] bg-white/60 p-2 rounded-lg border border-orange-50 hover:bg-white transition-all">
                                                        <span className="truncate flex-1">{log.action}</span>
                                                        <span className="text-[#897a70] text-[10px] shrink-0 ml-4">{log.time} • {log.by}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Performance Graphics */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-gray-50/50 border border-gray-100 rounded-[2rem] relative overflow-hidden">
                                        <h5 className="text-xs font-bold text-[#897a70] uppercase tracking-wider mb-3">Today's Load</h5>
                                        <div className="flex items-end justify-between h-20 px-2 pb-2">
                                            {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                                                <div key={i} className="w-2 bg-orange-200 rounded-t-full transition-all hover:bg-orange-500" style={{ height: `${h}%` }}></div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-5 bg-gray-50/50 border border-gray-100 rounded-[2rem]">
                                        <h5 className="text-xs font-bold text-[#897a70] uppercase tracking-wider mb-3">Menu Snapshot</h5>
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
                                    <h5 className="text-xs font-bold text-[#897a70] uppercase tracking-wider mb-3 ml-1">Compliance Documents</h5>
                                    <div className="flex gap-3 overflow-x-auto pb-2">
                                        {['FSSAI License', 'Owner Aadhar', 'Kitchen Photos', 'Fire Safety Noc'].map((doc, i) => (
                                            <div key={i} className="min-w-[120px] h-24 bg-white border border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-orange-500/50 transition-all cursor-pointer group">
                                                <span className="material-symbols-outlined text-gray-400 group-hover:text-orange-500 transition-colors">folder_open</span>
                                                <span className="text-xs font-bold text-[#5C4D42]">{doc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }

            {/* 3. Register/Edit Kitchen Modal */}
            {
                (showRegisterModal || editingKitchen) && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setShowRegisterModal(false); setEditingKitchen(null); }}></div>
                        <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[88vh]">

                            {/* Compact Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-gray-800">{editingKitchen ? 'Edit Kitchen' : 'Add Kitchen'}</h3>
                                    <p className="text-xs text-gray-500">Kitchen details & compliance</p>
                                </div>
                                <button onClick={() => { setShowRegisterModal(false); setEditingKitchen(null); }} className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600">
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            </div>

                            {/* Form Body */}
                            <div className="p-5 space-y-4 overflow-y-auto flex-1">
                                <form ref={formRef} className="space-y-4">

                                    {/* Profile Preview (only for Edit) */}
                                    {editingKitchen && (
                                        <div className="p-4 bg-[#FDFBF9] border border-orange-100/50 rounded-[20px] flex items-center gap-4 mb-2">
                                            <div className="size-14 rounded-xl bg-orange-100 flex items-center justify-center text-xl font-bold text-orange-600 shadow-inner">
                                                {(editingKitchen?.name || 'K').charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-bold text-[#2D241E] leading-tight">{editingKitchen.name}</h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-md uppercase">{editingKitchen.status}</span>
                                                    <span className="text-[11px] font-bold text-[#897a70]">Since {editingKitchen.joins}</span>
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
                                            <h4 className="text-xs font-bold text-[#2D241E] uppercase tracking-wider">Kitchen Identity</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-[#897a70] uppercase ml-3 tracking-wider">Kitchen Name</label>
                                                <input name="name" type="text" defaultValue={editingKitchen?.name} className="w-full bg-white border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:border-orange-200 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none shadow-sm" placeholder="e.g. Annapurna Rasoi" required />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-[#897a70] uppercase ml-3 tracking-wider">FSSAI License No.</label>
                                                <input name="fssai" type="text" defaultValue={editingKitchen?.fssai} className="w-full bg-white border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:border-orange-200 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none shadow-sm" placeholder="14-digit number" required />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-[#897a70] uppercase ml-3 tracking-wider">City</label>
                                                <input name="city" type="text" defaultValue={editingKitchen?.city || 'Indore'} className="w-full bg-white border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:border-orange-200 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none shadow-sm" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-[#897a70] uppercase ml-3 tracking-wider">Pincode</label>
                                                <input name="pincode" type="text" defaultValue={editingKitchen?.pincode} className="w-full bg-white border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:border-orange-200 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none shadow-sm" placeholder="452001" required />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-[#897a70] uppercase ml-3 tracking-wider">Type</label>
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
                                            <h4 className="text-xs font-bold text-[#2D241E] uppercase tracking-wider">Owner & Contact</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-[#897a70] uppercase ml-3 tracking-wider">Owner Name</label>
                                                <input name="owner" type="text" defaultValue={editingKitchen?.owner} className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-violet-200 outline-none" placeholder="Full Name" required />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-[#897a70] uppercase ml-3 tracking-wider">Email Address</label>
                                                <input name="email" type="email" defaultValue={editingKitchen?.email} className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-violet-200 outline-none" placeholder="owner@email.com" required />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-[#897a70] uppercase ml-3 tracking-wider">Primary Phone</label>
                                                <input name="phone" type="tel" defaultValue={editingKitchen?.phone} className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-violet-200 outline-none" placeholder="10-digit number" required />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-[#897a70] uppercase ml-3 tracking-wider">Emergency Contact</label>
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
                                            <h4 className="text-xs font-bold text-[#2D241E] uppercase tracking-wider">Payout Details (Bank)</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-[#897a70] uppercase ml-3 tracking-wider">Account Number</label>
                                                <input name="accNo" type="text" defaultValue={editingKitchen?.accNo} className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-emerald-200 outline-none" placeholder="000000000000" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-[#897a70] uppercase ml-3 tracking-wider">IFSC Code</label>
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
                                            <h4 className="text-xs font-bold text-[#2D241E] uppercase tracking-wider">Operations</h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-[#897a70] uppercase ml-3 tracking-wider">Meal Capacity</label>
                                                <input name="capacity" type="number" defaultValue={editingKitchen?.capacity} className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-amber-200 outline-none" required />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-[#897a70] uppercase ml-3 tracking-wider">Commission (%)</label>
                                                <input name="commission" type="text" defaultValue={editingKitchen?.commission || '10%'} className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-amber-200 outline-none" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-[#897a70] uppercase ml-3 tracking-wider">Operational Hours</label>
                                                <input name="hours" type="text" defaultValue={editingKitchen?.hours || '8AM - 10PM'} className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-amber-200 outline-none" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-bold text-[#897a70] uppercase ml-3 tracking-wider">Payout Cycle</label>
                                                <select name="payoutCycle" defaultValue={editingKitchen?.payoutCycle || 'Weekly'} className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-amber-200 outline-none appearance-none">
                                                    <option value="Weekly">Weekly</option>
                                                    <option value="Bi-Weekly">Bi-Weekly</option>
                                                    <option value="Monthly">Monthly</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-[#897a70] uppercase ml-3 tracking-wider">Full Operational Address</label>
                                            <textarea name="location" defaultValue={editingKitchen?.location} className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-amber-200 outline-none h-20 resize-none" placeholder="Complete address..." />
                                        </div>
                                    </div>

                                    {/* Section 5: Document Verification (Placeholders) */}
                                    <div className="space-y-4 pt-2">
                                        <div className="flex items-center gap-2 px-1">
                                            <div className="size-7 bg-amber-50 rounded-lg flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[18px] text-amber-600">description</span>
                                            </div>
                                            <h4 className="text-xs font-bold text-[#2D241E] uppercase tracking-wider">Verification Documents</h4>
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
                                    className="flex-1 py-4 rounded-2xl text-[11px] font-bold text-[#897a70] hover:bg-gray-100 transition-all uppercase tracking-wider"
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
                                    className="flex-[2] py-4 bg-[#2D241E] text-white rounded-[1.5rem] text-[11px] font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all uppercase tracking-wider"
                                >
                                    {editingKitchen ? 'Update Kitchen Data' : 'Complete Registration'}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }
        </div>
    );
};

export default AdminProviders;
