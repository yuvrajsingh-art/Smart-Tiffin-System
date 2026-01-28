import React, { useState } from 'react';
import toast from 'react-hot-toast';

const AdminSettings = () => {
    const [activeSection, setActiveSection] = useState('MenuRules');

    // Mock Settings State
    const [settings, setSettings] = useState({
        isDailyMandatory: true,
        dailyCutoffTime: '10:00',
        allowSameDayEdit: false,
        isWeeklyMandatory: false,
        advancePublishDays: 3,
        allowRepeats: false,
        maintenanceMode: false,
        globalFreeze: false
    });

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        toast.success('System Rules Updated!', {
            icon: '👑',
            style: { borderRadius: '15px', background: '#2D241E', color: '#fff' }
        });
    };

    const handleEmergencyFreeze = () => {
        if (window.confirm("⚠️ EMERGENCY: Are you sure you want to FREEZE all menu updates system-wide? Providers won't be able to edit anything.")) {
            handleToggle('globalFreeze');
            toast.error(settings.globalFreeze ? "System Unfrozen" : "SYSTEM FROZEN", {
                icon: settings.globalFreeze ? '🔓' : '❄️',
                duration: 4000
            });
        }
    };

    const sections = [
        { id: 'MenuRules', icon: 'restaurant_menu', label: 'Menu Rules Engine' },
        { id: 'System', icon: 'settings_suggest', label: 'System Config' },
        { id: 'Profile', icon: 'person', label: 'Super Admin' },
        { id: 'Security', icon: 'shield_lock', label: 'Security & Logs' },
    ];

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto min-h-full pb-8 animate-[fadeIn_0.5s]">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black text-[#2D241E] tracking-tight flex items-center gap-2">
                        Control Center
                        <span className="px-2 py-0.5 bg-[#2D241E] text-white text-[9px] font-black rounded-lg uppercase tracking-wider">Super Admin</span>
                    </h2>
                    <p className="text-[#5C4D42] text-xs font-medium opacity-80 mt-0.5 italic">Define the "Rules of the Game" for all providers.</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleEmergencyFreeze}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${settings.globalFreeze
                            ? 'bg-blue-600 text-white animate-pulse shadow-lg shadow-blue-500/30'
                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[16px]">{settings.globalFreeze ? 'ac_unit' : 'lock_person'}</span>
                        {settings.globalFreeze ? 'System Frozen' : 'Emergency Freeze'}
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#2D241E] text-white rounded-2xl text-[11px] font-black hover:bg-[#453831] shadow-xl shadow-[#2D241E]/10 transition-all uppercase tracking-widest"
                    >
                        <span className="material-symbols-outlined text-[16px]">save</span>
                        Save Rules
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* 1. Sidebar Tabs (Left) */}
                <div className="lg:col-span-3 space-y-2">
                    {sections.map(s => (
                        <button
                            key={s.id}
                            onClick={() => setActiveSection(s.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.75rem] transition-all duration-300 group ${activeSection === s.id
                                ? 'bg-white text-[#2D241E] shadow-lg shadow-black/5 font-black translate-x-2'
                                : 'text-[#897a70] hover:bg-white/40 font-bold'
                                }`}
                        >
                            <span className={`material-symbols-outlined text-[20px] transition-colors ${activeSection === s.id ? 'text-orange-500' : 'group-hover:text-[#2D241E]'}`}>{s.icon}</span>
                            <span className="text-xs uppercase tracking-widest">{s.label}</span>
                        </button>
                    ))}

                    <div className="mt-8 p-6 bg-[#2D241E] rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
                        <div className="absolute top-0 right-0 size-16 bg-white/5 rounded-full blur-2xl"></div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">System Health</p>
                        <h4 className="text-lg font-black italic">All Systems Go</h4>
                        <p className="text-[9px] text-emerald-400 font-bold mt-2 flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Operational
                        </p>
                    </div>
                </div>

                {/* 2. Content Area (Right) */}
                <div className="lg:col-span-9 bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/60 shadow-lg min-h-[600px] relative overflow-hidden">

                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-orange-50/50 to-transparent pointer-events-none rounded-tr-[2.5rem]"></div>

                    {activeSection === 'MenuRules' && (
                        <div className="space-y-8 animate-[fadeIn_0.3s] relative z-10">

                            {/* Daily Menu Logic */}
                            <div className="bg-white/60 rounded-[2rem] p-6 border border-white/50 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-orange-100/50 rounded-xl text-orange-600">
                                        <span className="material-symbols-outlined">today</span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-[#2D241E] uppercase tracking-wider">Daily Menu Logic</h3>
                                        <p className="text-[10px] text-[#897a70] font-bold">Rules for "Today's Special"</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/60">
                                        <div>
                                            <p className="text-xs font-black text-[#2D241E]">Mandatory Daily Menu</p>
                                            <p className="text-[9px] text-[#897a70] mt-1">Providers MUST publish daily.</p>
                                        </div>
                                        <button onClick={() => handleToggle('isDailyMandatory')} className={`relative w-11 h-6 rounded-full transition-colors ${settings.isDailyMandatory ? 'bg-[#2D241E]' : 'bg-gray-200'}`}>
                                            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.isDailyMandatory ? 'translate-x-5' : ''}`} />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/60">
                                        <div>
                                            <p className="text-xs font-black text-[#2D241E]">Cut-off Time</p>
                                            <p className="text-[9px] text-[#897a70] mt-1">Freezes edits after this time.</p>
                                        </div>
                                        <input
                                            type="time"
                                            value={settings.dailyCutoffTime}
                                            onChange={(e) => handleChange('dailyCutoffTime', e.target.value)}
                                            className="bg-white border text-center border-gray-200 text-[#2D241E] text-xs font-black rounded-xl px-2 py-1 outline-none focus:border-orange-500"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/60">
                                        <div>
                                            <p className="text-xs font-black text-[#2D241E]">Allow Same-Day Edits</p>
                                            <p className="text-[9px] text-[#897a70] mt-1">Can chefs change dishes last min?</p>
                                        </div>
                                        <button onClick={() => handleToggle('allowSameDayEdit')} className={`relative w-11 h-6 rounded-full transition-colors ${settings.allowSameDayEdit ? 'bg-[#2D241E]' : 'bg-gray-200'}`}>
                                            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.allowSameDayEdit ? 'translate-x-5' : ''}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Weekly / Long-term Logic */}
                            <div className="bg-white/60 rounded-[2rem] p-6 border border-white/50 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-indigo-100/50 rounded-xl text-indigo-600">
                                        <span className="material-symbols-outlined">date_range</span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-[#2D241E] uppercase tracking-wider">Weekly Planning</h3>
                                        <p className="text-[10px] text-[#897a70] font-bold">Advance Scheduling Rules</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/60">
                                        <div>
                                            <p className="text-xs font-black text-[#2D241E]">Weekly Plan Mandatory</p>
                                            <p className="text-[9px] text-[#897a70] mt-1">Force 7-day menu structure.</p>
                                        </div>
                                        <button onClick={() => handleToggle('isWeeklyMandatory')} className={`relative w-11 h-6 rounded-full transition-colors ${settings.isWeeklyMandatory ? 'bg-[#2D241E]' : 'bg-gray-200'}`}>
                                            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.isWeeklyMandatory ? 'translate-x-5' : ''}`} />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/60">
                                        <div>
                                            <p className="text-xs font-black text-[#2D241E]">Advance Publish Days</p>
                                            <p className="text-[9px] text-[#897a70] mt-1">Days before start of week.</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleChange('advancePublishDays', Math.max(1, settings.advancePublishDays - 1))} className="size-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">-</button>
                                            <span className="text-sm font-black text-[#2D241E] w-4 text-center">{settings.advancePublishDays}</span>
                                            <button onClick={() => handleChange('advancePublishDays', settings.advancePublishDays + 1)} className="size-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">+</button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white/60">
                                        <div>
                                            <p className="text-xs font-black text-[#2D241E]">Allow Item Repeats</p>
                                            <p className="text-[9px] text-[#897a70] mt-1">Same sabzi within 3 days?</p>
                                        </div>
                                        <button onClick={() => handleToggle('allowRepeats')} className={`relative w-11 h-6 rounded-full transition-colors ${settings.allowRepeats ? 'bg-[#2D241E]' : 'bg-gray-200'}`}>
                                            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.allowRepeats ? 'translate-x-5' : ''}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

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
                                    <h3 className="text-xl font-black text-[#2D241E]">Super Administrator</h3>
                                    <p className="text-xs font-bold text-[#897a70]">System Owner • Root Access</p>
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
                                <button onClick={() => handleToggle('maintenanceMode')} className={`relative w-11 h-6 rounded-full transition-colors ${settings.maintenanceMode ? 'bg-[#2D241E]' : 'bg-gray-200'}`}>
                                    <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.maintenanceMode ? 'translate-x-5' : ''}`} />
                                </button>
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

                    {activeSection === 'Security' && (
                        <div className="space-y-8 animate-[fadeIn_0.3s]">

                            {/* Security Health Status */}
                            <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-center gap-6">
                                <div className="size-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-emerald-600">
                                    <span className="material-symbols-outlined text-3xl">shield_lock</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-[#2D241E]">System Fortress Active</h3>
                                    <p className="text-xs font-medium text-[#5C4D42] mt-1">2FA Enabled • IP Whitelisting Active • Encrypted Logs</p>
                                </div>
                                <button className="ml-auto px-6 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
                                    Run Security Audit
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                                {/* Active Sessions */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black text-[#2D241E] flex items-center gap-2">
                                        <span className="material-symbols-outlined text-gray-400">devices</span> Active Sessions
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="p-4 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 shadow-sm relative overflow-hidden">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                                            <span className="material-symbols-outlined text-2xl text-[#2D241E]">laptop_mac</span>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs font-black text-[#2D241E]">Windows PC (Chrome)</p>
                                                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Current</span>
                                                </div>
                                                <p className="text-[10px] text-[#897a70] mt-0.5">Mumbai, India • 192.168.1.1</p>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-gray-50 border border-gray-100/50 rounded-2xl flex items-center gap-4 opacity-70">
                                            <span className="material-symbols-outlined text-2xl text-gray-400">smartphone</span>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs font-black text-gray-600">iPhone 14 Pro</p>
                                                    <button className="text-[9px] font-bold text-rose-500 hover:underline uppercase">Revoke</button>
                                                </div>
                                                <p className="text-[10px] text-[#897a70] mt-0.5">Pune, India • Last active 2h ago</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Audit Logs */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black text-[#2D241E] flex items-center gap-2">
                                        <span className="material-symbols-outlined text-gray-400">history_edu</span> Recent Admin Actions
                                    </h4>
                                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar pr-2 space-y-3">
                                        {[
                                            { action: 'Updated Menu Rules', detail: 'Changed daily cutoff to 10:30 AM', time: '10 mins ago', user: 'Admin' },
                                            { action: 'Refund Processed', detail: 'Authorized ₹450 to Rahul S.', time: '1h ago', user: 'FinanceBot' },
                                            { action: 'Kitchen Freeze', detail: 'Temporarily suspended "Spice Hub"', time: '3h ago', user: 'SuperAdmin' },
                                            { action: 'System Backup', detail: 'Automated database snapshot', time: '5h ago', user: 'System' },
                                        ].map((log, i) => (
                                            <div key={i} className="flex gap-3 items-start pb-3 border-b border-gray-50 last:border-0">
                                                <div className="size-2 rounded-full bg-[#2D241E] mt-1.5 shrink-0" />
                                                <div>
                                                    <p className="text-[11px] font-black text-[#2D241E]">{log.action}</p>
                                                    <p className="text-[10px] text-[#897a70] font-medium leading-tight">{log.detail}</p>
                                                    <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold">{log.time} • {log.user}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
