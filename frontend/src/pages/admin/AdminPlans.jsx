import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';

const AdminPlans = () => {
    const formRef = useRef(null);
    // Mock Data - Enhanced with more visual details
    const [plans, setPlans] = useState([
        { id: 'PLN001', name: 'Student Budget', price: '2500', period: 'Monthly', type: 'Veg', color: 'from-emerald-400 to-emerald-600', shadow: 'shadow-emerald-500/20', description: 'Roti (4), Sabzi, Dal, Rice, Salad', subscribers: 124, revenue: '₹3.1L', badge: 'Popular' },
        { id: 'PLN002', name: 'Premium Thali', price: '3500', period: 'Monthly', type: 'Veg', color: 'from-[#2D241E] to-[#453831]', shadow: 'shadow-stone-500/20', description: 'Roti (4), 2 Sabzi, Dal Fry, Jeera Rice, Sweet, Curd', subscribers: 85, revenue: '₹2.9L', badge: 'Best Value' },
        { id: 'PLN003', name: 'Chicken Delight', price: '4500', period: 'Monthly', type: 'Non-Veg', color: 'from-rose-500 to-rose-700', shadow: 'shadow-rose-500/20', description: 'Roti (4), Chicken Curry, Dal, Rice, Salad, Sweet (Wed/Sun)', subscribers: 45, revenue: '₹2.0L', badge: 'Premium' },
        { id: 'PLN004', name: 'Weight Loss Keto', price: '6000', period: 'Monthly', type: 'Diet', color: 'from-violet-500 to-violet-700', shadow: 'shadow-violet-500/20', description: 'Keto Roti (2), Green Veg, Grilled Paneer/Chicken, Salad', subscribers: 20, revenue: '₹1.2L', badge: 'Niche' },
        { id: 'PLN005', name: 'Mini Lunch', price: '800', period: 'Weekly', type: 'Veg', color: 'from-amber-400 to-amber-600', shadow: 'shadow-amber-500/20', description: 'Roti (3), 1 Sabzi, Dal', subscribers: 15, revenue: '₹12K', badge: 'Trial' },
    ]);

    const [activeView, setActiveView] = useState('Platform'); // Platform, Proposed
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);

    // Mock Proposed Plans (Approval Queue)
    const [proposedPlans, setProposedPlans] = useState([
        { id: 'PROP001', kitchen: 'Spice Route', name: 'Student Deluxe', price: '2800', type: 'Veg', date: 'Today' },
        { id: 'PROP002', kitchen: 'Urban Mess', name: 'Office Executive', price: '3800', type: 'Non-Veg', date: 'Yesterday' },
    ]);

    const handleSave = (e) => {
        e.preventDefault();
        const form = formRef.current;
        if (!form) return;

        const name = form.elements['name']?.value;
        if (!name) return toast.error("Plan name is required");

        const newPlan = {
            id: editingPlan ? editingPlan.id : `PLN00${plans.length + 1}`,
            name: name,
            price: form.elements['price']?.value || '0',
            period: form.elements['period']?.value || 'Monthly',
            type: form.elements['type']?.value || 'Veg',
            description: form.elements['desc']?.value || '',
            color: form.elements['color']?.value || 'from-gray-500 to-gray-700',
            subscribers: editingPlan ? editingPlan.subscribers : 0,
            revenue: editingPlan ? editingPlan.revenue : '₹0',
            badge: editingPlan ? editingPlan.badge : 'New'
        };

        if (editingPlan) {
            setPlans(prev => prev.map(p => p.id === editingPlan.id ? newPlan : p));
            toast.success("Plan updated successfully!");
        } else {
            setPlans(prev => [newPlan, ...prev]);
            toast.success("New plan created!", { icon: '✨' });
        }
        setShowModal(false);
        setEditingPlan(null);
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this plan? This will affect current subscribers.")) {
            setPlans(prev => prev.filter(p => p.id !== id));
            toast.success("Plan deleted.");
        }
    };

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto min-h-full pb-10 animate-[fadeIn_0.5s]">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#2D241E]/5">
                <div>
                    <h2 className="text-3xl font-black text-[#2D241E] tracking-tighter flex items-center gap-3">
                        Subscription Plans
                        <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-orange-500/20">{activeView}</span>
                    </h2>
                    <p className="text-[#5C4D42] text-sm font-medium opacity-70 mt-2 max-w-xl leading-relaxed">
                        {activeView === 'Platform'
                            ? "Manage standard plans that kitchens can opt-in to fulfill."
                            : "Review and approve custom plan structures proposed by individual kitchens."}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white/60 p-1 rounded-2xl border border-white/50 backdrop-blur-md shadow-sm mr-4">
                        <button
                            onClick={() => setActiveView('Platform')}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'Platform' ? 'bg-[#2D241E] text-white shadow-md' : 'text-[#897a70] hover:bg-white'}`}
                        >
                            Platform
                        </button>
                        <button
                            onClick={() => setActiveView('Proposed')}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${activeView === 'Proposed' ? 'bg-[#2D241E] text-white shadow-md' : 'text-[#897a70] hover:bg-white'}`}
                        >
                            Proposed
                            <span className="absolute -top-1 -right-1 size-4 bg-orange-500 text-white text-[8px] flex items-center justify-center rounded-full border border-white">2</span>
                        </button>
                    </div>
                    {activeView === 'Platform' && (
                        <button
                            onClick={() => { setEditingPlan(null); setShowModal(true); }}
                            className="flex items-center gap-2 px-6 py-3 bg-[#2D241E] text-white rounded-2xl text-[11px] font-black hover:bg-[#453831] hover:scale-105 active:scale-95 shadow-xl shadow-[#2D241E]/20 transition-all group"
                        >
                            <span className="material-symbols-outlined text-[18px] group-hover:rotate-90 transition-transform">add_circle</span>
                            Standard Plan
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Active Plans', val: plans.length, sub: 'Currently Live', icon: 'approval_delegation', bg: 'bg-violet-50', text: 'text-violet-600' },
                    { label: 'Total Subscribers', val: plans.reduce((acc, p) => acc + p.subscribers, 0), sub: '+12% this week', icon: 'groups', bg: 'bg-emerald-50', text: 'text-emerald-600' },
                    { label: 'Projected MRR', val: '₹7.3L', sub: 'Monthly Recurring', icon: 'payments', bg: 'bg-amber-50', text: 'text-amber-600' },
                ].map((stat, i) => (
                    <div key={i} className="group bg-white/60 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/60 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`size-12 ${stat.bg} ${stat.text} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                                <span className="material-symbols-outlined text-[24px]">{stat.icon}</span>
                            </div>
                            <span className="py-1 px-3 bg-white rounded-xl text-[10px] font-bold text-[#897a70] shadow-sm border border-gray-50">{stat.sub}</span>
                        </div>
                        <div>
                            <h3 className="text-4xl font-black text-[#2D241E] tracking-tighter">{stat.val}</h3>
                            <p className="text-[11px] font-bold text-[#897a70] uppercase tracking-widest mt-1">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Conditional Sub-View */}
            {activeView === 'Platform' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {plans.map(plan => (
                        <div key={plan.id} className="group relative flex flex-col h-full">

                            {/* Dynamic Shadow */}
                            <div className={`absolute -inset-0.5 bg-gradient-to-b ${plan.color} rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-500`}></div>

                            <div className="relative flex flex-col h-full bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1">

                                {/* Card Header (Visual) */}
                                <div className={`h-40 bg-gradient-to-br ${plan.color} relative p-6 flex flex-col justify-between shrink-0 overflow-hidden`}>
                                    {/* Abstract Shapes */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                                    <div className="relative z-10 flex justify-between items-start">
                                        <span className="px-2.5 py-1 bg-black/20 backdrop-blur-md rounded-lg text-[9px] font-black text-white/90 uppercase tracking-wider border border-white/10">{plan.badge}</span>
                                        <div className="size-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white text-[16px]">restaurant</span>
                                        </div>
                                    </div>
                                    <div className="relative z-10 text-white">
                                        <h3 className="text-xl font-black tracking-tight leading-none drop-shadow-md">{plan.name}</h3>
                                        <p className="text-[10px] font-medium opacity-90 mt-1 flex items-center gap-1">
                                            <span className="size-1.5 bg-white rounded-full"></span>
                                            {plan.type} Series
                                        </p>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-end gap-1 mb-6">
                                        <span className="text-3xl font-black text-[#2D241E] tracking-tighter">₹{plan.price}</span>
                                        <span className="text-xs font-bold text-[#897a70] mb-1.5">/{plan.period === 'Monthly' ? 'mo' : 'wk'}</span>
                                    </div>

                                    <div className="space-y-4 mb-8 flex-1">
                                        <div className="p-4 bg-[#F9F6F3] rounded-2xl border border-[#2D241E]/5">
                                            <p className="text-[11px] font-medium text-[#5C4D42] leading-relaxed">
                                                {plan.description}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-center">
                                                <span className="block text-[16px] font-black text-[#2D241E]">{plan.subscribers}</span>
                                                <span className="text-[9px] font-bold text-[#897a70] uppercase">Users</span>
                                            </div>
                                            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-center">
                                                <span className="block text-[16px] font-black text-[#2D241E]">{plan.revenue.split('₹')[1]}</span>
                                                <span className="text-[9px] font-bold text-[#897a70] uppercase">Rev</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100">
                                        <button
                                            onClick={() => { setEditingPlan(plan); setShowModal(true); }}
                                            className="flex-1 py-3 bg-[#2D241E] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#453831] transition-all shadow-lg active:scale-95"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(plan.id)}
                                            className="size-10 flex items-center justify-center bg-white text-rose-500 rounded-xl hover:bg-rose-50 transition-all border border-gray-200"
                                            title="Archive Plan"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">archive</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={() => { setEditingPlan(null); setShowModal(true); }}
                        className="group relative flex flex-col h-full min-h-[400px] rounded-[2.5rem] border-2 border-dashed border-[#2D241E]/20 hover:border-orange-400 hover:bg-orange-50/10 transition-all duration-300 items-center justify-center gap-4 p-8"
                    >
                        <div className="size-16 bg-white rounded-full shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <span className="material-symbols-outlined text-3xl text-orange-500">add</span>
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-black text-[#2D241E]">Create New</h3>
                            <p className="text-xs font-medium text-[#897a70]">Design a standard plan</p>
                        </div>
                    </button>
                </div>
            ) : (
                <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-lg overflow-hidden">
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-xl font-black text-[#2D241E]">Approval Queue</h3>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all">Batch Approve</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="px-8 py-5 text-[10px] font-black text-[#897a70] uppercase tracking-widest">Kitchen Proponent</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-[#897a70] uppercase tracking-widest">Plan Structure</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-[#897a70] uppercase tracking-widest">Price Point</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-[#897a70] uppercase tracking-widest">Type</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-[#897a70] uppercase tracking-widest text-right">Review</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {proposedPlans.map(prop => (
                                    <tr key={prop.id} className="group hover:bg-white/50 transition-all">
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-black text-[#2D241E]">{prop.kitchen}</p>
                                            <p className="text-[9px] font-bold text-[#897a70] mt-0.5">Submitted {prop.date}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-bold text-[#5C4D42]">{prop.name}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-black text-[#2D241E]">₹{prop.price}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${prop.type === 'Veg' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{prop.type}</span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => toast.success("Plan Approved!")} className="size-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10">
                                                    <span className="material-symbols-outlined text-[16px]">check</span>
                                                </button>
                                                <button className="size-8 rounded-lg bg-white border border-gray-200 text-rose-500 flex items-center justify-center hover:bg-rose-50 transition-all">
                                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                                </button>
                                                <button className="px-3 py-1.5 bg-[#2D241E] text-white text-[10px] font-black rounded-lg uppercase tracking-tight hover:bg-[#453831] transition-all">Edit & Accept</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal - Refined */}
            {showModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2D241E]/80 backdrop-blur-md animate-[fadeIn_0.3s]" onClick={() => setShowModal(false)}></div>
                    <div className="bg-[#F5F2EB] rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-[scaleIn_0.3s] relative z-10 border border-white/20">
                        {/* Texture */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2D241E 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                        <div className="relative p-6 px-8 bg-white/80 backdrop-blur-xl border-b border-[#2D241E]/5 flex justify-between items-center z-10">
                            <div>
                                <h3 className="text-xl font-black text-[#2D241E] tracking-tight">{editingPlan ? 'Edit Configuration' : 'Design New Plan'}</h3>
                                <p className="text-[10px] font-bold text-[#897a70] uppercase tracking-widest mt-1">Plan Specification</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="size-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                <span className="material-symbols-outlined text-[18px] text-[#5C4D42]">close</span>
                            </button>
                        </div>

                        <form ref={formRef} onSubmit={handleSave} className="relative p-8 space-y-6 z-10">
                            {/* Card Preview (Mini) */}
                            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                <span className={`size-12 rounded-xl bg-gradient-to-br ${editingPlan?.color || 'from-emerald-400 to-emerald-600'}`}></span>
                                <div>
                                    <p className="text-[10px] font-bold text-[#897a70] uppercase tracking-widest">Visual Preview</p>
                                    <p className="text-xs font-black text-[#2D241E]">Theme will appear on the card header.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#897a70] uppercase ml-1 tracking-widest">Plan Name</label>
                                    <input name="name" defaultValue={editingPlan?.name} placeholder="e.g. Gold Thali" className="w-full bg-white border border-gray-200 px-4 py-3.5 rounded-2xl text-xs font-bold text-[#2D241E] focus:border-orange-400 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all shadow-sm" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#897a70] uppercase ml-1 tracking-widest">Diet Type</label>
                                    <div className="relative">
                                        <select name="type" defaultValue={editingPlan?.type || 'Veg'} className="w-full bg-white border border-gray-200 px-4 py-3.5 rounded-2xl text-xs font-bold text-[#2D241E] focus:border-orange-400 focus:ring-4 focus:ring-orange-500/5 outline-none appearance-none shadow-sm cursor-pointer">
                                            <option value="Veg">Pure Veg</option>
                                            <option value="Non-Veg">Non-Veg</option>
                                            <option value="Diet">Diet/Keto</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#897a70] uppercase ml-1 tracking-widest">Price (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D241E] font-black">₹</span>
                                        <input name="price" type="number" defaultValue={editingPlan?.price} placeholder="3000" className="w-full bg-white border border-gray-200 pl-8 pr-4 py-3.5 rounded-2xl text-xs font-bold text-[#2D241E] focus:border-orange-400 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all shadow-sm" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#897a70] uppercase ml-1 tracking-widest">Billing Cycle</label>
                                    <div className="relative">
                                        <select name="period" defaultValue={editingPlan?.period || 'Monthly'} className="w-full bg-white border border-gray-200 px-4 py-3.5 rounded-2xl text-xs font-bold text-[#2D241E] focus:border-orange-400 focus:ring-4 focus:ring-orange-500/5 outline-none appearance-none shadow-sm cursor-pointer">
                                            <option value="Monthly">Monthly</option>
                                            <option value="Weekly">Weekly</option>
                                            <option value="Trial">Trial (3 Days)</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">event_repeat</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#897a70] uppercase ml-1 tracking-widest">Inclusions</label>
                                <textarea name="desc" defaultValue={editingPlan?.description} placeholder="e.g. 4 Roti, Rice, Dal..." className="w-full bg-white border border-gray-200 px-4 py-3.5 rounded-2xl text-xs font-bold text-[#2D241E] focus:border-orange-400 focus:ring-4 focus:ring-orange-500/5 outline-none h-24 resize-none shadow-sm" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#897a70] uppercase ml-1 tracking-widest">Theme Gradient</label>
                                <select name="color" defaultValue={editingPlan?.color || 'from-emerald-400 to-emerald-600'} className="w-full bg-white border border-gray-200 px-4 py-3.5 rounded-2xl text-xs font-bold text-[#2D241E] focus:border-orange-400 focus:ring-4 focus:ring-orange-500/5 outline-none appearance-none shadow-sm cursor-pointer">
                                    <option value="from-emerald-400 to-emerald-600">Emerald Green (Veg)</option>
                                    <option value="from-[#2D241E] to-[#453831]">Obsidian (Premium)</option>
                                    <option value="from-rose-500 to-rose-700">Rose Red (Non-Veg)</option>
                                    <option value="from-violet-500 to-violet-700">Violet (Diet)</option>
                                    <option value="from-amber-400 to-amber-600">Amber (Budget)</option>
                                    <option value="from-blue-500 to-blue-700">Blue (Special)</option>
                                </select>
                            </div>

                            <button type="submit" className="w-full py-4 bg-[#2D241E] text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest hover:bg-[#453831] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#2D241E]/20 mt-4">
                                {editingPlan ? 'Save Changes' : 'Launch Plan'}
                            </button>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AdminPlans;
