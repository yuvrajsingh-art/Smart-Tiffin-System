import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminSettings = () => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('Security');
    const [auditLogs, setAuditLogs] = useState([]);

    // --- Helper Functions ---
    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleChange = (key, val) => {
        setSettings(prev => ({ ...prev, [key]: val }));
    };

    const addLog = (action, detail, type = 'user') => {
        const newLog = {
            id: Date.now(),
            action,
            detail,
            time: 'Just now',
            user: type === 'user' ? 'SuperAdmin' : undefined,
            type
        };
        setAuditLogs(prev => [newLog, ...prev.slice(0, 4)]);
    };


    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/admin/settings/logs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setAuditLogs(data.data);
            }
        } catch (err) {
            console.error("Fetch Logs Error:", err);
        }
    };

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const { data } = await axios.get('/api/admin/settings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setSettings(data.data);
            }
            await fetchLogs();
        } catch (err) {
            toast.error("Failed to load platform data");
            console.error("Fetch Settings Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        const syncPromise = axios.put('/api/admin/settings', settings, {
            headers: { Authorization: `Bearer ${token}` }
        });

        toast.promise(
            syncPromise,
            {
                loading: 'Syncing Rules to System Servers...',
                success: 'All Systems Synchronized!',
                error: (err) => err.response?.data?.message || 'Sync Failed',
            },
            {
                style: { background: '#2D241E', color: '#fff', fontSize: '10px', fontWeight: 'bold' }
            }
        );

        try {
            await syncPromise;
            addLog('MASTER_SYNC', 'Global configuration push successful', 'user');
        } catch (err) {
            console.error("Sync Error:", err);
        }
    };


    const sections = [
        { id: 'MenuRules', icon: 'settings_suggest', label: 'Operational Rules' },
        { id: 'Security', icon: 'security', label: 'Security & Logs' },
        { id: 'Profile', icon: 'id_card', label: 'Root Profile' },
    ];

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto min-h-screen pb-10 relative">


            {/* 2. Golden Header Block */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-[#2D241E] tracking-tight uppercase">System Settings</h1>
                        <span className="px-2 py-0.5 bg-violet-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-lg shadow-violet-500/10">Admin Console</span>
                    </div>
                    <p className="text-[#897a70] text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-violet-500 animate-pulse"></span>
                        Global Configurations & Infrastructure Management
                    </p>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                    <button
                        onClick={handleSave}
                        className="px-5 py-2.5 bg-[#2D241E] text-white rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-[#453831] flex items-center gap-2 shadow-xl shadow-black/10 scale-105 active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[18px]">sync</span>
                        Apply Changes
                    </button>
                </div>
            </div>



            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">

                {/* 2. Side Navigation */}
                <div className="lg:col-span-3 space-y-3">
                    <div className="bg-white/70 backdrop-blur-xl p-1.5 rounded-[2.5rem] border border-white/60 shadow-lg">
                        {sections.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setActiveSection(s.id)}
                                className={`w-full flex items-center justify-between px-5 py-3.5 rounded-[1.25rem] transition-all duration-500 group ${activeSection === s.id
                                    ? 'bg-[#2D241E] text-white shadow-2xl shadow-black/20 translate-x-1'
                                    : 'text-[#897a70] hover:bg-white/60'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`material-symbols-outlined text-[17px] ${activeSection === s.id ? 'text-orange-400' : ''}`}>{s.icon}</span>
                                    <span className="text-xs font-bold uppercase tracking-wider">{s.label}</span>
                                </div>
                                {activeSection === s.id && <span className="size-1 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></span>}
                            </button>
                        ))}
                    </div>

                    <div className="bg-[#2D241E] p-5 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 size-20 bg-emerald-500/10 rounded-full blur-2xl"></div>
                        <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-3">System Hub</h4>
                        <div className="flex items-center gap-3">
                            <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-sm font-bold">System Online</span>
                        </div>
                    </div>
                </div>

                {/* 3. Settings Modules */}
                <div className="lg:col-span-9 bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/60 shadow-lg min-h-[600px] relative overflow-hidden">

                    {/* Texture Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2d241e 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

                    {/* Decorative Gradient */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-orange-50/50 to-transparent pointer-events-none"></div>

                    {/* Module: Tiffin Logic */}
                    {activeSection === 'MenuRules' && (
                        <div className="space-y-6 animate-[fadeIn_0.3s] relative z-10">
                            <div className="mb-2">
                                <h3 className="text-base font-bold text-[#2D241E] uppercase tracking-wider italic">Operational Rules</h3>
                                <p className="text-xs text-[#897a70] font-bold uppercase mt-0.5 tracking-wider">Configure core operational constraints for providers.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="p-6 bg-white/70 border border-white/60 rounded-[2.5rem] shadow-lg space-y-5">
                                    <h4 className="text-sm font-bold text-[#2D241E] uppercase flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[17px] text-orange-500">timer</span> Publishing Timeline
                                    </h4>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Daily Update Mandatory', desc: 'Forces a 24h refresh cycle.', key: 'isDailyMandatory' },
                                            { label: 'Allow Same-Day Edit', desc: 'Permit updates during live slots.', key: 'allowSameDayEdit' },
                                        ].map((rule) => (
                                            <div key={rule.key} className="flex justify-between items-center bg-white/80 p-3.5 rounded-2xl border border-white/20">
                                                <div className="flex-1 pr-3">
                                                    <p className="text-xs font-bold uppercase tracking-tight">{rule.label}</p>
                                                    <p className="text-[10px] text-[#897a70] font-bold mt-0.5">{rule.desc}</p>
                                                </div>
                                                <button onClick={() => handleToggle(rule.key)} className={`w-8 h-4 rounded-full relative transition-all ${settings[rule.key] ? 'bg-orange-500' : 'bg-gray-200'}`}>
                                                    <div className={`absolute top-0.5 size-3 rounded-full bg-white transition-all ${settings[rule.key] ? 'right-0.5' : 'left-0.5'}`}></div>
                                                </button>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center bg-white/80 p-3.5 rounded-2xl border border-white/20">
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-tight">Cut-off Threshold</p>
                                                <p className="text-[10px] text-[#897a70] font-bold mt-0.5">Order freeze time.</p>
                                            </div>
                                            <input
                                                type="time"
                                                value={settings.dailyCutoffTime}
                                                onChange={(e) => handleChange('dailyCutoffTime', e.target.value)}
                                                className="bg-gray-100/50 border-none rounded-lg text-xs font-bold p-1.5 outline-none w-20 text-center focus:bg-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-white/60 border border-white/50 rounded-[2.5rem] shadow-sm space-y-5">
                                    <h4 className="text-sm font-bold text-[#2D241E] uppercase flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[17px] text-indigo-500">restaurant</span> Meal Constraints
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center bg-white/80 p-3.5 rounded-2xl border border-white/20">
                                            <div className="flex-1 pr-3">
                                                <p className="text-xs font-bold uppercase tracking-tight">Max Dishes Per Meal</p>
                                                <p className="text-[10px] text-[#897a70] font-bold mt-0.5">Global item limit.</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleChange('maxDishesPerTiffin', Math.max(1, settings.maxDishesPerTiffin - 1))} className="size-6 bg-gray-100/50 rounded-lg flex items-center justify-center hover:bg-gray-200 text-xs">-</button>
                                                <span className="text-xs font-bold w-4 text-center">{settings.maxDishesPerTiffin}</span>
                                                <button onClick={() => handleChange('maxDishesPerTiffin', settings.maxDishesPerTiffin + 1)} className="size-6 bg-gray-100/50 rounded-lg flex items-center justify-center hover:bg-gray-200 text-xs">+</button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center bg-white/80 p-3.5 rounded-2xl border border-white/20">
                                            <div className="flex-1 pr-3">
                                                <p className="text-xs font-bold uppercase tracking-tight">Jain Tag Mandatory</p>
                                                <p className="text-[10px] text-[#897a70] font-bold mt-0.5">Forces "Jain" option tagging.</p>
                                            </div>
                                            <button onClick={() => handleToggle('jainMandatory')} className={`w-8 h-4 rounded-full relative transition-all ${settings.jainMandatory ? 'bg-indigo-500' : 'bg-gray-200'}`}>
                                                <div className={`absolute top-0.5 size-3 rounded-full bg-white transition-all ${settings.jainMandatory ? 'right-0.5' : 'left-0.5'}`}></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Module: Security */}
                    {activeSection === 'Security' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                            <div className="lg:col-span-12 space-y-6 animate-[fadeIn_0.3s]">
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-[#2D241E] uppercase flex items-center gap-2 italic ml-1 tracking-wider">System Audit Logs</h4>
                                    <div className="space-y-2">
                                        {auditLogs.map((log) => (
                                            <div key={log._id} className="p-3 bg-white/60 border border-white/40 rounded-xl flex items-center justify-between hover:border-gray-200 transition-all group">
                                                <div className="flex items-center gap-3">
                                                    <span className={`size-1.5 rounded-full ${log.role === 'system' ? 'bg-emerald-500' : 'bg-indigo-500'} shadow-sm`}></span>
                                                    <div>
                                                        <p className="text-[11px] font-bold uppercase tracking-tight text-[#2D241E]">{log.event}</p>
                                                        <p className="text-[10px] text-[#897a70] font-bold uppercase tracking-tighter">
                                                            {log.detail} {log.admin && `by ${log.admin.fullName}`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-300 uppercase">{new Date(log.createdAt).toLocaleTimeString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* Module: Profile */}
                    {activeSection === 'Profile' && (
                        <div className="max-w-3xl mx-auto py-8 space-y-8 animate-[fadeIn_0.3s]">
                            <div className="flex items-center gap-8 bg-white/40 p-8 rounded-[3rem] border border-white/60 shadow-inner">
                                <div className="size-32 rounded-[2.5rem] bg-[#F5F2EB] border-4 border-white shadow-xl flex items-center justify-center relative group overflow-hidden">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=AdminBoss" alt="Admin" className="size-24 rounded-2xl group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-[#2D241E]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <span className="material-symbols-outlined text-white text-2xl">edit</span>
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-[#2D241E] italic tracking-tight">Super Admin</h2>
                                    <p className="text-xs font-bold text-orange-500 uppercase tracking-wider mt-1 ml-0.5">Grand Overlord • Root v2.4</p>
                                    <div className="flex gap-4 mt-6">
                                        <div className="px-5 py-2 bg-[#2D241E] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xl">Indore_Master_Node</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {[
                                    { label: 'Cluster Role', val: 'System Owner • Root' },
                                    { label: 'Authorization Code', val: 'ST-9922-ROOT' },
                                    { label: 'Secure Email', val: 'admin@smarttiffin.com' },
                                    { label: 'Uptime (Master)', val: '142 Days Continuous' }
                                ].map((field, i) => (
                                    <div key={i} className="space-y-1.5 group">
                                        <label className="text-[10px] font-bold text-[#897a70] uppercase ml-2 tracking-wider group-hover:text-orange-500 transition-colors">{field.label}</label>
                                        <input type="text" readOnly value={field.val} className="w-full bg-white/80 border border-white/40 p-4 rounded-xl text-xs font-bold text-[#2D241E] shadow-sm outline-none" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default AdminSettings;
