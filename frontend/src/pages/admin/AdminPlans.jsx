import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';

const AdminPlans = () => {
    const formRef = useRef(null);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/admin/plans', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setPlans(res.data.data || []);
            }
        } catch (err) {
            console.error('Fetch Plans Error:', err);
            toast.error(err.response?.data?.message || 'Failed to load plans');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchPlans();
    }, []);

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
                const res = await axios.put(
                    `/api/admin/plans/${editingPlan._id || editingPlan.id}`,
                    planData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.data.success) {
                    await fetchPlans();
                    toast.success("Plan updated successfully!");
                }
            } else {
                const res = await axios.post(
                    `/api/admin/plans`,
                    planData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.data.success) {
                    await fetchPlans();
                    toast.success("New plan created!", { icon: '🚀' });
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

    const handleDelete = async (planId) => {
        if (!window.confirm('Delete this plan?')) return;
        
        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(
                `/api/admin/plans/${planId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                await fetchPlans();
                toast.success('Plan deleted');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete');
        }
    };

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto min-h-screen pb-10 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-[#2D241E] tracking-tight uppercase">Manage Plans</h1>
                        <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-lg shadow-orange-500/10">Active Catalog</span>
                    </div>
                    <p className="text-[#897a70] text-xs font-bold uppercase tracking-wider opacity-60">Subscription Plans Management</p>
                </div>

                <button
                    onClick={() => { setEditingPlan(null); setShowModal(true); }}
                    className="px-5 py-2.5 bg-[#2D241E] text-white rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-[#453831] flex items-center gap-2 shadow-xl shadow-black/10 scale-105 active:scale-95"
                >
                    <span className="material-symbols-outlined text-[18px]">add_circle</span>
                    Create Plan
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12">
                        <p className="text-sm text-gray-500">Loading plans...</p>
                    </div>
                ) : plans.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <p className="text-sm text-gray-500">No plans found. Create your first plan!</p>
                    </div>
                ) : (
                    plans.map(plan => (
                        <div key={plan._id || plan.id} className="group relative flex flex-col h-full bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-300">
                            <div className={`h-32 bg-gradient-to-br ${plan.color || 'from-emerald-400 to-emerald-600'} relative p-5 flex flex-col justify-between shrink-0 rounded-t-[2rem] overflow-hidden`}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="relative z-10 text-white">
                                    <h3 className="text-lg font-bold tracking-tight leading-none drop-shadow-md">{plan.name}</h3>
                                    <p className="text-[10px] font-medium opacity-90 mt-1">{plan.type || 'Veg'}</p>
                                </div>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex items-end gap-1 mb-4">
                                    <span className="text-2xl font-bold text-[#2D241E] tracking-tighter">₹{plan.price || 0}</span>
                                    <span className="text-[10px] font-bold text-[#897a70] mb-1.5">/{plan.period === 'Monthly' ? 'mo' : 'wk'}</span>
                                </div>

                                <div className="space-y-4 mb-6 flex-1">
                                    <div className="p-3 bg-[#F9F6F3] rounded-xl border border-[#2D241E]/5">
                                        <p className="text-[10px] font-medium text-[#5C4D42] leading-relaxed line-clamp-3">
                                            {plan.description || 'No description'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-auto">
                                    <button
                                        onClick={() => { setEditingPlan(plan); setShowModal(true); }}
                                        className="flex-1 py-2.5 bg-[#2D241E] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#453831] transition-all shadow-lg active:scale-95"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(plan._id || plan.id)}
                                        className="px-4 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-rose-100 transition-all"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                <button
                    onClick={() => { setEditingPlan(null); setShowModal(true); }}
                    className="group relative flex flex-col h-full min-h-[300px] rounded-[2rem] border-2 border-dashed border-[#2D241E]/10 hover:border-orange-400 hover:bg-orange-50/10 transition-all duration-300 items-center justify-center gap-3 p-8"
                >
                    <div className="size-14 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-gray-100">
                        <span className="material-symbols-outlined text-2xl text-orange-500">add</span>
                    </div>
                    <div className="text-center">
                        <h3 className="text-sm font-bold text-[#2D241E]">Create New Plan</h3>
                        <p className="text-[10px] font-medium text-[#897a70]">Add subscription plan</p>
                    </div>
                </button>
            </div>

            {showModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh]">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-9 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-orange-500 text-[18px]">verified</span>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-800">{editingPlan ? 'Edit Plan' : 'Create Plan'}</h3>
                                    <p className="text-xs text-gray-400">Subscription plan details</p>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all">
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        </div>

                        <form ref={formRef} onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Plan Name</label>
                                    <input name="name" defaultValue={editingPlan?.name} placeholder="e.g. Gold Thali" className="w-full bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-xs focus:bg-white focus:border-orange-500 outline-none transition-all" required />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Type</label>
                                    <select name="type" defaultValue={editingPlan?.type || 'Veg'} className="w-full bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-xs focus:bg-white focus:border-orange-500 outline-none">
                                        <option value="Veg">Veg</option>
                                        <option value="Non-Veg">Non-Veg</option>
                                        <option value="Diet">Diet</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Price (₹)</label>
                                    <input name="price" type="number" defaultValue={editingPlan?.price} placeholder="3000" className="w-full bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-xs focus:bg-white focus:border-orange-500 outline-none transition-all" required />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Period</label>
                                    <select name="period" defaultValue={editingPlan?.period || 'Monthly'} className="w-full bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-xs focus:bg-white focus:border-orange-500 outline-none">
                                        <option value="Monthly">Monthly</option>
                                        <option value="Weekly">Weekly</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Description</label>
                                <textarea name="desc" defaultValue={editingPlan?.description} placeholder="e.g. 4 Roti, Rice, Dal..." className="w-full bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl text-xs focus:bg-white focus:border-orange-500 outline-none h-20 resize-none transition-all" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Color</label>
                                <select name="color" defaultValue={editingPlan?.color || 'from-emerald-400 to-emerald-600'} className="w-full bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-xs focus:bg-white focus:border-orange-500 outline-none">
                                    <option value="from-emerald-400 to-emerald-600">Green</option>
                                    <option value="from-gray-800 to-black">Black</option>
                                    <option value="from-rose-500 to-rose-700">Red</option>
                                    <option value="from-violet-500 to-violet-700">Violet</option>
                                    <option value="from-amber-400 to-amber-600">Amber</option>
                                    <option value="from-blue-500 to-blue-700">Blue</option>
                                </select>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600">Cancel</button>
                                <button type="submit" className="flex-[2] py-3 bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-all">
                                    {editingPlan ? 'Save' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AdminPlans;
