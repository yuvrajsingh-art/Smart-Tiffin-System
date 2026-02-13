import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const AdminProviders = () => {
    const formRef = useRef(null);
    // Mock Data
    // Data State
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Providers
    const fetchProviders = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/admin/providers', {
                headers: { Authorization: `Bearer ${token}` }
            });
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
                    hours: p.profile?.lunch_start ? `${p.profile.lunch_start} - ${p.profile.dinner_end}` : '8AM - 10PM'
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
    const [viewingDocument, setViewingDocument] = useState(null); // { name: string, providerId: string }

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
            const token = localStorage.getItem('token');
            const { data } = await axios.put(
                `/api/admin/providers/${id}/verify`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
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
            const token = localStorage.getItem('token');
            // Using Status Toggle to ban/suspend as rejection for now
            const { data } = await axios.put(
                `/api/admin/providers/${id}/status`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
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
    const handleSaveNew = async (e) => {
        console.log("handleSaveNew called (Real API)");
        try {
            if (e && e.preventDefault) e.preventDefault();
            const form = formRef.current;
            if (!form) return;

            const name = form.elements['name']?.value;
            const owner = form.elements['owner']?.value;
            const email = form.elements['email']?.value;
            const mobile = form.elements['phone']?.value;
            const fssai = form.elements['fssai']?.value;
            const commission = form.elements['commission']?.value?.replace('%', '') || '15';
            const password = "Kitchen@123"; // Default initial password

            if (!name || !email || !mobile) {
                toast.error("Name, Email, and Phone are required");
                return;
            }

            const procToast = toast.loading("Registering kitchen on cloud...");
            const token = localStorage.getItem('token');

            try {
                const { data } = await axios.post(
                    '/api/admin/providers',
                    {
                        fullName: owner,
                        email,
                        password,
                        mobile,
                        messName: name,
                        fssaiNumber: fssai,
                        commission_rate: parseInt(commission),
                        bankDetails: {
                            accountNumber: form.elements['accNo']?.value,
                            ifscCode: form.elements['ifsc']?.value
                        },
                        location: {
                            address: form.elements['location']?.value,
                            city: form.elements['city']?.value,
                            pincode: form.elements['pincode']?.value,
                            coordinates: [0, 0]
                        }
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                toast.dismiss(procToast);
                if (data.success) {
                    toast.success(`${name} Registered Successfully!`, {
                        icon: '🍳',
                        style: { borderRadius: '10px', background: '#2D241E', color: '#fff' }
                    });
                    fetchProviders();
                    setShowRegisterModal(false);
                }
            } catch (err) {
                toast.dismiss(procToast);
                toast.error(err.response?.data?.message || "Cloud Registration Failed");
            }
        } catch (err) {
            console.error("Registration Logic Error:", err);
            toast.error("Error: " + err.message);
        }
    };

    const handleUpdate = async (e) => {
        console.log("handleUpdate called (Real API)");
        try {
            if (e && e.preventDefault) e.preventDefault();
            const form = formRef.current;
            if (!form) return;

            const procToast = toast.loading("Saving changes to cloud...");
            const token = localStorage.getItem('token');
            const providerId = editingKitchen?._id || editingKitchen?.id;

            const updateData = {
                fullName: form.elements['owner']?.value,
                messName: form.elements['name']?.value,
                mobile: form.elements['phone']?.value,
                email: form.elements['email']?.value,
                fssaiNumber: form.elements['fssai']?.value,
                commission_rate: parseInt(form.elements['commission']?.value?.replace('%', '') || '15'),
                location: {
                    address: form.elements['location']?.value,
                    city: form.elements['city']?.value,
                    pincode: form.elements['pincode']?.value,
                    coordinates: editingKitchen.location?.coordinates || [0, 0]
                },
                bankDetails: {
                    accountNumber: form.elements['accNo']?.value,
                    ifscCode: form.elements['ifsc']?.value
                }
            };

            try {
                const { data } = await axios.put(
                    `/api/admin/providers/${providerId}`,
                    updateData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                toast.dismiss(procToast);
                if (data.success) {
                    toast.success('Kitchen Profile Updated!', {
                        icon: '💾',
                        style: { borderRadius: '10px', background: '#2D241E', color: '#fff' }
                    });
                    fetchProviders();
                    setEditingKitchen(null);
                    setShowRegisterModal(false);
                }
            } catch (err) {
                toast.dismiss(procToast);
                toast.error(err.response?.data?.message || "Cloud Update Failed");
            }
        } catch (err) {
            console.error("Update Logic Error:", err);
            toast.error("Failed to update.");
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
                                <th className="px-6 py-4 text-[11px] font-bold text-[#5C4D42] uppercase tracking-wider">Stats</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-[#5C4D42] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <SkeletonLoader type="table-row" count={5} />
                            ) : filteredProviders.length > 0 ? (
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
                                                            onClick={() => setSelectedKitchen(pro)}
                                                            className="size-8 rounded-xl bg-[#2D241E] text-white flex items-center justify-center hover:bg-violet-600 transition-all shadow-lg shadow-black/10"
                                                            title="View Application Details"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">visibility</span>
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

                                {/* Enhanced Performance Stats (Simplified) */}
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="p-5 bg-emerald-50 rounded-[1.8rem] border border-emerald-100/50 flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Lifetime Rating</p>
                                            <p className="text-2xl font-bold text-emerald-700">4.85 ★</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Consistency</p>
                                            <p className="text-sm font-bold text-blue-700">Elite Tier Provider</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Provider Health Marker (Simplified) */}
                                <div className="p-4 bg-gray-50 border border-gray-100 rounded-[1.5rem] flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                            <span className="material-symbols-outlined text-[16px]">verified</span>
                                        </div>
                                        <span className="text-xs font-bold text-[#2D241E]">Verified Ecosystem Partner</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Excellent Standing</span>
                                </div>

                                {/* Documents Section */}
                                <div>
                                    <h5 className="text-xs font-bold text-[#897a70] uppercase tracking-wider mb-3 ml-1">Compliance Documents</h5>
                                    <div className="flex gap-3 overflow-x-auto pb-2">
                                        {['FSSAI License', 'Owner Aadhar', 'Kitchen Photos', 'Fire Safety Noc'].map((doc, i) => (
                                            <div
                                                key={i}
                                                onClick={() => setViewingDocument({ name: doc, provider: selectedKitchen.name })}
                                                className="min-w-[120px] h-24 bg-white border border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-orange-500/50 transition-all cursor-pointer group hover:shadow-md"
                                            >
                                                <span className="material-symbols-outlined text-gray-400 group-hover:text-orange-500 transition-colors">visibility</span>
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

            {/* 4. Document Viewer Modal */}
            {
                viewingDocument && createPortal(
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setViewingDocument(null)}></div>
                        <div className="bg-transparent w-full max-w-4xl relative z-10 flex flex-col h-[85vh]">

                            {/* Toolbar */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-white">
                                    <h3 className="text-lg font-bold">{viewingDocument.name}</h3>
                                    <p className="text-sm opacity-70">Reviewing document for {viewingDocument.provider}</p>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => toast.success("Document Verified", { icon: '✅', style: { borderRadius: '10px', background: '#2D241E', color: '#fff' } })} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                        Verify
                                    </button>
                                    <button onClick={() => setViewingDocument(null)} className="size-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                            </div>

                            {/* Viewer Stage */}
                            <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-[2rem] border border-white/10 flex items-center justify-center relative overflow-hidden group">
                                <div className="text-center p-10">
                                    <span className="material-symbols-outlined text-8xl text-white/20 mb-4 group-hover:scale-110 transition-transform duration-500">description</span>
                                    <p className="text-white/40 text-lg font-bold uppercase tracking-widest">Compliance Vault</p>
                                    <p className="text-white/20 text-xs mt-2 uppercase tracking-widest">Verification Pending • Storage Protected</p>
                                </div>
                                {/* Mock watermark */}
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center rotate-[-45deg] opacity-5">
                                    <span className="text-9xl font-bold text-white uppercase">Confidential</span>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }
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
