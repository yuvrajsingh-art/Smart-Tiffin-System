import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';

const initialCustomersData = [
    { id: 'CUS001', name: 'Rahul Sharma', email: 'rahul@gmail.com', phone: '9876543210', plan: 'Monthly Veg', status: 'Active', joins: '12 Jan 2024', balance: '₹400', kyc: 'Verified', tags: ['VIP', 'Frequent'], tickets: 0, referrals: 12, address: 'B-201, Royal Enclave, Vijay Nagar, Indore' },
    { id: 'CUS002', name: 'Priya Verma', email: 'priya.v@outlook.com', phone: '8877665544', plan: 'Weekly Non-Veg', status: 'Active', joins: '15 Jan 2024', balance: '₹0', kyc: 'Pending', tags: ['Regular'], tickets: 1, referrals: 3, address: '14, scheme 78, Indore' },
    { id: 'CUS003', name: 'Amit Kumar', email: 'amitk@yahoo.com', phone: '7766554433', plan: 'None', status: 'Inactive', joins: '18 Jan 2024', balance: '₹0', kyc: 'Not Started', tags: ['New'], tickets: 0, referrals: 0, address: 'Not Provided' },
    { id: 'CUS004', name: 'Sneha Patel', email: 'sneha.p@gmail.com', phone: '9988776655', plan: 'Monthly Veg', status: 'Paused', joins: '20 Jan 2024', balance: '₹1200', kyc: 'Verified', tags: ['VIP'], tickets: 0, referrals: 8, address: 'Hostel 4, DAVV Campus' },
    { id: 'CUS005', name: 'Vikram Singh', email: 'vikram.s@test.com', phone: '8765432109', plan: 'Trial', status: 'Active', joins: '22 Jan 2024', balance: '₹0', kyc: 'Verified', tags: ['Trial'], tickets: 2, referrals: 1, address: 'Flat 404, Silver Springs' },
];

const AdminCustomers = () => {
    const formRef = React.useRef(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [filter, setFilter] = useState('All');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchCustomers = async () => {
        try {
            const { data } = await axios.get('/api/admin/customers');
            if (data.success) {
                setCustomers(data.data);
            }
        } catch (error) {
            toast.error("Failed to load customers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleAddNewCustomer = (e) => {
        try {
            if (e && e.preventDefault) e.preventDefault();
            const form = formRef.current;
            if (!form) return;

            const procToast = toast.loading("Onboarding node...");
            const name = form.elements['name']?.value;

            if (!name) {
                toast.dismiss(procToast);
                toast.error("Node Name Required");
                return;
            }

            const newId = `CUS00${customers.length + 1}`;
            const newCustomer = {
                id: newId,
                name: name,
                email: form.elements['email']?.value || '',
                phone: form.elements['phone']?.value || '',
                plan: form.elements['plan']?.value || 'None',
                address: form.elements['address']?.value || '',
                status: 'Active',
                joins: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                balance: '₹0',
                kyc: 'Verified',
                tags: ['New'],
                tickets: 0,
                referrals: 0
            };

            setCustomers(prev => [...prev, newCustomer]);
            toast.dismiss(procToast);
            toast.success(`Node ${newCustomer.name} Deployed`, {
                style: { borderRadius: '15px', background: '#2D241E', color: '#fff' }
            });
            setShowAddCustomerModal(false);
        } catch (err) {
            toast.error("Deployment Failed");
        }
    };

    const handleAction = (type, name) => {
        toast.success(`${type} SIGNAL SENT: ${name}`, {
            style: { borderRadius: '15px', background: '#2D241E', color: '#fff' }
        });
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredCustomers.length) setSelectedIds([]);
        else setSelectedIds(filteredCustomers.map(c => c.id));
    };

    const handleLoginAs = (name) => {
        toast.loading(`SECURE_TUNNEL: LOGGING AS ${name.toUpperCase()}...`, { duration: 1000 });
        setTimeout(() => {
            localStorage.setItem('userRole', 'customer');
            localStorage.setItem('userName', name);
            localStorage.setItem('impersonationMode', 'true');
            toast.dismiss();
            toast.success(`SESSION_ESTABLISHED: ${name}`, {
                icon: '🚀',
                style: { borderRadius: '15px', background: '#2D241E', color: '#fff' }
            });
            navigate('/customer/dashboard');
        }, 1000);
    };

    const filteredCustomers = Array.isArray(customers) ? customers.filter(cus => {
        const name = cus.name || '';
        const id = cus.id || '';
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'All' || cus.status === filter;
        return matchesSearch && matchesFilter;
    }) : [];

    const handleUpdateCustomer = (e) => {
        try {
            if (e && e.preventDefault) e.preventDefault();
            const form = formRef.current;
            if (!form) return;

            const procToast = toast.loading("Syncing DNA...");
            const updatedCustomer = {
                ...editingCustomer,
                name: form.elements['name']?.value,
                email: form.elements['email']?.value,
                phone: form.elements['phone']?.value,
                address: form.elements['address']?.value,
            };

            setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? updatedCustomer : c));
            toast.dismiss(procToast);
            toast.success(`DNA_SYNC_COMPLETE: ${updatedCustomer.name}`, {
                style: { borderRadius: '15px', background: '#2D241E', color: '#fff' }
            });
            setEditingCustomer(null);
        } catch (err) {
            toast.error("Sync Failed");
        }
    };

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto min-h-screen pb-10 animate-[fadeIn_0.5s] relative">
            {/* Texture Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2D241E 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

            {/* 1. Global Ticker (Top) */}
            <div className="w-full bg-[#2D241E] text-white overflow-hidden py-1.5 rounded-xl shadow-lg flex items-center gap-4 px-4 relative z-10">
                <div className="flex items-center gap-1 shrink-0 z-10 bg-[#2D241E] pr-2 border-r border-white/10">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Activity Live</span>
                </div>
                <div className="flex gap-8 animate-[marquee_25s_linear_infinite] whitespace-nowrap opacity-80 hover:opacity-100 transition-opacity">
                    {[
                        "Rahul paused subscription (5m ago)",
                        "Sneha updated dietary preferences (12m ago)",
                        "New user 'Vikram' joined via Referral (20m ago)",
                        "Payment failed for Customer #8821 (1h ago)",
                        "Amit re-activated plan (2h ago)"
                    ].map((item, i) => (
                        <span key={i} className="text-[10px] font-bold flex items-center gap-2">
                            <span className="size-1 bg-white/20 rounded-full"></span>
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            {/* 2. Golden Header Block */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-[#2D241E] tracking-tight uppercase">Customer Directory</h1>
                        <span className="px-2 py-0.5 bg-[#2D241E] text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-lg shadow-black/10">GLOBAL_INDEX</span>
                    </div>
                    <p className="text-[#897a70] text-xs font-bold uppercase tracking-wider opacity-60">System-wide node management & DNA profiling</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xl p-1 rounded-2xl border border-white/60 shadow-lg">
                        <button onClick={() => handleAction('Export', 'Customer List')} className="px-5 py-2 rounded-xl text-[10px] font-bold text-[#5C4D42] hover:bg-white/80 uppercase tracking-wider transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">download</span>
                            Export
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5" >
                {
                    [
                        { label: 'Active Clusters', val: '1,248', trend: '+12%', icon: 'hub', color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Network Value', val: '₹14.2M', trend: 'STABLE', icon: 'payments', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Attrition Rate', val: '2.4%', trend: '-0.5%', icon: 'trending_down', color: 'text-rose-500', bg: 'bg-rose-50' },
                        { label: 'Integrity Index', val: '98.2', trend: 'OPTIMAL', icon: 'verified_user', color: 'text-orange-500', bg: 'bg-orange-50' },
                    ].map((s, i) => (
                        <div key={i} className="bg-white/70 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/60 shadow-lg group hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                            <div className={`absolute -right-6 -top-6 size-20 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700 blur-2xl ${s.bg}`}></div>
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className={`size-10 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center shadow-lg shadow-black/5 border border-white`}>
                                    <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                                </div>
                                <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-wider bg-gray-100 text-[#897a70] border border-gray-200 flex items-center gap-1">{s.trend}</span>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold text-[#2D241E] tracking-tight group-hover:scale-105 transition-transform origin-left duration-500">{s.val}</h3>
                                <p className="text-xs font-bold text-[#897a70] uppercase tracking-wider flex items-center gap-2 opacity-60 mt-1">
                                    <span className={`size-1.5 rounded-full ${s.color.replace('text-', 'bg-')}`}></span>
                                    {s.label}
                                </p>
                            </div>
                        </div>
                    ))
                }
            </div >

            {/* Search & Bulk Action Bar */}
            < div className="flex flex-col lg:flex-row items-center gap-5" >
                <div className="flex-1 w-full bg-white/70 backdrop-blur-xl p-3 rounded-[2.5rem] border border-white/60 shadow-lg flex flex-col sm:flex-row items-center gap-4 group-focus-within:border-orange-500/20 transition-all">
                    <div className="relative flex-1 w-full group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#897a70] text-[18px] group-focus-within:text-orange-500 transition-colors">search</span>
                        <input
                            type="text"
                            placeholder="SEARCH NODE DNA (NAME, ID, PH)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border-none rounded-2xl text-xs font-bold uppercase tracking-wider focus:ring-4 focus:ring-orange-500/5 transition-all placeholder:text-gray-300 outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2 p-1.5 bg-gray-50/50 rounded-[1.5rem] border border-gray-100 w-full sm:w-auto overflow-x-auto custom-scrollbar">
                        {['All', 'Active', 'Paused', 'Inactive'].map(t => (
                            <button key={t} onClick={() => setFilter(t)} className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${filter === t ? 'bg-[#2D241E] text-white shadow-xl shadow-black/20' : 'text-[#897a70] hover:text-[#2D241E] hover:bg-white'}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {
                    selectedIds.length > 0 && (
                        <div className="w-full lg:w-auto animate-[slideInRight_0.4s_ease-out] bg-[#2D241E] p-4 rounded-[2.5rem] flex items-center gap-5 px-8 shadow-2xl border border-white/10">
                            <div className="flex flex-col">
                                <p className="text-xs font-bold text-white leading-tight uppercase tracking-wider">{selectedIds.length} Nodes</p>
                                <p className="text-xs font-bold text-orange-400 uppercase tracking-wider">Selected</p>
                            </div>
                            <div className="h-8 w-px bg-white/10"></div>
                            <div className="flex items-center gap-3">
                                {[
                                    { icon: 'notifications', col: 'hover:bg-blue-600', action: 'Notify' },
                                    { icon: 'pause_circle', col: 'hover:bg-orange-600', action: 'Pause' },
                                    { icon: 'delete_sweep', col: 'hover:bg-rose-600', action: 'Purge' },
                                ].map((btn, i) => (
                                    <button key={i} onClick={() => handleAction(btn.action, 'Selected')} className={`size-10 rounded-2xl bg-white/5 text-white flex items-center justify-center ${btn.col} transition-all duration-300 shadow-lg`}>
                                        <span className="material-symbols-outlined text-[18px]">{btn.icon}</span>
                                    </button>
                                ))}
                                <button onClick={() => setSelectedIds([])} className="size-10 rounded-2xl bg-white/10 text-white flex items-center justify-center hover:bg-white hover:text-[#2D241E] transition-all">
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            </div>
                        </div>
                    )
                }
            </div >

            {/* Customer Table */}
            < div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-xl overflow-hidden group/table mt-6" >
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#2D241E] text-white">
                                <th className="px-6 py-5 w-10">
                                    <button onClick={toggleSelectAll} className="size-5 rounded border-2 border-white/20 flex items-center justify-center hover:border-white transition-all">
                                        {selectedIds.length === filteredCustomers.length && selectedIds.length > 0 && <div className="size-2.5 bg-orange-500 rounded-sm"></div>}
                                    </button>
                                </th>
                                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider italic">Identity & Trust</th>
                                <th className="px-1 py-5 text-xs font-bold uppercase tracking-wider italic">Subscription Protocol</th>
                                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider italic">Vault & KYC Status</th>
                                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider italic text-right">Master Controls</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((cus) => (
                                    <tr key={cus.id} className={`group/row transition-all duration-300 ${selectedIds.includes(cus.id) ? 'bg-orange-50/20' : 'hover:bg-white/90'}`}>
                                        <td className="px-6 py-5">
                                            <button onClick={() => toggleSelect(cus.id)} className={`size-5 rounded border-2 transition-all flex items-center justify-center ${selectedIds.includes(cus.id) ? 'border-orange-500 bg-orange-500' : 'border-gray-200 group-hover/row:border-[#2D241E]'}`}>
                                                {selectedIds.includes(cus.id) && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
                                            </button>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="size-11 rounded-[1.25rem] bg-[#2D241E] text-white flex items-center justify-center text-sm font-bold text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-black/5 overflow-hidden border-2 border-white group-hover/row:rotate-3 transition-all duration-500">
                                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${cus.name}`} alt="" className="size-10 translate-y-2" />
                                                    </div>
                                                    {cus.kyc === 'Verified' && (
                                                        <div className="absolute -top-1.5 -right-1.5 size-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                                                            <span className="material-symbols-outlined text-white text-[10px] font-black">verified</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-bold text-[#2D241E] uppercase tracking-tight">{cus.name}</p>
                                                        {cus.tags.includes('VIP') && <span className="px-1.5 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-lg uppercase tracking-wider shadow-lg shadow-rose-500/20">VIP</span>}
                                                    </div>
                                                    <p className="text-xs font-bold text-[#897a70] uppercase tracking-wider opacity-60 mt-0.5">{cus.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-1 py-5">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`size-1.5 rounded-full ${cus.status === 'Active' ? 'bg-emerald-500' : cus.status === 'Paused' ? 'bg-amber-500' : 'bg-rose-500'} shadow-sm animate-pulse`}></span>
                                                    <span className="text-xs font-bold text-[#897a70] uppercase tracking-wider">{cus.status}</span>
                                                </div>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-lg w-fit uppercase tracking-wider shadow-sm shadow-black/5 ${cus.plan === 'None' ? 'bg-gray-100 text-gray-400' : 'bg-[#2D241E] text-white'}`}>{cus.plan}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-base font-bold text-[#2D241E] tracking-tight">{cus.balance}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className={`text-xs font-bold uppercase tracking-wider ${cus.kyc === 'Verified' ? 'text-blue-600' : cus.kyc === 'Pending' ? 'text-amber-600' : 'text-rose-400'}`}>KYC_{cus.kyc.toUpperCase()}</span>
                                                    {cus.tickets > 0 && <span className="px-1.5 bg-rose-100 text-rose-600 rounded-lg text-xs font-bold tracking-wider uppercase"> {cus.tickets} ALERTS</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-all duration-300 translate-x-4 group-hover/row:translate-x-0">
                                                <button onClick={() => handleLoginAs(cus.name)} className="size-9 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center hover:bg-violet-600 hover:text-white transition-all shadow-sm border border-violet-100"><span className="material-symbols-outlined text-[18px]">key</span></button>
                                                <button onClick={() => setEditingCustomer(cus)} className="size-9 rounded-2xl bg-gray-50 text-[#5C4D42] flex items-center justify-center hover:bg-[#2D241E] hover:text-white transition-all shadow-sm border border-gray-100"><span className="material-symbols-outlined text-[18px]">edit_note</span></button>
                                                <button onClick={() => setSelectedCustomer(cus)} className="size-9 rounded-2xl bg-[#2D241E] text-white flex items-center justify-center hover:bg-orange-600 transition-all shadow-xl shadow-black/10 border border-white/10"><span className="material-symbols-outlined text-[20px]">account_circle</span></button>
                                                <button className="size-9 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-rose-100"><span className="material-symbols-outlined text-[18px]">delete_sweep</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="size-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner relative overflow-hidden">
                                                <span className="material-symbols-outlined text-4xl text-gray-200">search_off</span>
                                            </div>
                                            <p className="text-xs font-bold text-[#2D241E] uppercase tracking-wider">Zero Search Results_</p>
                                            <button onClick={() => { setSearchQuery(''); setFilter('All'); }} className="mt-8 px-8 py-3 bg-[#2D241E] text-white rounded-[1.25rem] text-xs font-bold uppercase tracking-wider hover:bg-orange-600 transition-all">Clear Filter Protocol</button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white/30">
                    <p className="text-xs font-bold text-[#897a70]">Showing {filteredCustomers.length} of 1,248 customers</p>
                </div>
            </div >

            {/* =========================================================================
                MODAL ENGINE - [CREAM STANDARD UPGRADE]
            ========================================================================= */}

            {/* 1. Customer DNA Modal (Node Intelligence) */}
            {
                selectedCustomer && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#2D241E]/80 backdrop-blur-xl animate-[fadeIn_0.3s]" onClick={() => setSelectedCustomer(null)}></div>
                        <div className="bg-[#F5F2EB] rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] animate-[scaleIn_0.4s_cubic-bezier(0.16,1,0.3,1)] relative z-10 border-[12px] border-white ring-1 ring-black/5 flex flex-col max-h-[90vh]">
                            {/* Radial Texture Overlay */}
                            <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d1cfc7 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                            {/* Modal Header */}
                            <div className="px-10 pt-10 pb-6 flex justify-between items-start shrink-0 relative z-10">
                                <div className="flex items-center gap-6">
                                    <div className="relative group">
                                        <div className="size-20 rounded-[2.5rem] bg-[#2D241E] p-0.5 shadow-2xl border-4 border-white overflow-hidden group-hover:rotate-6 transition-transform duration-500">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedCustomer.name}`} alt="" className="size-full translate-y-2 scale-110" />
                                        </div>
                                        <div className={`absolute -bottom-2 -right-2 text-white text-xs font-bold px-2.5 py-1 rounded-xl uppercase border-2 border-white shadow-xl ${selectedCustomer.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                            {selectedCustomer.status}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-2xl font-bold text-[#2D241E] uppercase tracking-tight leading-none">{selectedCustomer.name}</h3>
                                            <span className="px-2 py-0.5 bg-[#2D241E] text-white text-[10px] font-bold rounded-lg tracking-wider uppercase shadow-lg shadow-black/10">ID_{selectedCustomer.id}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 text-xs font-bold text-[#897a70] uppercase tracking-wider bg-white/50 px-3 py-1 rounded-full border border-white/60">
                                                <span className="material-symbols-outlined text-[14px] text-orange-500">terminal</span>
                                                {selectedCustomer.phone}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-[#897a70] uppercase tracking-wider bg-white/50 px-3 py-1 rounded-full border border-white/60">
                                                <span className="material-symbols-outlined text-[14px] text-blue-500">event_available</span>
                                                ENLISTED: {selectedCustomer.joins}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedCustomer(null)} className="size-10 rounded-2xl bg-white/50 hover:bg-white text-[#2D241E] flex items-center justify-center transition-all border border-white shadow-sm">
                                    <span className="material-symbols-outlined text-[20px]">close</span>
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="px-10 pb-8 space-y-8 overflow-y-auto custom-scrollbar flex-1 relative z-10">
                                <div className="grid grid-cols-4 gap-4">
                                    {[
                                        { label: 'Network_Trust', val: selectedCustomer.kyc, icon: 'verified_user', col: 'text-blue-600' },
                                        { label: 'Wallet_Credits', val: selectedCustomer.balance, icon: 'account_balance_wallet', col: 'text-emerald-600' },
                                        { label: 'Active_Subscription', val: selectedCustomer.plan, icon: 'cycle', col: 'text-orange-600' },
                                        { label: 'Support_Tickets', val: selectedCustomer.tickets, icon: 'emergency_home', col: 'text-rose-600' },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white/40 p-4 rounded-[1.75rem] border border-white/80 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`material-symbols-outlined text-[16px] ${stat.col}`}>{stat.icon}</span>
                                                <p className="text-xs font-bold text-[#897a70] uppercase tracking-wider">{stat.label}</p>
                                            </div>
                                            <p className="text-sm font-bold text-[#2D241E] uppercase">{stat.val}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Analytics Tracker */}
                                <div className="bg-white/40 p-6 rounded-[2.5rem] border border-white/80 shadow-sm relative overflow-hidden group/tracker">
                                    <div className="absolute top-0 right-0 p-4">
                                        <span className="material-symbols-outlined text-orange-500/20 text-[60px] group-hover/tracker:scale-110 transition-transform duration-700">query_stats</span>
                                    </div>
                                    <div className="flex items-center justify-between mb-5 relative z-10">
                                        <h4 className="text-xs font-bold text-[#2D241E] uppercase tracking-wider flex items-center gap-2">
                                            <span className="size-2 rounded-full bg-orange-500 animate-ping"></span>
                                            Consumption_Stream
                                        </h4>
                                        <p className="text-[10px] font-bold text-[#897a70] uppercase opacity-60">Last 30 Signal Cycles</p>
                                    </div>
                                    <div className="grid grid-cols-10 gap-x-2 gap-y-3 relative z-10">
                                        {[...Array(30)].map((_, i) => (
                                            <div key={i} className={`h-5 rounded-lg shadow-sm cursor-help hover:scale-125 transition-all duration-300 border border-white/40 ${i > 24 ? 'bg-[#d1cfc7]/30' : [4, 9, 15, 22].includes(i) ? 'bg-rose-500 shadow-rose-500/20' : 'bg-emerald-500 shadow-emerald-500/20'}`}></div>
                                        ))}
                                    </div>
                                    <div className="mt-6 flex justify-between items-end relative z-10">
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-emerald-500"></span><span className="text-xs font-bold text-[#897a70] uppercase">Delivered</span></div>
                                            <div className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-rose-500"></span><span className="text-xs font-bold text-[#897a70] uppercase">Skipped</span></div>
                                        </div>
                                        <p className="text-xs font-bold text-[#2D241E] italic">92.4% RELIABILITY_INDEX</p>
                                    </div>
                                </div>

                                {/* Admin Overrides */}
                                <div className="grid grid-cols-2 gap-6 relative z-10">
                                    <div className="bg-[#2D241E] p-6 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group/cmd">
                                        <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover/cmd:opacity-100 transition-opacity"></div>
                                        <div className="flex items-center gap-4 mb-5">
                                            <div className="size-10 rounded-2xl bg-white/5 flex items-center justify-center text-orange-400 border border-white/10">
                                                <span className="material-symbols-outlined text-[20px]">bolt</span>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-white uppercase italic tracking-wider leading-none">Global_Pause</p>
                                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mt-1">Suspend operations</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const newStatus = selectedCustomer.status === 'Paused' ? 'Active' : 'Paused';
                                                const updatedCustomer = { ...selectedCustomer, status: newStatus };
                                                setSelectedCustomer(updatedCustomer);
                                                setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
                                                toast.success(`Subscription ${newStatus === 'Paused' ? 'Paused' : 'Resumed'}`, {
                                                    style: { borderRadius: '15px', background: '#2D241E', color: '#fff', fontSize: '10px', fontWeight: '900' }
                                                });
                                            }}
                                            className={`w-full py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all ${selectedCustomer.status === 'Paused' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20' : 'bg-orange-600 hover:bg-orange-500 shadow-orange-600/20'}`}
                                        >
                                            {selectedCustomer.status === 'Paused' ? 'Resume_Node' : 'Suspend_Node'}
                                        </button>
                                    </div>
                                    <div className="bg-white/40 p-6 rounded-[2.5rem] border border-white/80 shadow-sm">
                                        <div className="flex items-center gap-4 mb-5">
                                            <div className="size-10 rounded-2xl bg-white flex items-center justify-center text-rose-500 shadow-sm border border-rose-50">
                                                <span className="material-symbols-outlined text-[20px]">account_balance</span>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-[#2D241E] uppercase italic tracking-wider leading-none">Credit_Sync</p>
                                                <p className="text-[10px] font-bold text-[#897a70] uppercase tracking-wider mt-1">Manual wallet adjustment</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <input type="text" placeholder="± 0.00" className="w-full bg-white/60 border border-white/80 px-4 rounded-xl text-xs font-bold focus:bg-white outline-none transition-all h-10 shadow-sm" />
                                            <button onClick={() => toast.success('Credits Synchronized')} className="px-5 bg-[#2D241E] text-white rounded-xl text-xs font-bold uppercase transition-all hover:bg-black">Sync</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-10 py-8 bg-white/30 border-t border-white/60 flex items-center justify-between shrink-0 relative z-10">
                                <button onClick={() => setSelectedCustomer(null)} className="text-xs font-bold text-[#897a70] uppercase tracking-wider hover:text-[#2D241E] transition-colors">Abort_Task</button>
                                <button onClick={() => { toast.success('DNA Integrity Verified'); setSelectedCustomer(null); }} className="px-8 py-4 bg-[#2D241E] text-white rounded-[1.25rem] text-xs font-bold uppercase tracking-wider shadow-xl shadow-black/20 hover:bg-black transition-all">Save_Node_State</button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }

            {/* 2. Modify Node Modal (Edit Profile) */}
            {
                editingCustomer && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#2D241E]/80 backdrop-blur-xl animate-[fadeIn_0.3s]" onClick={() => setEditingCustomer(null)}></div>
                        <div className="bg-[#F5F2EB] rounded-[3rem] w-full max-w-xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] animate-[scaleIn_0.4s_cubic-bezier(0.16,1,0.3,1)] relative z-10 border-[12px] border-white ring-1 ring-black/5 flex flex-col max-h-[90vh]">
                            <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d1cfc7 1px, transparent 1px)', backgroundSize: '18px 18px' }}></div>

                            <div className="px-8 pt-8 pb-4 flex justify-between items-start shrink-0 relative z-10">
                                <div>
                                    <p className="text-sm font-bold text-[#2D241E] tracking-tight uppercase leading-none">Modify_Node</p>
                                    <p className="text-xs font-bold text-[#897a70] uppercase tracking-wider mt-2">Identity Management Protocol</p>
                                </div>
                                <button onClick={() => setEditingCustomer(null)} className="size-9 rounded-2xl bg-white/50 hover:bg-white text-[#2D241E] flex items-center justify-center transition-all border border-white"><span className="material-symbols-outlined text-[18px]">close</span></button>
                            </div>

                            <form ref={formRef} className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1 relative z-10">
                                <div className="bg-white/50 p-5 rounded-[2.5rem] border border-white/80 flex items-center gap-5 shadow-sm">
                                    <div className="relative">
                                        <div className="size-16 rounded-2xl bg-[#2D241E] p-0.5 border-4 border-white shadow-xl overflow-hidden">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${editingCustomer.name}`} alt="" className="size-full translate-y-1.5 scale-110" />
                                        </div>
                                        <div className="absolute -bottom-1 -left-1 bg-white text-[#2D241E] text-[10px] font-bold px-2 py-0.5 rounded-lg border border-gray-100 shadow-sm uppercase">ID_{editingCustomer.id}</div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#201c1a] uppercase italic leading-none">{editingCustomer.name}</p>
                                        <p className="text-[10px] font-bold text-[#897a70] uppercase tracking-wider mt-1 opacity-60 font-mono">{editingCustomer.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <h4 className="text-[10px] font-bold text-orange-600 uppercase tracking-wider px-1 flex items-center gap-2"><span className="size-1.5 rounded-full bg-orange-500"></span>Signal_Identification</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#2D241E] uppercase ml-1 tracking-wider">Legal_Name</label>
                                            <input name="name" type="text" defaultValue={editingCustomer.name} className="w-full bg-white/60 border border-white/80 px-5 py-4 rounded-2xl text-sm font-bold text-[#2D241E] focus:bg-white outline-none transition-all shadow-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#2D241E] uppercase ml-1 tracking-wider">Mobile_Frequency</label>
                                            <input name="phone" type="text" defaultValue={editingCustomer.phone || ''} className="w-full bg-white/60 border border-white/80 px-5 py-4 rounded-2xl text-sm font-bold text-[#2D241E] focus:bg-white outline-none transition-all shadow-sm" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#2D241E] uppercase ml-1 tracking-wider">Digital_Mailing_Address</label>
                                        <input name="email" type="email" defaultValue={editingCustomer.email} className="w-full bg-white/60 border border-white/80 px-5 py-4 rounded-2xl text-sm font-bold text-[#2D241E] focus:bg-white outline-none transition-all shadow-sm" />
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-wider px-1 flex items-center gap-2"><span className="size-1.5 rounded-full bg-blue-500"></span>Deployment_Coordinates</h4>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#2D241E] uppercase ml-1 tracking-wider">Primary_Drop_Zone</label>
                                        <textarea name="address" defaultValue={editingCustomer.address || ''} className="w-full bg-white/60 border border-white/80 px-5 py-4 rounded-2xl text-sm font-bold text-[#2D241E] focus:bg-white outline-none transition-all h-24 resize-none shadow-sm" placeholder="Awaiting location string..." />
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <h4 className="text-[10px] font-bold text-[#2D241E] uppercase tracking-wider px-1 flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#2D241E]"></span>Signal_Tags</h4>
                                    <div className="flex flex-wrap gap-2 p-5 bg-white/40 rounded-[2.5rem] border border-white/80">
                                        {['VIP', 'Frequent', 'Regular', 'New', 'Trial', 'High_Risk'].map(t => (
                                            <button
                                                key={t}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const newTags = editingCustomer.tags.includes(t) ? editingCustomer.tags.filter(tag => tag !== t) : [...editingCustomer.tags, t];
                                                    setEditingCustomer({ ...editingCustomer, tags: newTags });
                                                }}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${editingCustomer.tags.includes(t) ? 'bg-[#2D241E] text-white shadow-xl scale-105' : 'bg-white/60 text-[#897a70] border border-white/80 hover:bg-white'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </form>

                            <div className="px-8 py-8 bg-white/30 border-t border-white/60 flex items-center gap-4 shrink-0 relative z-10">
                                <button onClick={() => setEditingCustomer(null)} className="flex-1 py-4 text-xs font-bold text-[#897a70] uppercase tracking-wider hover:text-[#2D241E]">Discard_Logic</button>
                                <button onClick={handleUpdateCustomer} className="flex-[2] py-4 bg-[#2D241E] text-white rounded-[1.25rem] text-xs font-bold uppercase tracking-wider shadow-2xl shadow-black/20 hover:bg-black transition-all flex items-center justify-center gap-3">
                                    <span className="material-symbols-outlined text-[18px] text-orange-400">commit</span>Commit_Changes
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }

            {/* 3. Onboard Node Modal (Add Customer) */}
            {
                showAddCustomerModal && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#2D241E]/80 backdrop-blur-xl animate-[fadeIn_0.3s]" onClick={() => setShowAddCustomerModal(false)}></div>
                        <div className="bg-[#F5F2EB] rounded-[3rem] w-full max-w-xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] animate-[scaleIn_0.4s_cubic-bezier(0.16,1,0.3,1)] relative z-10 border-[12px] border-white ring-1 ring-black/5 flex flex-col max-h-[90vh]">
                            <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#d1cfc7 1px, transparent 1px)', backgroundSize: '18px 18px' }}></div>

                            <div className="px-8 pt-8 pb-4 flex justify-between items-start shrink-0 relative z-10">
                                <div>
                                    <h3 className="text-xl font-bold text-[#2D241E] uppercase tracking-tight leading-none">Onboard_Node</h3>
                                    <p className="text-xs font-bold text-[#897a70] uppercase tracking-wider mt-2">Manual Integration Protocol</p>
                                </div>
                                <button onClick={() => setShowAddCustomerModal(false)} className="size-9 rounded-2xl bg-white/50 hover:bg-white text-[#2D241E] flex items-center justify-center transition-all border border-white"><span className="material-symbols-outlined text-[18px]">close</span></button>
                            </div>

                            <form ref={formRef} className="p-8 space-y-7 overflow-y-auto custom-scrollbar flex-1 relative z-10">
                                <div className="flex gap-6 items-center">
                                    <div className="size-24 bg-white/50 rounded-[2rem] border-2 border-dashed border-[#d1cfc7] flex flex-col items-center justify-center text-[#d1cfc7] gap-2 hover:border-[#2D241E] hover:text-[#2D241E] transition-all cursor-pointer group/upload">
                                        <span className="material-symbols-outlined text-[24px] group-hover/upload:scale-110 transition-transform">add_a_photo</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Matrix_ID_Pic</span>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <label className="text-xs font-bold text-[#2D241E] uppercase ml-1 tracking-wider">Full_Node_Name</label>
                                        <input name="name" type="text" required placeholder="Awaiting string input..." className="w-full bg-white/60 border border-white/80 px-5 py-4 rounded-2xl text-sm font-bold text-[#2D241E] focus:bg-white outline-none shadow-sm" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#2D241E] uppercase ml-1 tracking-wider">Signal_Address (Email)</label>
                                        <input name="email" type="email" placeholder="node@matrix.net" className="w-full bg-white/60 border border-white/80 px-5 py-4 rounded-2xl text-sm font-bold text-[#2D241E] focus:bg-white outline-none shadow-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#2D241E] uppercase ml-1 tracking-wider">Frequency_Code (Phone)</label>
                                        <div className="relative">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">+91</span>
                                            <input name="phone" type="tel" placeholder="00000 00000" className="w-full bg-white/60 border border-white/80 pl-14 pr-5 py-4 rounded-2xl text-sm font-bold text-[#2D241E] focus:bg-white outline-none shadow-sm" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#2D241E] uppercase ml-1 tracking-wider">Resource_Plan</label>
                                        <select name="plan" className="w-full bg-white/60 border border-white/80 px-5 py-4 rounded-2xl text-sm font-bold text-[#2D241E] focus:bg-white outline-none appearance-none cursor-pointer shadow-sm">
                                            <option value="None">MANUAL_OVERRIDE (NO_PLAN)</option>
                                            <option value="Weekly Veg">WEEKLY_VEG_CORE</option>
                                            <option value="Monthly Veg">MONTHLY_VEG_PRIME</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[#2D241E] uppercase ml-1 tracking-wider">Sector_Assignment</label>
                                        <input name="address" type="text" placeholder="e.g. SECTOR_7_V_NAGAR" className="w-full bg-white/60 border border-white/80 px-5 py-4 rounded-2xl text-sm font-bold text-[#2D241E] focus:bg-white outline-none shadow-sm" />
                                    </div>
                                </div>
                            </form>

                            <div className="px-8 py-8 bg-white/30 border-t border-white/60 flex items-center gap-4 shrink-0 relative z-10">
                                <button onClick={() => setShowAddCustomerModal(false)} className="flex-1 py-4 text-xs font-bold text-[#897a70] uppercase tracking-wider hover:text-[#2D241E]">Abort_Onboarding</button>
                                <button onClick={handleAddNewCustomer} className="flex-[2] py-4 bg-[#2D241E] text-white rounded-[1.25rem] text-xs font-bold uppercase tracking-wider shadow-2xl shadow-black/20 hover:bg-black transition-all flex items-center justify-center gap-3">
                                    <span className="material-symbols-outlined text-[18px] text-emerald-400">deployed_code</span>Deploy_Node
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }
        </div >
    );
};

export default AdminCustomers;
