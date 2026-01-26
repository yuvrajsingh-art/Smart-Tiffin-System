import React, { useState } from 'react';
import toast from 'react-hot-toast';

const AdminSettings = () => {
    const [activeSection, setActiveSection] = useState('Profile');

    const handleSave = () => {
        toast.success('Settings updated successfully!', {
            icon: '⚙️',
            style: { borderRadius: '15px', background: '#2D241E', color: '#fff' }
        });
    };

    const sections = [
        { id: 'Profile', icon: 'person', label: 'Admin Profile' },
        { id: 'System', icon: 'settings_suggest', label: 'System Config' },
        { id: 'Notifications', icon: 'notifications_active', label: 'Alerts & Comms' },
        { id: 'Security', icon: 'shield_lock', label: 'Security & Auth' },
    ];

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto min-h-full pb-8 animate-[fadeIn_0.5s]">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black text-[#2D241E] tracking-tight flex items-center gap-2">
                        Control Center
                        <span className="px-2 py-0.5 bg-[#2D241E] text-white text-[9px] font-black rounded-lg uppercase tracking-wider">Settings</span>
                    </h2>
                    <p className="text-[#5C4D42] text-xs font-medium opacity-80 mt-0.5 italic">Manage your portal preferences and system-wide configurations.</p>
                </div>

                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#2D241E] text-white rounded-2xl text-[11px] font-black hover:bg-[#453831] shadow-xl shadow-[#2D241E]/10 transition-all uppercase tracking-widest"
                >
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* 1. Sidebar Tabs (Left) */}
                <div className="lg:col-span-3 space-y-2">
                    {sections.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setActiveSection(s.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.75rem] transition-all duration-300 ${activeSection === s.id
                                    ? 'bg-white text-[#2D241E] shadow-lg shadow-black/5 font-black translate-x-2'
                                    : 'text-[#897a70] hover:bg-white/40 font-bold'
                                }`}
                        >
                            <span className={`material-symbols-outlined text-[20px] ${activeSection === s.id ? 'text-orange-500' : ''}`}>{s.icon}</span>
                            <span className="text-xs uppercase tracking-widest">{s.label}</span>
                        </button>
                    ))}

                    <div className="mt-8 p-6 bg-[#2D241E] rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 size-16 bg-white/5 rounded-full blur-2xl"></div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Platform Version</p>
                        <h4 className="text-lg font-black italic">v2.1.0-Admin</h4>
                        <p className="text-[9px] text-orange-400 font-bold mt-2 flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-orange-500"></span> System Stable
                        </p>
                    </div>
                </div>

                {/* 2. Content Area (Right) */}
                <div className="lg:col-span-9 bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/60 shadow-lg min-h-[500px]">

                    {activeSection === 'Profile' && (
                        <div className="space-y-8 animate-[fadeIn_0.3s]">
                            <div className="flex items-center gap-6">
                                <div className="size-24 rounded-[2rem] bg-[#F5F2EB] border-2 border-white shadow-inner flex items-center justify-center relative group">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=AdminBoss" alt="Admin" className="size-20 rounded-[1.5rem]" />
                                    <button className="absolute -bottom-2 -right-2 size-8 bg-[#2D241E] text-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-[16px]">edit</span>
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-[#2D241E]">Administrator</h3>
                                    <p className="text-xs font-bold text-[#897a70]">Super Admin Access • Full Permissions</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#897a70] uppercase ml-2 tracking-widest">Full Name</label>
                                    <input type="text" defaultValue="Admin Boss" className="w-full bg-gray-50/50 border-none px-5 py-3.5 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white transition-all outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#897a70] uppercase ml-2 tracking-widest">Email Address</label>
                                    <input type="email" defaultValue="admin@smarttiffin.com" className="w-full bg-gray-50/50 border-none px-5 py-3.5 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white transition-all outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#897a70] uppercase ml-2 tracking-widest">Contact Phone</label>
                                    <input type="text" defaultValue="+91 91110-XXXXX" className="w-full bg-gray-50/50 border-none px-5 py-3.5 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white transition-all outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#897a70] uppercase ml-2 tracking-widest">City Access</label>
                                    <input type="text" defaultValue="Indore (Full-Zone)" className="w-full bg-gray-100/50 border-none px-5 py-3.5 rounded-2xl text-xs font-bold text-[#5C4D42] cursor-not-allowed outline-none" disabled />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'System' && (
                        <div className="space-y-6 animate-[fadeIn_0.3s]">
                            <h3 className="text-lg font-black text-[#2D241E] mb-6">Global Configurations</h3>

                            <div className="p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-black text-[#2D241E]">Maintenance Mode</p>
                                    <p className="text-[10px] text-[#897a70] font-medium mt-0.5">Pause all customer orders temporarily.</p>
                                </div>
                                <div className="size-12 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center cursor-pointer hover:border-orange-500 transition-all">
                                    <div className="size-4 rounded-full bg-gray-200"></div>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50/50 rounded-[2rem] border border-gray-100 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-black text-[#2D241E]">Auto-Approve Kitchens</p>
                                    <p className="text-[10px] text-[#897a70] font-medium mt-0.5">New partners list directly on portal.</p>
                                </div>
                                <div className="size-12 bg-white rounded-xl shadow-sm border border-orange-500 flex items-center justify-center cursor-pointer">
                                    <div className="size-4 rounded-full bg-orange-500"></div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <label className="text-[10px] font-black text-[#897a70] uppercase ml-2 mb-3 block tracking-widest">Currency Locale</label>
                                <select className="w-full bg-white border-2 border-gray-100 px-5 py-3.5 rounded-2xl text-xs font-bold text-[#2D241E] outline-none focus:border-[#2D241E]/10">
                                    <option>INR (₹) - India</option>
                                    <option>USD ($) - International</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {activeSection !== 'Profile' && activeSection !== 'System' && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <div className="size-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                <span className="material-symbols-outlined text-4xl">pending_actions</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-[#2D241E]">{activeSection} Configurations coming soon.</h4>
                                <p className="text-[10px] text-[#897a70] font-medium">We are polishing these settings for the next update.</p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
