import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const ManagePlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const formRef = useRef(null);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/provider-plans', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setPlans(res.data.data);
            }
        } catch (err) {
            toast.error("Failed to load plans");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        const form = formRef.current;
        const token = localStorage.getItem('token');

        const planData = {
            name: form.elements['name'].value,
            price: Number(form.elements['price'].value),
            period: form.elements['period'].value,
            type: form.elements['type'].value,
            description: form.elements['desc'].value,
            color: form.elements['color'].value,
            badge: editingPlan?.badge || 'New'
        };

        try {
            if (editingPlan) {
                await axios.put(`/api/provider-plans/${editingPlan._id}`, planData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Plan updated successfully");
            } else {
                await axios.post('/api/provider-plans', planData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("New plan created!");
            }
            setShowModal(false);
            fetchPlans();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save plan");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this plan?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/provider-plans/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Plan deleted");
            fetchPlans();
        } catch (err) {
            toast.error("Failed to delete plan");
        }
    };

    if (loading) return <div className="p-10 text-center uppercase font-black text-[#2D241E]">Loading Plans...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-[#2D241E] uppercase tracking-tight">Your Subscription Plans</h1>
                    <p className="text-sm text-[#897a70] font-bold uppercase tracking-wider">Manage what customers can subscribe to</p>
                </div>
                <button
                    onClick={() => { setEditingPlan(null); setShowModal(true); }}
                    className="px-6 py-3 bg-[#2D241E] text-white rounded-2xl flex items-center gap-2 font-black uppercase text-xs tracking-widest hover:bg-[#453831] transition-all"
                >
                    <FaPlus /> Create New Plan
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map(plan => (
                    <div key={plan._id} className="bg-white rounded-[2.5rem] border border-[#2D241E]/5 overflow-hidden shadow-xl shadow-[#2D241E]/5 flex flex-col">
                        <div className={`h-24 bg-gradient-to-br ${plan.color} p-6 relative`}>
                            <h3 className="text-white font-black uppercase tracking-tight text-xl drop-shadow-md">{plan.name}</h3>
                            <span className={`absolute top-4 right-4 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm ${plan.verificationStatus === 'Approved' ? 'bg-emerald-500 text-white' :
                                    plan.verificationStatus === 'Rejected' ? 'bg-rose-500 text-white' :
                                        'bg-white text-[#2D241E]'
                                }`}>
                                {plan.verificationStatus}
                            </span>
                        </div>
                        <div className="p-6 space-y-4 flex-1">
                            <div className="flex justify-between items-end">
                                <span className="text-2xl font-black text-[#2D241E]">₹{plan.price}</span>
                                <span className="text-[10px] font-black uppercase text-[#897a70] mb-1">/ {plan.period}</span>
                            </div>
                            <p className="text-xs font-bold text-[#5C4D42] line-clamp-3 bg-[#F9F6F3] p-3 rounded-xl">
                                {plan.description}
                            </p>
                            <div className="flex gap-2 pt-4">
                                <button
                                    onClick={() => { setEditingPlan(plan); setShowModal(true); }}
                                    className="flex-1 py-3 bg-[#F9F6F3] text-[#2D241E] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#2D241E]/5"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(plan._id)}
                                    className="px-4 py-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100"
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-6">
                    <div className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden relative animate-in fade-in zoom-in-95 duration-300 shadow-2xl">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-black text-[#2D241E] uppercase">{editingPlan ? 'Edit Plan' : 'New Plan'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><FaTimes size={24} /></button>
                        </div>
                        <form ref={formRef} onSubmit={handleSave} className="p-8 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-[#897a70] ml-1">Plan Name</label>
                                    <input name="name" defaultValue={editingPlan?.name} className="w-full bg-[#F9F6F3] border-none px-4 py-3 rounded-xl text-xs font-bold outline-none ring-2 ring-transparent focus:ring-[#2D241E]/10" required />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-[#897a70] ml-1">Meal Type</label>
                                    <select name="type" defaultValue={editingPlan?.type || 'Veg'} className="w-full bg-[#F9F6F3] px-4 py-3 rounded-xl text-xs font-bold outline-none">
                                        <option value="Veg">Veg</option>
                                        <option value="Non-Veg">Non-Veg</option>
                                        <option value="Diet">Diet</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-[#897a70] ml-1">Price (₹)</label>
                                    <input name="price" type="number" defaultValue={editingPlan?.price} className="w-full bg-[#F9F6F3] px-4 py-3 rounded-xl text-xs font-bold outline-none" required />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-[#897a70] ml-1">Cycle</label>
                                    <select name="period" defaultValue={editingPlan?.period || 'Monthly'} className="w-full bg-[#F9F6F3] px-4 py-3 rounded-xl text-xs font-bold outline-none">
                                        <option value="Monthly">Monthly</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Trial">Trial</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-[#897a70] ml-1">Description</label>
                                <textarea name="desc" defaultValue={editingPlan?.description} className="w-full bg-[#F9F6F3] px-4 py-3 rounded-xl text-xs font-bold outline-none h-24 resize-none" required />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-[#897a70] ml-1">Theme</label>
                                <select name="color" defaultValue={editingPlan?.color || 'from-emerald-400 to-emerald-600'} className="w-full bg-[#F9F6F3] px-4 py-3 rounded-xl text-xs font-bold outline-none">
                                    <option value="from-emerald-400 to-emerald-600">Emerald</option>
                                    <option value="from-rose-500 to-rose-700">Rose</option>
                                    <option value="from-amber-400 to-amber-600">Amber</option>
                                    <option value="from-blue-500 to-blue-700">Blue</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full py-4 bg-[#2D241E] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all pt-4">
                                {editingPlan ? 'Update Plan' : 'Create Plan'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePlans;
