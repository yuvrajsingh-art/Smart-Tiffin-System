import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';

const AdminPlans = () => {
    const formRef = useRef(null);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch Plans from Backend
    const fetchPlans = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/admin/plans', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setPlans(res.data.data);
            }
        } catch (err) {
            console.error("Fetch Plans Error:", err);
            toast.error("Failed to load plans");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    // Mock Data: Linked Kitchens (Franchise View)
    const linkedKitchensMock = {
        'PLN001': [
            { id: 'K1', name: "Mom's Kitchen", price: '2500', rating: 4.8, status: 'Active' },
            { id: 'K2', name: "Annapurna Mess", price: '2400', rating: 4.5, status: 'Active' },
            { id: 'K3', name: "Student Point", price: '2600', rating: 4.2, status: 'Warning' },
        ],
        'PLN002': [
            { id: 'K4', name: "Royal Tiffins", price: '3500', rating: 4.9, status: 'Active' },
        ]
    };

    const [activeView, setActiveView] = useState('Platform'); // Platform, Proposed
    const [showModal, setShowModal] = useState(false);
    const [viewKitchens, setViewKitchens] = useState(null); // ID of plan to view links for
    const [editingPlan, setEditingPlan] = useState(null);

    // Filter plans based on view
    const platformPlans = plans.filter(p => !p.provider || p.verificationStatus === 'Approved');
    const proposedPlansReal = plans.filter(p => p.provider && p.verificationStatus === 'Pending');

    // Calculate Price Variance
    const getVariance = (std, prop) => {
        const diff = prop - std;
        const percent = Math.round((diff / std) * 100);
        return { val: percent, label: percent > 0 ? `+${percent}%` : `${percent}%`, color: percent > 15 || percent < -15 ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50' };
    };



    const handleDeletePlan = async (id) => {
        if (!window.confirm("Are you sure you want to delete this plan? This cannot be undone.")) return;

        const toastId = toast.loading("Deleting plan...");
        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(`/api/admin/plans/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setPlans(prev => prev.filter(p => p._id !== id));
                toast.success("Plan deleted successfully");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete plan");
        } finally {
            toast.dismiss(toastId);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const form = formRef.current;
        if (!form) return;

        const name = form.elements['name']?.value;
        if (!name) return toast.error("Plan name is required");

        const toastId = toast.loading(editingPlan ? "Updating plan..." : "Creating plan...");
        const token = localStorage.getItem('token');

        const planData = {
            name: name,
            price: Number(form.elements['price']?.value) || 0,
            period: form.elements['period']?.value || 'Monthly',
            type: form.elements['type']?.value || 'Veg',
            description: form.elements['desc']?.value || '',
            color: form.elements['color']?.value || 'from-emerald-400 to-emerald-600',
            badge: editingPlan?.badge || 'Standard'
        };

        try {
            if (editingPlan) {
                // Update existing plan
                const res = await axios.put(
                    `/api/admin/plans/${editingPlan._id}`,
                    planData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.data.success) {
                    setPlans(prev => prev.map(p => p._id === editingPlan._id ? res.data.data : p));
                    toast.success("Standard Plan updated everywhere!");
                }
            } else {
                // Create new plan
                const res = await axios.post(
                    `/api/admin/plans`,
                    planData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.data.success) {
                    setPlans(prev => [...prev, res.data.data]);
                    toast.success("New Standard Plan Launched!", { icon: '🚀' });
                }
            }
            setShowModal(false);
            setEditingPlan(null);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save plan');
        } finally {
            toast.dismiss(toastId);
        }
    };

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto min-h-screen pb-10 relative">

            {/* Header Block */}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-[#2D241E] tracking-tight uppercase">Franchise Plans</h1>
                        <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-lg shadow-orange-500/10">Active Catalog</span>
                    </div>
                    <p className="text-[#897a70] text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                        Standard Meal Plan Catalog & Kitchen Pricing Management
                    </p>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                    <div className="flex bg-white/60 p-1 rounded-xl border border-white/50 backdrop-blur-md shadow-sm">
                        {['Platform', 'Proposed'].map(v => (
                            <button
                                key={v}
                                onClick={() => setActiveView(v)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${activeView === v ? 'bg-[#2D241E] text-white shadow-md' : 'text-[#897a70] hover:text-[#2D241E]'}`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                </div>
            </div>



            {/* 2. Executive Stats (Optional context for Plans) */}
            < div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" >
                {
                    [
                        { label: 'Active Subscriptions', val: '2,845', sub: '+124 this week', icon: 'loyalty', color: 'text-orange-600', bg: 'bg-orange-50' },
                        { label: 'Franchise Kitchens', val: '42', sub: '98% Coverage', icon: 'storefront', color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Avg Order Value', val: '₹3,200', sub: 'Per Month', icon: 'payments', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Pending Proposals', val: proposedPlansReal.length.toString(), sub: 'Needs Review', icon: 'rate_review', color: 'text-rose-500', bg: 'bg-rose-50' },
                    ].map((s, i) => (
                        <div key={i} className="bg-white/70 backdrop-blur-xl p-5 rounded-[2rem] border border-white/60 shadow-lg group hover:shadow-xl transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <div className={`size-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center`}>
                                    <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                                </div>
                                <span className="text-xs font-bold text-[#897a70] uppercase tracking-wider leading-none mt-1">{s.label}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-[#2D241E] tracking-tighter mt-4">{s.val}</h3>
                            <p className="text-[10px] font-bold text-[#897a70] mt-1">{s.sub}</p>
                        </div>
                    ))
                }
            </div >


            {/* View: Standard Platform Plans */}
            {
                activeView === 'Platform' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {platformPlans.map(plan => (
                            <div key={plan._id} className="group relative flex flex-col h-full bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-300">

                                {/* Card Header */}
                                <div className={`h-32 bg-gradient-to-br ${plan.color} relative p-5 flex flex-col justify-between shrink-0 rounded-t-[2rem] overflow-hidden`}>
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                                    <div className="relative z-10 flex justify-between items-start">
                                        <span className="px-2 py-0.5 bg-black/20 backdrop-blur-md rounded-lg text-[10px] font-bold text-white/90 uppercase tracking-wider border border-white/10">{plan.badge}</span>
                                        <div className="size-7 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white text-[14px]">restaurant</span>
                                        </div>
                                    </div>
                                    <div className="relative z-10 text-white">
                                        <h3 className="text-lg font-bold tracking-tight leading-none drop-shadow-md">{plan.name}</h3>
                                        <div className="flex flex-col gap-1 mt-2">
                                            <p className="text-[10px] font-medium opacity-90 flex items-center gap-1">
                                                <span className="size-1 rounded-full bg-white"></span>
                                                {plan.type} Series
                                            </p>
                                            <p className="text-[10px] font-bold text-white/70 uppercase tracking-tighter flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[12px]">storefront</span>
                                                {plan.provider?.fullName || 'Platform Standard'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-end gap-1 mb-4">
                                        <span className="text-2xl font-bold text-[#2D241E] tracking-tighter">₹{plan.price}</span>
                                        <span className="text-[10px] font-bold text-[#897a70] mb-1.5">/{plan.period === 'Monthly' ? 'mo' : 'wk'}</span>
                                    </div>

                                    <div className="space-y-4 mb-6 flex-1">
                                        <div className="p-3 bg-[#F9F6F3] rounded-xl border border-[#2D241E]/5">
                                            <p className="text-[10px] font-medium text-[#5C4D42] leading-relaxed line-clamp-3">
                                                {plan.description}
                                            </p>
                                        </div>

                                        {/* Linked Kitchens Summary */}
                                        <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="flex -space-x-1.5">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="size-5 rounded-full bg-white border border-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-500">K{i}</div>
                                                ))}
                                                <div className="size-5 rounded-full bg-[#2D241E] border border-white flex items-center justify-center text-[10px] font-bold text-white">+5</div>
                                            </div>
                                            <button
                                                onClick={() => setViewKitchens(plan)}
                                                className="text-xs font-bold text-orange-600 hover:text-orange-700 uppercase tracking-wider"
                                            >
                                                View Kitchens
                                            </button>
                                        </div>
                                    </div>

                                    {/* Actions - Review Flow */}
                                    <div className="flex flex-col gap-2 mt-auto">
                                        {plan.verificationStatus === 'Pending' ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={async () => {
                                                        const token = localStorage.getItem('token');
                                                        try {
                                                            await axios.put(`/api/admin/plans/${plan._id}/approve`, {}, {
                                                                headers: { Authorization: `Bearer ${token}` }
                                                            });
                                                            toast.success("Plan Approved!");
                                                            fetchPlans();
                                                        } catch (err) {
                                                            toast.error("Approval failed");
                                                        }
                                                    }}
                                                    className="flex-1 py-2.5 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        const reason = window.prompt("Reason for rejection?");
                                                        if (reason === null) return;
                                                        const token = localStorage.getItem('token');
                                                        try {
                                                            await axios.put(`/api/admin/plans/${plan._id}/reject`, { reason }, {
                                                                headers: { Authorization: `Bearer ${token}` }
                                                            });
                                                            toast.success("Plan Rejected");
                                                            fetchPlans();
                                                        } catch (err) {
                                                            toast.error("Rejection failed");
                                                        }
                                                    }}
                                                    className="flex-1 py-2.5 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg active:scale-95"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <div className={`p-2 rounded-xl text-center text-[10px] font-black uppercase tracking-widest ${plan.verificationStatus === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                                }`}>
                                                {plan.verificationStatus}
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setViewKitchens(plan)}
                                            className="w-full py-2 bg-[#2D241E]/5 text-[#2D241E] border border-[#2D241E]/10 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-[#2D241E]/10 transition-all active:scale-95"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                ) : (
                    /* View: Kitchen Proposals */
                    <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-[#2D241E]">Pending Proposals</h3>
                                <p className="text-[10px] text-[#897a70] font-bold mt-1">Kitchens requesting to sell Standard Plans at custom prices.</p>
                            </div>
                            <div className="flex gap-2">
                                {proposedPlansReal.length > 999 && ( // Temporarily disabled variance check as it needs base price comparison
                                    <div className="px-2 py-0.5 bg-rose-50 rounded-lg border border-rose-100 flex items-center gap-1.5 animate-pulse">
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
                                        </span>
                                        <span className="text-xs font-bold text-rose-600">High Variance Detected</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50 bg-white/50">
                                        <th className="px-6 py-4 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Kitchen</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Target Plan</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Standard Price</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Proposed Price</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Variance</th>
                                        <th className="px-6 py-4 text-[11px] font-bold text-[#897a70] uppercase tracking-wider text-right">Decision</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {proposedPlansReal.length > 0 ? (
                                        proposedPlansReal.map(prop => {
                                            return (
                                                <tr key={prop._id} className="group hover:bg-white/60 transition-all">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-[10px]">{(prop.provider?.fullName || 'K').charAt(0)}</div>
                                                            <div>
                                                                <p className="text-xs font-bold text-[#2D241E]">{prop.provider?.fullName || 'Unknown Kitchen'}</p>
                                                                <p className="text-xs font-bold text-[#897a70]">{new Date(prop.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-xs font-bold text-[#5C4D42]">{prop.name}</p>
                                                        <span className={`text-[10px] font-bold uppercase ${prop.type === 'Veg' ? 'text-emerald-600' : 'text-rose-600'}`}>{prop.type}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-xs font-bold text-gray-400">₹{prop.price}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm font-bold text-[#2D241E]">₹{prop.price}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold text-emerald-600 bg-emerald-50`}>
                                                            Standard
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={async () => {
                                                                    const token = localStorage.getItem('token');
                                                                    try {
                                                                        await axios.put(`/api/admin/plans/${prop._id}/approve`, {}, {
                                                                            headers: { Authorization: `Bearer ${token}` }
                                                                        });
                                                                        toast.success("Plan Approved!");
                                                                        fetchPlans();
                                                                    } catch (err) {
                                                                        toast.error("Approval failed");
                                                                    }
                                                                }}
                                                                className="size-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/15" title="Approve"
                                                            >
                                                                <span className="material-symbols-outlined text-[14px]">check</span>
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    const reason = window.prompt("Reason for rejection?");
                                                                    if (reason === null) return;
                                                                    const token = localStorage.getItem('token');
                                                                    try {
                                                                        await axios.put(`/api/admin/plans/${prop._id}/reject`, { reason }, {
                                                                            headers: { Authorization: `Bearer ${token}` }
                                                                        });
                                                                        toast.success("Plan Rejected");
                                                                        fetchPlans();
                                                                    } catch (err) {
                                                                        toast.error("Rejection failed");
                                                                    }
                                                                }}
                                                                className="size-7 rounded-lg bg-white border border-gray-200 text-rose-500 flex items-center justify-center hover:bg-rose-50 transition-all" title="Reject"
                                                            >
                                                                <span className="material-symbols-outlined text-[14px]">close</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center opacity-60">
                                                    <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                                        <span className="material-symbols-outlined text-3xl text-gray-300">inbox</span>
                                                    </div>
                                                    <p className="text-xs font-bold text-[#2D241E]">All Proposals Reviewed</p>
                                                    <p className="text-[10px] font-bold text-[#897a70] mt-0.5">Kitchens are operating within standard pricing.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }

            {/* Linked Kitchens Modal - [POLISHED] */}
            {
                viewKitchens && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#2D241E]/80 backdrop-blur-md animate-[fadeIn_0.3s]" onClick={() => setViewKitchens(null)}></div>
                        <div className="bg-[#F5F2EB] rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative z-10 animate-[scaleIn_0.3s] border-[12px] border-white ring-1 ring-black/5">
                            <div className="p-8 pb-4 flex justify-between items-start shrink-0">
                                <div>
                                    <h3 className="text-2xl font-bold text-[#2D241E] flex items-center gap-2">
                                        Linked Kitchens
                                        <span className="px-2 py-0.5 bg-[#2D241E] text-white text-[11px] font-bold rounded-lg uppercase tracking-wider">
                                            {viewKitchens.name}
                                        </span>
                                    </h3>
                                    <p className="text-[11px] font-bold text-[#897a70] mt-1">Providers currently offering this standard plan</p>
                                </div>
                                <button onClick={() => setViewKitchens(null)} className="size-9 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            </div>

                            <div className="p-8 pt-0 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="pb-4 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Kitchen Name</th>
                                            <th className="pb-4 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Selling Price</th>
                                            <th className="pb-4 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Rating</th>
                                            <th className="pb-4 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Status</th>
                                            <th className="pb-4 text-[11px] font-bold text-[#897a70] uppercase tracking-wider text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {(linkedKitchensMock[viewKitchens?._id] || []).map((k, i) => (
                                            <tr key={i} className="hover:bg-gray-50/50">
                                                <td className="py-4 font-bold text-[#2D241E] text-xs">{k.name}</td>
                                                <td className="py-4 font-bold text-[#5C4D42] text-xs">₹{k.price}</td>
                                                <td className="py-4">
                                                    <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                                                        <span className="material-symbols-outlined text-[14px] fill-current">star</span>
                                                        {k.rating}
                                                    </span>
                                                </td>
                                                <td className="py-4">
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${k.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                        {k.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-right">
                                                    <button className="text-xs font-bold text-rose-500 hover:text-rose-700 uppercase tracking-wider bg-rose-50 px-2 py-1 rounded-lg">Unlink</button>
                                                </td>
                                            </tr>
                                        ))}
                                        {!(linkedKitchensMock[viewKitchens?._id]) && (
                                            <tr>
                                                <td colSpan="5" className="py-8 text-center text-xs font-bold text-gray-400">No kitchens currently linked to this plan.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }

            {/* Create/Edit Modal (Standard Platform Plan) - [POLISHED] */}
            {
                showModal && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                        <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh]">

                            {/* Compact Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 bg-orange-100 rounded-xl flex items-center justify-center">
                                        <span className="material-symbols-outlined text-orange-500 text-[18px]">verified</span>
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-gray-800">{editingPlan ? 'Edit Standard Plan' : 'Define New Standard'}</h3>
                                        <p className="text-xs text-gray-400">Platform Franchise Catalog</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowModal(false)} className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all">
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            </div>

                            <form ref={formRef} onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4">
                                {/* Card Preview (Mini) */}
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <span className={`size-10 rounded-lg bg-gradient-to-br ${editingPlan?.color || 'from-emerald-400 to-emerald-600'}`}></span>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Visual Preview</p>
                                        <p className="text-[11px] text-gray-600">This theme will be used for the card header.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Plan Name</label>
                                        <input name="name" defaultValue={editingPlan?.name} placeholder="e.g. Gold Thali" className="w-full bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-xs focus:bg-white focus:border-orange-500 outline-none transition-all" required />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Diet Type</label>
                                        <div className="relative">
                                            <select name="type" defaultValue={editingPlan?.type || 'Veg'} className="w-full bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-xs focus:bg-white focus:border-orange-500 outline-none appearance-none cursor-pointer">
                                                <option value="Veg">Pure Veg</option>
                                                <option value="Non-Veg">Non-Veg</option>
                                                <option value="Diet">Diet/Keto</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[16px]">expand_more</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Price (₹)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                                            <input name="price" type="number" defaultValue={editingPlan?.price} placeholder="3000" className="w-full bg-gray-50 border border-gray-100 pl-8 pr-4 py-2.5 rounded-xl text-xs focus:bg-white focus:border-orange-500 outline-none transition-all" required />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Billing Cycle</label>
                                        <div className="relative">
                                            <select name="period" defaultValue={editingPlan?.period || 'Monthly'} className="w-full bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-xs focus:bg-white focus:border-orange-500 outline-none appearance-none cursor-pointer">
                                                <option value="Monthly">Monthly</option>
                                                <option value="Weekly">Weekly</option>
                                                <option value="Trial">Trial (3 Days)</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[16px]">event_repeat</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Inclusions</label>
                                    <textarea name="desc" defaultValue={editingPlan?.description} placeholder="e.g. 4 Roti, Rice, Dal..." className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl text-xs focus:bg-white focus:border-orange-500 outline-none h-20 resize-none transition-all" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Theme Color</label>
                                    <select name="color" defaultValue={editingPlan?.color || 'from-emerald-400 to-emerald-600'} className="w-full bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-xs focus:bg-white focus:border-orange-500 outline-none appearance-none cursor-pointer">
                                        <option value="from-emerald-400 to-emerald-600">Emerald Green (Veg)</option>
                                        <option value="from-gray-800 to-black">Obsidian (Premium)</option>
                                        <option value="from-rose-500 to-rose-700">Rose Red (Non-Veg)</option>
                                        <option value="from-violet-500 to-violet-700">Violet (Diet)</option>
                                        <option value="from-amber-400 to-amber-600">Amber (Budget)</option>
                                        <option value="from-blue-500 to-blue-700">Blue (Special)</option>
                                    </select>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button onClick={() => setShowModal(false)} className="flex-1 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600">Cancel</button>
                                    <button type="submit" className="flex-[2] py-3 bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-all">
                                        {editingPlan ? 'Save Plan' : 'Publish Plan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>,
                    document.body
                )
            }
        </div >
    );
};

export default AdminPlans;
