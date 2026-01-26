import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';

const plansData = [
    { id: 'PLN001', name: 'Monthly Veg Special', price: '₹2,499', period: '30 Days', meals: 'Lunch & Dinner', subscribers: 840, status: 'Active', features: ['Home Delivery', 'Daily Variety', 'Packaging Included'] },
    { id: 'PLN002', name: 'Weekly Non-Veg Mix', price: '₹899', period: '7 Days', meals: 'Dinner Only', subscribers: 320, status: 'Active', features: ['3 Days Non-Veg', '4 Days Veg', 'Premium Dessert'] },
    { id: 'PLN003', name: 'Standard Trial', price: '₹99', period: '1 Day', meals: 'Single Meal', subscribers: 145, status: 'Active', features: ['Taster Experience', 'Single Box', 'Quick Delivery'] },
    { id: 'PLN004', name: 'Corporate Bulk', price: 'Custom', period: '30 Days', meals: 'Lunch Only', subscribers: 12, status: 'Draft', features: ['Office Delivery', 'Bulk Discount', 'Dedicated Support'] },
];

const AdminPlans = () => {
    const [activeTab, setActiveTab] = useState('Active');
    const [showDesigner, setShowDesigner] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const openDesigner = (plan = null) => {
        setSelectedPlan(plan);
        setShowDesigner(true);
    };

    const handleSavePlan = () => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1500)),
            {
                loading: 'Publishing plan configuration...',
                success: 'Package updated successfully!',
                error: 'Failed to save.',
            }
        );
        setShowDesigner(false);
    };

    const handleAction = (type, name) => {
        toast.success(`${type} action triggered for ${name}`, {
            style: { borderRadius: '10px', background: '#2D241E', color: '#fff', fontSize: '10px' }
        });
    };

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto min-h-full pb-8 animate-[fadeIn_0.5s]">

            {/* 1. Header with Creative Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black text-[#2D241E] tracking-tight flex items-center gap-2">
                        Meal Subscription Plans
                        <span className="px-2 py-0.5 bg-orange-500 text-white text-[9px] font-black rounded-lg uppercase tracking-wider shadow-lg shadow-orange-500/20">Packages</span>
                    </h2>
                    <p className="text-[#5C4D42] text-xs font-medium opacity-80 mt-0.5 font-display italic">Configure pricing strategy and subscription features.</p>
                </div>

                <button
                    onClick={() => openDesigner()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#2D241E] text-white rounded-2xl text-[11px] font-bold hover:bg-[#453831] shadow-xl shadow-[#2D241E]/10 transition-all group"
                >
                    <span className="material-symbols-outlined text-[18px] group-hover:rotate-90 transition-transform">add_circle</span>
                    Design New Plan
                </button>
            </div>

            {/* 2. Strategy Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/70 backdrop-blur-xl p-5 rounded-[2rem] border border-white/60 shadow-sm relative overflow-hidden group">
                    <div className="absolute right-0 top-0 size-24 bg-orange-100 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <p className="text-[9px] font-black text-[#5C4D42]/60 uppercase tracking-widest mb-1">Most Popular</p>
                    <h3 className="text-xl font-black text-[#2D241E]">Monthly Veg</h3>
                    <p className="text-[10px] text-emerald-600 font-bold mt-1 tracking-tight">840 Active Subscriptions</p>
                </div>
                <div className="bg-white/70 backdrop-blur-xl p-5 rounded-[2rem] border border-white/60 shadow-sm">
                    <p className="text-[9px] font-black text-[#5C4D42]/60 uppercase tracking-widest mb-1">Average Ticket</p>
                    <h3 className="text-xl font-black text-[#2D241E]">₹1,180</h3>
                    <p className="text-[10px] text-blue-600 font-bold mt-1 tracking-tight">Revenue per User</p>
                </div>
                <div className="bg-[#2D241E] p-5 rounded-[2rem] text-white relative overflow-hidden group">
                    <div className="absolute left-0 bottom-0 size-24 bg-white/5 rounded-full blur-2xl"></div>
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Renewal Goal</p>
                    <h3 className="text-xl font-black italic">85% Retention</h3>
                    <p className="text-[10px] text-orange-400 font-bold mt-1 tracking-tight">+5% vs Last Month</p>
                </div>
            </div>

            {/* 3. Plan Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {plansData.map((plan) => (
                    <div key={plan.id} className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/60 shadow-lg relative group transition-all hover:shadow-2xl hover:-translate-y-1">
                        {/* Status Badge */}
                        <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${plan.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                            }`}>
                            {plan.status}
                        </div>

                        <div className="flex items-start gap-4 mb-6">
                            <div className="size-14 bg-[#F5F2EB] rounded-2xl flex items-center justify-center text-[#2D241E] shadow-inner">
                                <span className="material-symbols-outlined text-3xl">{plan.name.includes('Veg') && !plan.name.includes('Non') ? 'eco' : 'restaurant'}</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-black text-[#2D241E] tracking-tight">{plan.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-bold text-orange-600">{plan.price}</span>
                                    <span className="text-[10px] text-[#5C4D42]/60 font-bold uppercase tracking-tighter">/ {plan.period}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-6">
                            <div>
                                <p className="text-[9px] font-bold text-[#897a70] uppercase mb-2 ml-1">Included Services</p>
                                <div className="space-y-2">
                                    {plan.features.map((f, i) => (
                                        <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-[#5C4D42]">
                                            <span className="material-symbols-outlined text-[14px] text-emerald-500">check_circle</span>
                                            {f}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-gray-50/50 rounded-3xl p-4 border border-gray-100/50">
                                <p className="text-[9px] font-bold text-[#897a70] uppercase mb-2">Metrics</p>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center text-[10px] font-bold">
                                        <span className="text-[#5C4D42]/60">Users</span>
                                        <span className="text-[#2D241E]">{plan.subscribers}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-bold">
                                        <span className="text-[#5C4D42]/60">Type</span>
                                        <span className="text-[#2D241E]">{plan.meals}</span>
                                    </div>
                                </div>
                                <button className="w-full mt-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black text-[#2D241E] hover:border-orange-500 transition-all">
                                    View Report
                                </button>
                            </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => openDesigner(plan)}
                                className="flex-1 py-3 bg-[#2D241E] text-white rounded-[1.25rem] text-[10px] font-black hover:bg-[#453831] transition-all shadow-lg shadow-[#2D241E]/10"
                            >
                                Edit Settings
                            </button>
                            <button
                                onClick={() => handleAction('Analytics', plan.name)}
                                className="px-4 py-3 bg-white border border-gray-200 rounded-[1.25rem] text-[#2D241E] hover:border-blue-500 hover:text-blue-600 transition-all"
                            >
                                <span className="material-symbols-outlined text-[20px]">insights</span>
                            </button>
                            <button
                                onClick={() => handleAction('Archive', plan.name)}
                                className="px-4 py-3 bg-rose-50 border border-rose-100 rounded-[1.25rem] text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                            >
                                <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
                            </button>
                        </div>
                    </div>
                ))}

                {/* Create Shortcut Card */}
                <div
                    onClick={() => openDesigner()}
                    className="border-2 border-dashed border-[#2D241E]/10 rounded-[2.5rem] flex flex-col items-center justify-center p-8 hover:border-[#2D241E]/30 hover:bg-white/20 transition-all cursor-pointer group"
                >
                    <div className="size-16 bg-white rounded-2xl flex items-center justify-center text-[#2D241E]/20 group-hover:text-orange-500 group-hover:scale-110 transition-all shadow-sm">
                        <span className="material-symbols-outlined text-4xl">inventory_2</span>
                    </div>
                    <h4 className="mt-4 text-sm font-black text-[#2D241E]">New Package Concept</h4>
                    <p className="text-[10px] text-[#5C4D42]/60 font-medium text-center mt-1">Design a custom meal plan with<br />unique features & pricing.</p>
                </div>
            </div>

            {/* Plan Designer Modal - [NEW] */}
            {showDesigner && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2D241E]/80 backdrop-blur-md animate-[fadeIn_0.3s]" onClick={() => setShowDesigner(false)}></div>
                    <div className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl animate-[scaleIn_0.3s] relative z-10 border border-white/20">

                        <div className="bg-[#2D241E] p-8 text-white">
                            <h3 className="text-3xl font-black italic">{selectedPlan ? 'Edit Package' : 'New Plan Design'}</h3>
                            <p className="text-white/50 text-[10px] uppercase font-black tracking-widest mt-1">Subscription Strategy Studio</p>
                        </div>

                        <div className="p-8 space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-[#897a70] uppercase ml-2 tracking-widest">Plan Display Name</label>
                                <input type="text" defaultValue={selectedPlan?.name || ''} placeholder="e.g. Premium Veg Monthly" className="w-full bg-gray-50 border-none px-5 py-4 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white transition-all outline-none" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#897a70] uppercase ml-2 tracking-widest">Pricing (INR)</label>
                                    <input type="text" defaultValue={selectedPlan?.price || ''} placeholder="₹ 2,499" className="w-full bg-gray-50 border-none px-5 py-4 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white transition-all outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#897a70] uppercase ml-2 tracking-widest">Validity (Days)</label>
                                    <select className="w-full bg-gray-50 border-none px-5 py-4 rounded-2xl text-xs font-bold text-[#2D241E] outline-none">
                                        <option>30 Days</option>
                                        <option>15 Days</option>
                                        <option>7 Days</option>
                                        <option>1 Day (Trial)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-[#897a70] uppercase ml-2 tracking-widest">Active Features</label>
                                {['Daily Variety Menu', 'Weekend Special Item', 'Priority Delivery', 'Packaging Included'].map((f, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all cursor-pointer">
                                        <span className="text-xs font-bold text-[#5C4D42]">{f}</span>
                                        <div className="size-5 rounded bg-emerald-500 flex items-center justify-center text-white">
                                            <span className="material-symbols-outlined text-[14px]">check</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 bg-gray-50 flex gap-3">
                            <button onClick={() => setShowDesigner(false)} className="flex-1 py-4 bg-white border border-gray-200 rounded-2xl font-black text-xs text-[#897a70] hover:text-red-500 transition-all">Cancel Concept</button>
                            <button onClick={handleSavePlan} className="flex-1 py-4 bg-[#2D241E] text-white rounded-2xl font-black text-xs shadow-xl shadow-black/10 hover:bg-orange-600 transition-all uppercase tracking-widest">Save Strategy</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AdminPlans;
