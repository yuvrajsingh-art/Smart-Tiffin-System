import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminSettings = () => {
    // --- Initial State (Loaded from localStorage or Defaults) ---
    const getInitialSettings = () => {
        const saved = localStorage.getItem('smart_tiffin_admin_settings');
        if (saved) return JSON.parse(saved);
        return {
            // Menu Logic
            isDailyMandatory: true,
            dailyCutoffTime: '10:30',
            allowSameDayEdit: false,
            isWeeklyMandatory: true,
            maxDishesPerTiffin: 6,
            jainMandatory: true,

            // Financials
            baseCommission: 15,
            premiumCommission: 12,
            gstRate: 5,
            minPayoutThreshold: 2000,

            // System
            appName: 'Smart Tiffin System',
            appVersion: '2.4.0-rev4',
            maintenanceMode: false,
            cacheHealth: 98.2,

            // Notifications
            notifCustomerSMS: true,
            notifCustomerPush: true,
            notifProviderEmail: true,
            notifProviderPush: true,
            notifAdminUrgent: true,

            // Security
            globalFreeze: false,
            twoFactorEnabled: true,
            ipLockdown: false,

            // --- ALL NEW SETTINGS ---
            // Customer Policies
            cancellationFee: 50,
            refundSlab6h: 100,
            refundSlab2h: 50,
            autoWalletRefund: true,

            // Compliance
            fssaiMandatory: true,
            gstProofRequired: false,
            aadharVerifiedOnly: true,

            // Integrations
            smsProvider: 'Twilio',
            mapsApiKey: 'AIzaSyA...L4',
            smtpHost: 'smtp.sendgrid.net',

            // Localization
            currencyCode: 'INR',
            timezone: 'Asia/Kolkata',
            defaultLang: 'Hinglish'
        };
    };

    const [settings, setSettings] = useState(getInitialSettings());
    const [activeSection, setActiveSection] = useState('MenuRules');
    const [isPurging, setIsPurging] = useState(false);
    const [purgeProgress, setPurgeProgress] = useState(0);
    const [auditLogs, setAuditLogs] = useState([
        { id: 1, action: 'SYSTEM_BOOT', detail: 'Settings Engine Initialized', time: 'Just now', type: 'system' },
        { id: 2, action: 'SYNC_COMPLETE', detail: 'Systems initialized with v2.4.0', time: '5m ago', type: 'system' },
    ]);

    // Save to localStorage whenever settings change
    useEffect(() => {
        localStorage.setItem('smart_tiffin_admin_settings', JSON.stringify(settings));
    }, [settings]);

    // --- Helper Functions ---
    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
        addLog('POLICY_CHANGE', `Toggled ${key} status`, 'user');
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

    const runPurgeCache = () => {
        setIsPurging(true);
        setPurgeProgress(0);
        const interval = setInterval(() => {
            setPurgeProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsPurging(false);
                    setSettings(s => ({ ...s, cacheHealth: 100 }));
                    toast.success('System Cache Purged Successfully', {
                        style: { background: '#2D241E', color: '#fff', fontSize: '10px', fontWeight: 'bold' }
                    });
                    addLog('CACHE_PURGE', 'Optimized system storage', 'system');
                    return 100;
                }
                return prev + 10;
            });
        }, 150);
    };

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/admin/settings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setSettings(prev => ({ ...prev, ...res.data.data }));
            }
        } catch (err) {
            console.error("Fetch Settings Error:", err);
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
        { id: 'MenuRules', icon: 'terminal', label: 'Tiffin Logic' },
        { id: 'Financials', icon: 'payments', label: 'Financial Rules' },
        { id: 'CustPolicy', icon: 'person_search', label: 'Customer Policies' },
        { id: 'Gatekeeper', icon: 'gavel', label: 'Compliance' },
        { id: 'Notifications', icon: 'notifications_active', label: 'Alert Engine' },
        { id: 'Systems', icon: 'dns', label: 'Core Config' },
        { id: 'Integrations', icon: 'api', label: 'Integrations' },
        { id: 'Security', icon: 'security', label: 'Security & Logs' },
        { id: 'Locales', icon: 'language', label: 'Localization' },
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

                    {/* Module: Customer Policies */}
                    {activeSection === 'CustPolicy' && (
                        <div className="space-y-6 animate-[fadeIn_0.3s] relative z-10">
                            <div className="mb-2">
                                <h3 className="text-base font-bold text-[#2D241E] uppercase tracking-wider italic">Customer Service Protocols</h3>
                                <p className="text-xs text-[#897a70] font-bold uppercase mt-0.5 tracking-wider">Define cancellation windows and refund behaviors.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="p-6 bg-white/60 border border-white/50 rounded-[2.5rem] shadow-sm space-y-5">
                                    <h4 className="text-sm font-bold text-[#2D241E] uppercase flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[17px] text-rose-500">cancel</span> Cancellation Rules
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center bg-white/80 p-3.5 rounded-2xl border border-white/20">
                                            <div className="flex-1 pr-3">
                                                <p className="text-xs font-bold uppercase tracking-tight">Fixed Cancellation Fee</p>
                                                <p className="text-[10px] text-[#897a70] font-bold mt-0.5">₹ charged for late cancels.</p>
                                            </div>
                                            <input
                                                type="number"
                                                value={settings.cancellationFee}
                                                onChange={(e) => handleChange('cancellationFee', e.target.value)}
                                                className="w-16 bg-gray-100/50 border-none rounded-lg text-xs font-bold p-2 text-center outline-none"
                                            />
                                        </div>
                                        <div className="flex justify-between items-center bg-[#2D241E] p-3.5 rounded-2xl text-white">
                                            <div className="flex-1 pr-3">
                                                <p className="text-xs font-bold uppercase tracking-tight">Auto-Wallet Refund</p>
                                                <p className="text-[10px] text-white/40 font-bold mt-0.5">Instant credit to customer wallet.</p>
                                            </div>
                                            <button onClick={() => handleToggle('autoWalletRefund')} className={`w-8 h-4 rounded-full relative transition-all ${settings.autoWalletRefund ? 'bg-orange-500' : 'bg-white/10'}`}>
                                                <div className={`absolute top-0.5 size-3 rounded-full bg-white transition-all ${settings.autoWalletRefund ? 'right-0.5' : 'left-0.5'}`}></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-white/60 border border-white/50 rounded-[2.5rem] shadow-sm space-y-5">
                                    <h4 className="text-sm font-bold text-[#2D241E] uppercase flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[17px] text-indigo-500">account_balance_wallet</span> Refund Slabs
                                    </h4>
                                    <div className="space-y-3">
                                        {[
                                            { label: '>6h Before Meal', desc: '% Refund for early notice', key: 'refundSlab6h' },
                                            { label: '2h - 6h Before', desc: '% Refund for short notice', key: 'refundSlab2h' },
                                        ].map((slab) => (
                                            <div key={slab.key} className="flex justify-between items-center bg-white/80 p-3.5 rounded-2xl border border-white/20">
                                                <div className="flex-1 pr-3">
                                                    <p className="text-xs font-bold uppercase tracking-tight">{slab.label}</p>
                                                    <p className="text-[10px] text-[#897a70] font-bold mt-0.5">{slab.desc}</p>
                                                </div>
                                                <div className="flex items-center gap-2 bg-gray-100/50 p-1 rounded-lg">
                                                    <input
                                                        type="number"
                                                        value={settings[slab.key]}
                                                        onChange={(e) => handleChange(slab.key, e.target.value)}
                                                        className="w-10 bg-transparent border-none text-xs font-bold p-1 text-center outline-none"
                                                    />
                                                    <span className="text-xs font-bold pr-1">%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Module: Gatekeeper (Compliance) */}
                    {activeSection === 'Gatekeeper' && (
                        <div className="space-y-6 animate-[fadeIn_0.3s] relative z-10">
                            <div className="mb-2">
                                <h3 className="text-base font-bold text-[#2D241E] uppercase tracking-wider italic">Compliance Gatekeeper</h3>
                                <p className="text-xs text-[#897a70] font-bold uppercase mt-0.5 tracking-wider">Set onboarding requirements for new providers.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {[
                                    { label: 'FSSAI License', desc: 'Mandatory file upload', key: 'fssaiMandatory', icon: 'license' },
                                    { label: 'GST Certificate', desc: 'Proof for tax invoices', key: 'gstProofRequired', icon: 'receipt' },
                                    { label: 'Aadhar/KYC', desc: 'Identity verification', key: 'aadharVerifiedOnly', icon: 'fingerprint' },
                                ].map((item) => (
                                    <div key={item.key} className="bg-white/60 p-5 rounded-[2.5rem] border border-white/50 shadow-sm flex flex-col gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                                                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                                            </div>
                                            <h4 className="text-xs font-bold uppercase tracking-tight">{item.label}</h4>
                                        </div>
                                        <p className="text-[10px] text-[#897a70] font-bold uppercase leading-tight">{item.desc}</p>
                                        <button
                                            onClick={() => handleToggle(item.key)}
                                            className={`w-full py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${settings[item.key] ? 'bg-[#2D241E] text-white' : 'bg-gray-100 text-[#897a70]'}`}
                                        >
                                            {settings[item.key] ? 'Enforced' : 'Optional'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Module: Financials */}
                    {activeSection === 'Financials' && (
                        <div className="space-y-6 animate-[fadeIn_0.3s]">
                            <div className="mb-2">
                                <h3 className="text-base font-bold text-[#2D241E] uppercase tracking-wider italic">Monetization Engine</h3>
                                <p className="text-xs text-[#897a70] font-bold uppercase mt-0.5 tracking-wider">Configure global commission tiers and tax compliance.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="p-6 bg-[#2D241E] rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border border-white/10">
                                    <div className="absolute -top-10 -right-10 size-32 bg-orange-500/10 rounded-full blur-3xl"></div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-5">Platform Commission</h4>
                                    <div className="space-y-5">
                                        {[
                                            { label: 'Standard Tier', val: settings.baseCommission, key: 'baseCommission', col: 'text-orange-400', accent: 'accent-orange-500' },
                                            { label: 'Premium Tier', val: settings.premiumCommission, key: 'premiumCommission', col: 'text-indigo-400', accent: 'accent-indigo-500' },
                                        ].map((tier) => (
                                            <div key={tier.key} className="space-y-2">
                                                <div className="flex justify-between text-xs font-bold italic">
                                                    <span className="uppercase tracking-tight">{tier.label}</span>
                                                    <span className={tier.col}>{tier.val}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0" max="30"
                                                    value={tier.val}
                                                    onChange={(e) => handleChange(tier.key, parseInt(e.target.value))}
                                                    className={`w-full h-1 bg-white/10 rounded-full appearance-none ${tier.accent} cursor-pointer`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div className="p-6 bg-white/60 border border-white/50 rounded-[2.5rem] shadow-sm">
                                        <p className="text-xs font-bold text-[#2D241E] uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px] text-emerald-600">receipt_long</span> Compliance Matrix
                                        </p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { label: 'GST Rate (%)', val: settings.gstRate, key: 'gstRate' },
                                                { label: 'Min Payout (₹)', val: settings.minPayoutThreshold, key: 'minPayoutThreshold' },
                                            ].map((field) => (
                                                <div key={field.key} className="space-y-1.5">
                                                    <label className="text-[10px] font-bold text-[#897a70] uppercase ml-1">{field.label}</label>
                                                    <input
                                                        type="number"
                                                        value={field.val}
                                                        onChange={(e) => handleChange(field.key, e.target.value)}
                                                        className="w-full bg-white/80 border border-white/40 p-2.5 rounded-xl text-xs font-bold focus:ring-1 focus:ring-emerald-500 outline-none shadow-sm"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-5 bg-emerald-50 border border-emerald-100/50 rounded-[1.5rem] flex items-center gap-3">
                                        <span className="material-symbols-outlined text-emerald-600 text-xl">verified</span>
                                        <p className="text-[11px] font-medium text-emerald-700 italic leading-snug">
                                            "Platform fee adjustments trigger an automated node sync across all active provider clusters."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Module: Alert Engine */}
                    {activeSection === 'Notifications' && (
                        <div className="space-y-6 animate-[fadeIn_0.3s]">
                            <div className="mb-2">
                                <h3 className="text-base font-bold text-[#2D241E] uppercase tracking-wider italic">Notification Gateway</h3>
                                <p className="text-xs text-[#897a70] font-bold uppercase mt-0.5 tracking-wider">Configure master triggers for multi-channel alerts.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                {[
                                    {
                                        title: 'Customer Alerts', toggles: [
                                            { label: 'Order SMS', key: 'notifCustomerSMS' },
                                            { label: 'Push Hub', key: 'notifCustomerPush' }
                                        ], color: 'bg-indigo-500'
                                    },
                                    {
                                        title: 'Provider Sync', toggles: [
                                            { label: 'Email Report', key: 'notifProviderEmail' },
                                            { label: 'Instant Push', key: 'notifProviderPush' }
                                        ], color: 'bg-orange-500'
                                    },
                                    {
                                        title: 'Admin Logic', toggles: [
                                            { label: 'Urgent System', key: 'notifAdminUrgent' }
                                        ], color: 'bg-[#2D241E]'
                                    },
                                ].map((hub, i) => (
                                    <div key={i} className="bg-white/60 p-5 rounded-[2.5rem] border border-white/50 shadow-sm flex flex-col gap-5">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`size-2.5 rounded-full ${hub.color} shadow-lg shadow-black/5`}></div>
                                            <h4 className="text-xs font-bold uppercase tracking-tight">{hub.title}</h4>
                                        </div>
                                        <div className="space-y-3">
                                            {hub.toggles.map((t) => (
                                                <div key={t.key} className="flex justify-between items-center bg-[#FDFCF9] p-3 rounded-2xl border border-gray-100/30">
                                                    <span className="text-xs font-bold uppercase text-[#5C4D42] tracking-tighter">{t.label}</span>
                                                    <button onClick={() => handleToggle(t.key)} className={`w-8 h-4 rounded-full relative transition-all ${settings[t.key] ? hub.color : 'bg-gray-200'}`}>
                                                        <div className={`absolute top-0.5 size-3 rounded-full bg-white transition-all ${settings[t.key] ? 'right-0.5' : 'left-0.5'}`}></div>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Module: Core Config */}
                    {activeSection === 'Systems' && (
                        <div className="space-y-6 animate-[fadeIn_0.3s]">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-5">
                                    <h3 className="text-base font-bold italic uppercase tracking-wider text-[#2D241E]">Branding Identity</h3>
                                    <div className="p-6 bg-white/60 border border-white/50 rounded-[2.5rem] shadow-sm space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-[#897a70] uppercase ml-1 tracking-wider">Platform Name</label>
                                            <input
                                                type="text"
                                                value={settings.appName}
                                                onChange={(e) => handleChange('appName', e.target.value)}
                                                className="w-full bg-white/80 border border-white/40 p-3 rounded-xl text-xs font-bold shadow-inner focus:border-orange-200 outline-none"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-[#897a70] uppercase ml-1 tracking-wider">Node Build ID</label>
                                            <div className="w-full bg-gray-100/50 p-3 rounded-xl text-xs font-bold text-gray-400 flex justify-between items-center cursor-not-allowed uppercase">
                                                <span>{settings.appVersion}</span>
                                                <span className="material-symbols-outlined text-[14px]">lock</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <h3 className="text-base font-bold italic uppercase tracking-wider text-[#2D241E]">Telemetry Hub</h3>
                                    <div className="p-6 bg-[#2D241E] rounded-[2.5rem] border border-white/10 shadow-lg flex flex-col items-center justify-center text-center relative overflow-hidden">
                                        <div className="absolute top-0 right-0 size-20 bg-orange-500/5 rounded-full blur-2xl"></div>
                                        <p className="text-[10px] font-bold text-white/40 uppercase mb-4 tracking-wider">Distributed Cache Index</p>
                                        <div className="size-24 rounded-full border-2 border-white/5 flex flex-col items-center justify-center relative">
                                            <svg className="absolute inset-0 size-full -rotate-90">
                                                <circle cx="48" cy="48" r="44" fill="transparent" stroke="#F59E0B" strokeWidth="4" strokeDasharray="276.4" strokeDashoffset={276.4 * (1 - settings.cacheHealth / 100)} className="transition-all duration-1000" />
                                            </svg>
                                            <span className="text-xl font-bold text-white italic leading-none">{settings.cacheHealth}%</span>
                                            <span className="text-xs font-bold text-emerald-400 mt-1 uppercase tracking-wider">Optimal</span>
                                        </div>
                                        <button
                                            onClick={runPurgeCache}
                                            disabled={isPurging}
                                            className={`mt-6 px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${isPurging ? 'bg-orange-500 text-white animate-pulse' : 'bg-white/10 text-white border border-white/10 hover:bg-orange-500 hover:border-orange-500 shadow-xl'}`}
                                        >
                                            {isPurging ? `SYNCING ${purgeProgress}%` : 'Purge All Clusters'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Module: Integrations */}
                    {activeSection === 'Integrations' && (
                        <div className="space-y-6 animate-[fadeIn_0.3s] relative z-10">
                            <div className="mb-2">
                                <h3 className="text-base font-bold text-[#2D241E] uppercase tracking-wider italic">External Synapses</h3>
                                <p className="text-xs text-[#897a70] font-bold uppercase mt-0.5 tracking-wider">Configure API keys and 3rd-party service connections.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="p-6 bg-[#2D241E] rounded-[2.5rem] text-white shadow-2xl space-y-5 border border-white/10">
                                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2 italic">Communications API</h4>
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-white/30 uppercase tracking-wider">SMS Service Provider</label>
                                            <select
                                                value={settings.smsProvider}
                                                onChange={(e) => handleChange('smsProvider', e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs font-bold text-white outline-none"
                                            >
                                                <option value="Twilio">Twilio (Indore_Zone_2)</option>
                                                <option value="AWS_SNS">AWS SNS (Global_Master)</option>
                                                <option value="Firebase">Firebase Cloud (Native)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Maps Runtime Key</label>
                                            <div className="relative group">
                                                <input
                                                    type="password"
                                                    value={settings.mapsApiKey}
                                                    onChange={(e) => handleChange('mapsApiKey', e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 p-3 pr-10 rounded-xl text-xs font-bold text-orange-400 outline-none"
                                                />
                                                <span className="material-symbols-outlined absolute right-3 top-2.5 text-[16px] text-white/20 cursor-pointer hover:text-white/60">visibility_off</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-white/60 border border-white/50 rounded-[2.5rem] shadow-sm space-y-5">
                                    <h4 className="text-sm font-bold text-[#2D241E] uppercase flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[17px] text-emerald-600">mail</span> SMTP Gateway
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                                            <p className="text-[10px] font-bold text-[#897a70] uppercase tracking-wider mb-1">Primary SMTP Host</p>
                                            <p className="text-sm font-bold text-[#2D241E] italic">smtp.sendgrid.net:587</p>
                                        </div>
                                        <button className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all">Test Connection</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Module: Localization */}
                    {activeSection === 'Locales' && (
                        <div className="space-y-6 animate-[fadeIn_0.3s] relative z-10">
                            <div className="mb-2">
                                <h3 className="text-base font-bold text-[#2D241E] uppercase tracking-wider italic">Regional Matrix</h3>
                                <p className="text-xs text-[#897a70] font-bold uppercase mt-0.5 tracking-wider">Configure currency, timezone, and language protocols.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="p-6 bg-white/60 border border-white/50 rounded-[2.5rem] shadow-sm space-y-4">
                                    {[
                                        { label: 'System Currency', val: 'INR (₹)', key: 'currencyCode', icon: 'currency_rupee' },
                                        { label: 'Operational Timezone', val: 'Asia/Kolkata (GMT+5:30)', key: 'timezone', icon: 'schedule' },
                                    ].map((locale) => (
                                        <div key={locale.key} className="flex justify-between items-center bg-white border border-white/40 p-3.5 rounded-2xl shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-[18px] text-[#897a70]">{locale.icon}</span>
                                                <p className="text-xs font-bold uppercase tracking-tight text-[#897a70]">{locale.label}</p>
                                            </div>
                                            <span className="text-sm font-bold text-[#2D241E] italic">{locale.val}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6 bg-[#2D241E] rounded-[2.5rem] text-white shadow-2xl flex flex-col justify-center items-center text-center relative overflow-hidden">
                                    <div className="absolute top-0 left-0 size-20 bg-indigo-500/10 rounded-full blur-2xl"></div>
                                    <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-4">Default Interface Language</h4>
                                    <div className="flex gap-2">
                                        {['English', 'Hindi', 'Hinglish'].map(lang => (
                                            <button
                                                key={lang}
                                                onClick={() => handleChange('defaultLang', lang)}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${settings.defaultLang === lang ? 'bg-orange-500 text-white shadow-lg' : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'}`}
                                            >
                                                {lang}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Module: Security */}
                    {activeSection === 'Security' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                            <div className="lg:col-span-8 space-y-6 animate-[fadeIn_0.3s]">
                                <div className="p-6 bg-rose-50/50 border border-rose-100 rounded-[2.5rem] relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 size-32 bg-rose-500/5 rounded-full blur-3xl group-hover:bg-rose-500/10 transition-colors"></div>
                                    <div className="flex justify-between items-center relative z-10">
                                        <div className="max-w-[70%]">
                                            <h3 className="text-base font-bold text-rose-600 italic mb-1 tracking-tight uppercase">Protocol Zero</h3>
                                            <p className="text-xs font-bold text-rose-500/80 leading-relaxed uppercase tracking-tight">
                                                Instant platform-wide lockdown. Blocks all provider ingress and egress operations.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleToggle('globalFreeze')}
                                            className={`px-6 py-3 rounded-2xl text-xs font-bold shadow-xl tracking-wider transition-all ${settings.globalFreeze ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white animate-pulse'}`}
                                        >
                                            {settings.globalFreeze ? 'DEACTIVATE' : 'LOCKDOWN'}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-[#2D241E] uppercase flex items-center gap-2 italic ml-1 tracking-wider">Audit Terminal Ledger</h4>
                                    <div className="space-y-2">
                                        {auditLogs.map((log) => (
                                            <div key={log.id} className="p-3 bg-white/60 border border-white/40 rounded-xl flex items-center justify-between hover:border-gray-200 transition-all group">
                                                <div className="flex items-center gap-3">
                                                    <span className={`size-1.5 rounded-full ${log.type === 'system' ? 'bg-emerald-500' : 'bg-indigo-500'} shadow-sm`}></span>
                                                    <div>
                                                        <p className="text-[11px] font-bold uppercase tracking-tight text-[#2D241E]">{log.action}</p>
                                                        <p className="text-[10px] text-[#897a70] font-bold uppercase tracking-tighter">{log.detail}</p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-300 uppercase">{log.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-4 h-full">
                                <div className="p-6 bg-[#2D241E] rounded-[2.5rem] text-white flex flex-col h-full shadow-2xl relative overflow-hidden border border-white/10">
                                    <div className="absolute top-0 right-0 size-32 bg-indigo-500/5 rounded-full blur-3xl"></div>
                                    <h3 className="text-[10px] font-bold italic tracking-wider uppercase text-white/30 mb-6">Fortress Layer</h3>
                                    <div className="space-y-4 flex-1">
                                        {[
                                            { label: '2FA Protocols', key: 'twoFactorEnabled', icon: 'verified_user' },
                                            { label: 'IP Geofence', key: 'ipLockdown', icon: 'lan' }
                                        ].map((sec) => (
                                            <div key={sec.key} className="flex justify-between items-center p-3.5 bg-white/5 rounded-2xl border border-white/5">
                                                <div className="flex items-center gap-2.5">
                                                    <span className="material-symbols-outlined text-[16px] text-white/40">{sec.icon}</span>
                                                    <span className="text-xs font-bold uppercase tracking-tight">{sec.label}</span>
                                                </div>
                                                <button onClick={() => handleToggle(sec.key)} className={`w-7 h-3.5 rounded-full relative transition-all ${settings[sec.key] ? 'bg-emerald-500' : 'bg-white/10'}`}>
                                                    <div className={`absolute top-0.5 size-2.5 rounded-full bg-white transition-all ${settings[sec.key] ? 'right-0.5' : 'left-0.5'}`}></div>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full py-4 mt-6 bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-bold rounded-xl transition-all tracking-wider uppercase">SSH Terminal Access</button>
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
