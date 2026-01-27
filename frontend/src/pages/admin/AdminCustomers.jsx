import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
    const [customers, setCustomers] = useState(initialCustomersData);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [filter, setFilter] = useState('All');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [modalTab, setModalTab] = useState('Vitals');
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
    const [newCustomerData, setNewCustomerData] = useState({
        name: '',
        email: '',
        phone: '',
        plan: 'None',
        address: ''
    });

    const handleAddNewCustomer = (e) => {
        console.log("handleAddNewCustomer called");
        try {
            if (e && e.preventDefault) e.preventDefault();
            const form = formRef.current;
            if (!form) {
                console.error("Form Ref is null!");
                toast.error("Internal Error: Form not found");
                return;
            }

            // Immediate feedback
            const procToast = toast.loading("Onboarding customer...");

            const name = form.elements['name']?.value;
            if (!name) {
                toast.dismiss(procToast);
                toast.error("Customer Name is required");
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
                kyc: 'Pending',
                tags: ['New'],
                tickets: 0,
                referrals: 0
            };

            setCustomers(prev => [...prev, newCustomer]);

            toast.dismiss(procToast);
            toast.success(`User ${newCustomer.name} onboarded successfully!`, {
                icon: '🚀',
                style: { borderRadius: '10px', background: '#2D241E', color: '#fff' }
            });
            setShowAddCustomerModal(false);
            // Reset logic if needed, but closing modal handles it
        } catch (err) {
            console.error("Add Customer Logic Error:", err);
            toast.error("Error: " + err.message);
        }
    };

    const handleAction = (type, name) => {
        toast.success(`${type} action triggered for ${name}`, {
            style: { borderRadius: '10px', background: '#2D241E', color: '#fff', fontSize: '10px' }
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
        toast.loading(`Securely logging in as ${name}...`, { duration: 1000 });

        // Simulate authentication token process
        setTimeout(() => {
            // Set session data for impersonation
            localStorage.setItem('userRole', 'customer');
            localStorage.setItem('userName', name);
            localStorage.setItem('impersonationMode', 'true');

            toast.dismiss(); // Dismiss loading
            toast.success(`Welcome to ${name}'s Dashboard`, {
                icon: '🚀',
                style: { borderRadius: '10px', background: '#2D241E', color: '#fff' }
            });

            // Redirect to customer dashboard
            navigate('/customer/dashboard');
        }, 1000);
    };

    const filteredCustomers = customers.filter(cus => {
        const matchesSearch = cus.name.toLowerCase().includes(searchQuery.toLowerCase()) || cus.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'All' || cus.status === filter;
        return matchesSearch && matchesFilter;
    });

    const handleUpdateCustomer = (e) => {
        console.log("handleUpdateCustomer called");
        try {
            if (e && e.preventDefault) e.preventDefault();
            const form = formRef.current;
            if (!form) return;

            const procToast = toast.loading("Updating profile...");

            const updatedCustomer = {
                ...editingCustomer,
                name: form.elements['name']?.value,
                email: form.elements['email']?.value,
                phone: form.elements['phone']?.value,
                address: form.elements['address']?.value,
                status: form.elements['status']?.value,
                kyc: form.elements['kyc']?.value,
                // Tags logic needs to be handled separately as it's not a standard input, 
                // but for now we keep existing tags from state
            };

            setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? updatedCustomer : c));

            toast.dismiss(procToast);
            toast.success(`Profile updated for ${updatedCustomer.name}`, {
                icon: '✅',
                style: { borderRadius: '10px', background: '#2D241E', color: '#fff' }
            });
            setEditingCustomer(null);
        } catch (err) {
            console.error("Update Logic Error:", err);
            toast.error("Failed to update.");
        }
    };

    return (
        <div className="space-y-4 max-w-[1600px] mx-auto min-h-full pb-6 animate-[fadeIn_0.5s]">

            {/* Live Ticker */}
            <div className="w-full bg-[#2D241E] text-white overflow-hidden py-1.5 rounded-xl shadow-lg flex items-center gap-4 px-4 relative z-0">
                <div className="flex items-center gap-1 shrink-0 z-10 bg-[#2D241E] pr-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Live</span>
                </div>
                <div className="flex gap-8 animate-[marquee_20s_linear_infinite] whitespace-nowrap opacity-80 hover:opacity-100 transition-opacity">
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

            {/* 1. Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black text-[#2D241E] tracking-tight flex items-center gap-2">
                        Customer Management
                        <span className="px-2 py-0.5 bg-blue-500 text-white text-[9px] font-black rounded-lg uppercase tracking-wider">Users</span>
                    </h2>
                    <p className="text-[#5C4D42] text-xs font-medium opacity-80 mt-0.5">Manage subscriptions, profiles, and billing for all users.</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleAction('Export', 'Customer List')}
                        className="flex items-center gap-2 px-3 py-2 bg-white text-[#5C4D42] rounded-xl border border-gray-200 text-[10px] font-bold hover:border-blue-500 hover:text-blue-600 transition-all"
                    >
                        <span className="material-symbols-outlined text-[16px]">file_download</span>
                        Export CSV
                    </button>
                    <button
                        onClick={() => setShowAddCustomerModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#2D241E] text-white rounded-xl text-[10px] font-bold hover:bg-[#453831] shadow-lg shadow-[#2D241E]/10 transition-all"
                    >
                        <span className="material-symbols-outlined text-[16px]">person_add</span>
                        Add New Customer
                    </button>
                </div>
            </div>

            {/* 2. Executive Stats & Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Active Users', val: '1,248', sub: '+12% this month', icon: 'groups', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Avg Life Value', val: '₹14.2k', sub: 'CLV per customer', icon: 'leaderboard', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Churn Rate', val: '2.4%', sub: '-0.5% vs last qtr', icon: 'trending_down', color: 'text-rose-500', bg: 'bg-rose-50' },
                    { label: 'Growth Score', val: '98.2', sub: 'Health Index', icon: 'auto_graph', color: 'text-orange-500', bg: 'bg-orange-50' },
                ].map((s, i) => (
                    <div key={i} className="bg-white/70 backdrop-blur-xl p-5 rounded-[2rem] border border-white/60 shadow-sm group hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <div className={`size-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center`}>
                                <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                            </div>
                            <span className="text-[9px] font-black text-[#897a70] uppercase tracking-widest leading-none mt-1">{s.label}</span>
                        </div>
                        <h3 className="text-2xl font-black text-[#2D241E] tracking-tighter mt-4">{s.val}</h3>
                        <p className="text-[10px] font-bold text-[#897a70] mt-1">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* 3. Search & Bulk Action Bar */}
            <div className="flex flex-col lg:flex-row items-center gap-4">
                {/* Search & Filter */}
                <div className="flex-1 w-full bg-white/70 backdrop-blur-xl p-2.5 rounded-[1.75rem] border border-white/60 shadow-sm flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
                        <input
                            type="text"
                            placeholder="Find customers by name, phone or subscription ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl text-xs font-medium focus:ring-2 focus:ring-[#2D241E]/10 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-1.5 p-1 bg-gray-50 rounded-2xl overflow-x-auto w-full sm:w-auto">
                        {['All', 'Active', 'Paused', 'Inactive'].map(t => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className={`px-4 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all ${filter === t ? 'bg-[#2D241E] text-white shadow-lg' : 'text-[#897a70] hover:text-[#2D241E]'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bulk Action Bar - Animated */}
                {selectedIds.length > 0 && (
                    <div className="w-full lg:w-auto animate-[slideInRight_0.3s] bg-[#2D241E] p-3 rounded-[1.75rem] flex items-center gap-4 px-6 shadow-2xl shadow-black/20">
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest whitespace-nowrap">
                            <span className="text-white">{selectedIds.length}</span> Selected
                        </p>
                        <div className="h-6 w-px bg-white/10 mx-1"></div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleAction('Notify', 'Selected')} className="size-9 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-blue-500 transition-all" title="Send Notification">
                                <span className="material-symbols-outlined text-[18px]">notifications</span>
                            </button>
                            <button onClick={() => handleAction('Pause', 'Selected')} className="size-9 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-orange-500 transition-all" title="Pause Subscriptions">
                                <span className="material-symbols-outlined text-[18px]">pause_circle</span>
                            </button>
                            <button onClick={() => setSelectedIds([])} className="size-9 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-red-500 transition-all" title="Deselect All">
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 3. Customer Table */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[1.75rem] border border-white/60 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/50 border-b border-gray-100">
                                <th className="px-6 py-4 w-10">
                                    <button onClick={toggleSelectAll} className="size-5 rounded border-2 border-gray-200 flex items-center justify-center hover:border-[#2D241E] transition-all">
                                        {selectedIds.length === filteredCustomers.length && selectedIds.length > 0 && <div className="size-2.5 bg-[#2D241E] rounded-sm"></div>}
                                    </button>
                                </th>
                                <th className="px-6 py-4 text-[10px] font-black text-[#5C4D42] uppercase tracking-wider">Identity & Trust</th>
                                <th className="px-1 py-4 text-[10px] font-black text-[#5C4D42] uppercase tracking-wider">Subscription</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[#5C4D42] uppercase tracking-wider">Wallet & KYC</th>
                                <th className="px-6 py-4 text-[10px] font-black text-[#5C4D42] uppercase tracking-wider text-right">Admin Controls</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((cus) => (
                                    <tr key={cus.id} className={`group hover:bg-white/60 transition-colors ${selectedIds.includes(cus.id) ? 'bg-blue-50/40' : ''}`}>
                                        <td className="px-6 py-4">
                                            <button onClick={() => toggleSelect(cus.id)} className={`size-5 rounded border-2 transition-all flex items-center justify-center ${selectedIds.includes(cus.id) ? 'border-[#2D241E] bg-[#2D241E]' : 'border-gray-200 hover:border-[#2D241E]'}`}>
                                                {selectedIds.includes(cus.id) && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <div className="size-11 rounded-[1.25rem] bg-[#2D241E] text-white flex items-center justify-center text-sm font-black italic shadow-lg shadow-black/5 overflow-hidden">
                                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${cus.name}`} alt="" className="size-10 translate-y-2" />
                                                    </div>
                                                    {cus.kyc === 'Verified' && (
                                                        <div className="absolute -top-1 -right-1 size-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg" title="Identity Verified">
                                                            <span className="material-symbols-outlined text-white text-[12px] font-bold">verified</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-black text-[#2D241E]">{cus.name}</p>
                                                        {cus.tags.includes('VIP') && (
                                                            <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[8px] font-black rounded uppercase">VIP</span>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] text-[#897a70] font-medium">{cus.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-1 py-4">
                                            <div className="flex flex-col">
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg w-fit uppercase tracking-wider ${cus.plan === 'None' ? 'bg-gray-100 text-gray-500' : 'bg-orange-100 text-orange-600'}`}>
                                                    {cus.plan}
                                                </span>
                                                <div className="flex items-center gap-1.5 mt-1.5">
                                                    <span className={`size-1.5 rounded-full ${cus.status === 'Active' ? 'bg-emerald-500' : cus.status === 'Paused' ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                                                    <span className="text-[9px] font-bold text-[#897a70] uppercase tracking-tight">{cus.status}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <p className="text-xs font-black text-[#2D241E]">{cus.balance}</p>
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <span className={`text-[9px] font-black uppercase tracking-tight ${cus.kyc === 'Verified' ? 'text-blue-600' : cus.kyc === 'Pending' ? 'text-amber-600' : 'text-gray-400'}`}>KYC {cus.kyc}</span>
                                                    {cus.tickets > 0 && (
                                                        <span className="text-[9px] bg-rose-50 text-rose-500 px-1 rounded font-black tracking-tight">• {cus.tickets} Open Tickets</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleLoginAs(cus.name)}
                                                    className="size-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center hover:bg-violet-600 hover:text-white transition-all shadow-sm"
                                                    title="Login as User"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">point_of_sale</span>
                                                </button>
                                                <button
                                                    onClick={() => setEditingCustomer(cus)}
                                                    className="size-8 rounded-xl bg-gray-50 text-[#5C4D42] flex items-center justify-center hover:bg-[#2D241E] hover:text-white transition-all shadow-sm"
                                                    title="Edit Profile"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">edit_square</span>
                                                </button>
                                                <button
                                                    onClick={() => setSelectedCustomer(cus)}
                                                    className="size-8 rounded-xl bg-[#2D241E] text-white flex items-center justify-center hover:bg-orange-600 transition-all shadow-lg shadow-black/10"
                                                    title="View DNA"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">account_circle</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        toast((t) => (
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-xs font-bold text-[#2D241E]">Delete {cus.name}?</span>
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => {
                                                                            setCustomers(prev => prev.filter(c => c.id !== cus.id));
                                                                            toast.dismiss(t.id);
                                                                            toast.success("Profile Deleted", { icon: '🗑️', style: { borderRadius: '10px', background: '#2D241E', color: 'white', fontSize: '12px' } });
                                                                        }}
                                                                        className="px-2 py-1 bg-rose-500 text-white text-[10px] font-bold rounded-lg"
                                                                    >
                                                                        Yes
                                                                    </button>
                                                                    <button onClick={() => toast.dismiss(t.id)} className="px-2 py-1 bg-gray-100 text-[#2D241E] text-[10px] font-bold rounded-lg">No</button>
                                                                </div>
                                                            </div>
                                                        ), { duration: 4000 });
                                                    }}
                                                    className="size-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                    title="Delete Customer"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-60">
                                            <div className="size-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                <span className="material-symbols-outlined text-4xl text-gray-300">search_off</span>
                                            </div>
                                            <p className="text-sm font-black text-[#2D241E]">No customers found</p>
                                            <p className="text-[11px] font-bold text-[#897a70] mt-1">Try adjusting your search or filters</p>
                                            <button onClick={() => { setSearchQuery(''); setFilter('All'); }} className="mt-4 px-4 py-2 bg-gray-100 text-[#5C4D42] rounded-xl text-[10px] font-bold hover:bg-gray-200 transition-all">
                                                Clear Filters
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 4. Pagination Placeholder */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white/30">
                    <p className="text-[10px] font-bold text-[#897a70]">Showing 5 of 1,248 customers</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-bold text-[#5C4D42] opacity-50 cursor-not_allowed">Prev</button>
                        <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-[#2D241E] hover:border-blue-500 transition-all">Next</button>
                    </div>
                </div>
            </div>

            {/* Customer Detail Modal - [POLISHED & FUNCTIONAL] */}
            {selectedCustomer && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2D241E]/80 backdrop-blur-md animate-[fadeIn_0.3s]" onClick={() => setSelectedCustomer(null)}></div>
                    <div className="bg-white rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl animate-[scaleIn_0.3s] relative z-10 border border-white/20 flex flex-col max-h-[92vh]">

                        {/* Modal Header */}
                        <div className="p-8 pb-4 flex justify-between items-start shrink-0">
                            <div>
                                <h3 className="text-2xl font-black text-[#2D241E] tracking-tight">Customer DNA</h3>
                                <p className="text-[11px] font-bold text-[#897a70] mt-1">Manage individual preferences, history & operations</p>
                            </div>
                            <button onClick={() => setSelectedCustomer(null)} className="size-9 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all">
                                <span className="material-symbols-outlined text-[18px] text-[#5C4D42]">close</span>
                            </button>
                        </div>

                        {/* Modal Content - Single View (Reference Image Match) */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-4 space-y-6">

                            {/* Profile Identification Card */}
                            <div className="p-5 bg-[#FDFBF9] border border-orange-100/50 rounded-[2.5rem] flex items-center gap-6 shadow-sm">
                                <div className="relative">
                                    <div className="size-20 rounded-2xl bg-[#2D241E] overflow-hidden shadow-lg border-2 border-white">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedCustomer.name}`} alt="" className="size-full object-cover translate-y-2" />
                                    </div>
                                    <div className={`absolute -bottom-2 -left-2 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase border-2 border-white shadow-sm ${selectedCustomer.status === 'Active' ? 'bg-emerald-500' : selectedCustomer.status === 'Paused' ? 'bg-amber-500' : 'bg-rose-500'}`}>
                                        {selectedCustomer.status}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xl font-black text-[#2D241E] tracking-tight">{selectedCustomer.name}</h4>
                                        <button onClick={() => toast.success('Preferences updated')} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black border border-blue-100 hover:bg-blue-100 transition-colors flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">shield</span>
                                            Leave at Guard
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#897a70]">
                                            <span className="material-symbols-outlined text-[14px]">call</span>
                                            {selectedCustomer.phone}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#897a70]">
                                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                            Joined {selectedCustomer.joins}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Eating History Section */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-2">
                                    <h4 className="text-[11px] font-black text-[#2D241E] flex items-center gap-2">
                                        <span className="material-symbols-outlined text-orange-500 text-[18px]">history</span>
                                        Eating History
                                    </h4>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#897a70]">
                                            <span className="size-2 rounded-full bg-emerald-500"></span> Consumed
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#897a70]">
                                            <span className="size-2 rounded-full bg-rose-500"></span> Skipped
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-[2.5rem] relative shadow-inner">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[8px] font-black text-[#897a70] uppercase tracking-tighter">LAST 30 DAYS</span>
                                        <span className="text-[8px] font-black text-[#897a70] uppercase tracking-tighter italic">January 2024</span>
                                    </div>
                                    <div className="grid grid-cols-10 gap-2">
                                        {[...Array(30)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-4 rounded-md shadow-sm transition-all hover:scale-110 cursor-help ${i > 22 ? 'bg-gray-100' :
                                                    [3, 7, 14, 19].includes(i) ? 'bg-rose-500' : 'bg-emerald-500'
                                                    }`}
                                            ></div>
                                        ))}
                                    </div>
                                    <div className="mt-4 text-right">
                                        <p className="text-[9px] font-black text-[#897a70] italic">3 skips this month</p>
                                    </div>
                                </div>
                            </div>

                            {/* Smart Actions Section */}
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-black text-[#2D241E] flex items-center gap-2 px-2">
                                    <span className="material-symbols-outlined text-orange-500 text-[18px]">bolt</span>
                                    Smart Actions
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Pause Card */}
                                    <div className="p-5 bg-[#FFFCE8] border border-yellow-100 rounded-[2.5rem] space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 bg-white rounded-2xl flex items-center justify-center text-yellow-600 shadow-sm">
                                                <span className="material-symbols-outlined text-[20px]">pause</span>
                                            </div>
                                            <p className="text-[11px] font-black text-[#2D241E]">Pause Subscription</p>
                                        </div>
                                        <div className="space-y-1 bg-white/50 p-3 rounded-xl border border-yellow-200/50">
                                            <p className="text-[8px] font-black text-[#897a70] uppercase">Select Range</p>
                                            <div className="flex items-center justify-between text-[10px] font-bold text-[#2D241E]">
                                                <span>Today</span>
                                                <span className="material-symbols-outlined text-[12px] text-[#897a70]">arrow_forward</span>
                                                <span className="text-[#897a70] border-b border-dashed border-gray-400 cursor-pointer">Select Date</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const newStatus = selectedCustomer.status === 'Paused' ? 'Active' : 'Paused';
                                                const updatedCustomer = { ...selectedCustomer, status: newStatus };
                                                setSelectedCustomer(updatedCustomer);
                                                setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
                                                toast.success(`Subscription ${newStatus === 'Paused' ? 'Paused' : 'Resumed'}`, {
                                                    icon: newStatus === 'Paused' ? '⏸️' : '▶️',
                                                    style: { borderRadius: '10px', background: '#2D241E', color: '#fff', fontSize: '10px' }
                                                });
                                            }}
                                            className={`w-full py-4 text-white rounded-2xl text-[10px] font-black shadow-lg transition-all ${selectedCustomer.status === 'Paused' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'}`}
                                        >
                                            {selectedCustomer.status === 'Paused' ? 'Resume Subscription' : 'Apply Pause'}
                                        </button>
                                    </div>

                                    {/* Refund Card */}
                                    <div className="p-5 bg-rose-50 border border-rose-100 rounded-[2.5rem] space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm">
                                                <span className="material-symbols-outlined text-[20px]">cancel</span>
                                            </div>
                                            <p className="text-[11px] font-black text-[#2D241E]">Cancel & Refund</p>
                                        </div>
                                        <div className="bg-white/50 p-3 rounded-xl border border-rose-200/50 flex justify-between items-center">
                                            <div className="space-y-0.5">
                                                <p className="text-[8px] font-black text-[#897a70] uppercase">REFUND AMOUNT</p>
                                                <p className="text-[9px] font-bold text-[#2D241E]">Pro-rata basis</p>
                                            </div>
                                            <p className="text-xl font-black text-rose-500 italic leading-none">₹450</p>
                                        </div>
                                        <button onClick={() => toast.error('Initiated Refund Process')} className="w-full py-4 bg-white border border-rose-200 text-rose-500 rounded-2xl text-[10px] font-black hover:bg-rose-500 hover:text-white transition-all shadow-sm">Process Cancellation</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 pb-10 bg-white border-t border-gray-50 flex items-center justify-end gap-10 shrink-0">
                            <button onClick={() => setSelectedCustomer(null)} className="text-[12px] font-black text-[#897a70] hover:text-[#2D241E] transition-colors">Close</button>
                            <button onClick={() => {
                                setCustomers(prev => prev.map(c => c.id === selectedCustomer.id ? selectedCustomer : c));
                                toast.success('Changes Saved', {
                                    icon: '💾',
                                    style: { borderRadius: '10px', background: '#FF5722', color: '#fff', fontSize: '10px' }
                                });
                                setSelectedCustomer(null);
                            }} className="px-12 py-5 bg-[#FF5722] text-white rounded-[1.5rem] text-[12px] font-black shadow-[0_10px_25px_-5px_rgba(255,87,34,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all">Save Changes</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}


            {/* Edit Customer Modal - [POLISHED & FUNCTIONAL] */}
            {
                editingCustomer && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#2D241E]/80 backdrop-blur-md animate-[fadeIn_0.3s]" onClick={() => setEditingCustomer(null)}></div>
                        <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl animate-[scaleIn_0.3s] relative z-10 border border-white/20 flex flex-col max-h-[90vh]">

                            {/* Header */}
                            <div className="p-8 pb-2 flex justify-between items-start shrink-0">
                                <div>
                                    <h3 className="text-2xl font-black text-[#2D241E] tracking-tight">Edit Profile</h3>
                                    <p className="text-[11px] font-bold text-[#897a70] mt-1">Operational Control Mode</p>
                                </div>
                                <button onClick={() => setEditingCustomer(null)} className="size-9 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all">
                                    <span className="material-symbols-outlined text-[18px] text-[#5C4D42]">close</span>
                                </button>
                            </div>

                            <form ref={formRef} className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">

                                {/* Profile Summary Card (DNA Style) */}
                                <div className="p-5 bg-[#FDFBF9] border border-orange-100/50 rounded-[2.5rem] flex items-center gap-6 shadow-sm">
                                    <div className="relative">
                                        <div className="size-16 rounded-2xl bg-[#2D241E] overflow-hidden shadow-lg border-2 border-white">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${editingCustomer.name}`} alt="" className="size-full object-cover translate-y-1" />
                                        </div>
                                        <div className={`absolute -bottom-1.5 -left-1.5 text-white text-[8px] font-black px-2 py-0.5 rounded-lg uppercase border-2 border-white shadow-sm ${editingCustomer.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                                            {editingCustomer.id}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-[#2D241E] tracking-tight">{editingCustomer.name}</h4>
                                        <p className="text-[10px] font-bold text-[#897a70]">{editingCustomer.email}</p>
                                    </div>
                                </div>

                                {/* Section 1: Identity & Contact */}
                                <div className="space-y-4">
                                    <h4 className="text-[11px] font-black text-[#2D241E] flex items-center gap-2 uppercase tracking-widest px-1">
                                        <span className="material-symbols-outlined text-orange-500 text-[18px]">badge</span>
                                        Identity Details
                                    </h4>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-[#897a70] uppercase ml-3 tracking-widest">Full Name</label>
                                            <input
                                                name="name"
                                                type="text"
                                                defaultValue={editingCustomer.name}
                                                className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-[#897a70] uppercase ml-3 tracking-widest">Phone Number</label>
                                            <input
                                                name="phone"
                                                type="text"
                                                defaultValue={editingCustomer.phone || ''}
                                                className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-[#897a70] uppercase ml-3 tracking-widest">Email Address</label>
                                        <input
                                            name="email"
                                            type="email"
                                            defaultValue={editingCustomer.email}
                                            className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Section 2: Logistics */}
                                <div className="space-y-4">
                                    <h4 className="text-[11px] font-black text-[#2D241E] flex items-center gap-2 uppercase tracking-widest px-1">
                                        <span className="material-symbols-outlined text-orange-500 text-[18px]">pin_drop</span>
                                        Logistics
                                    </h4>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-[#897a70] uppercase ml-3 tracking-widest">Delivery Address</label>
                                        <textarea
                                            name="address"
                                            defaultValue={editingCustomer.address || ''}
                                            className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3.5 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none h-24 resize-none leading-relaxed"
                                            placeholder="Enter full delivery address..."
                                        />
                                    </div>
                                </div>

                                {/* Section 3: Operations & Status */}
                                <div className="space-y-4">
                                    <h4 className="text-[11px] font-black text-[#2D241E] flex items-center gap-2 uppercase tracking-widest px-1">
                                        <span className="material-symbols-outlined text-orange-500 text-[18px]">tune</span>
                                        Operations
                                    </h4>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-[#897a70] uppercase ml-3 tracking-widest">Status</label>
                                            <div className="relative">
                                                <select
                                                    name="status"
                                                    defaultValue={editingCustomer.status}
                                                    className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none appearance-none cursor-pointer"
                                                >
                                                    {['Active', 'Paused', 'Inactive'].map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-[18px] pointer-events-none">expand_more</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-[#897a70] uppercase ml-3 tracking-widest">KYC Level</label>
                                            <div className="relative">
                                                <select
                                                    name="kyc"
                                                    defaultValue={editingCustomer.kyc}
                                                    className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none appearance-none cursor-pointer"
                                                >
                                                    {['Verified', 'Pending', 'Not Started', 'Rejected'].map(k => <option key={k} value={k}>{k}</option>)}
                                                </select>
                                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-[18px] pointer-events-none">expand_more</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-[#897a70] uppercase ml-3 tracking-widest">Tags</label>
                                        <div className="flex flex-wrap gap-2 p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                                            {['VIP', 'Frequent', 'Regular', 'New', 'Trial', 'Problematic'].map(t => (
                                                <button
                                                    key={t}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        const newTags = editingCustomer.tags.includes(t)
                                                            ? editingCustomer.tags.filter(tag => tag !== t)
                                                            : [...editingCustomer.tags, t];
                                                        setEditingCustomer({ ...editingCustomer, tags: newTags });
                                                    }}
                                                    className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all ${editingCustomer.tags.includes(t) ? 'bg-[#2D241E] text-white shadow-md' : 'bg-white text-[#897a70] border border-gray-200 hover:border-orange-200 hover:text-[#2D241E]'}`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </form>

                            <div className="flex gap-4 p-8 pt-0 shrink-0 border-t border-gray-50 mt-4 pt-6 bg-white z-10">
                                <button onClick={() => setEditingCustomer(null)} className="flex-1 py-4 rounded-2xl text-xs font-black text-[#897a70] hover:bg-gray-50 transition-all uppercase tracking-widest">Discard</button>
                                <button
                                    type="button"
                                    onClick={handleUpdateCustomer}
                                    className="flex-[2] py-4 bg-[#2D241E] text-white rounded-[1.5rem] text-xs font-black shadow-[0_10px_25px_-5px_rgba(45,36,30,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(45,36,30,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">sync</span>
                                    Sync Profile
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }

            {/* Add Customer Modal - [NEW & POLISHED] */}
            {
                showAddCustomerModal && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-[#2D241E]/80 backdrop-blur-md animate-[fadeIn_0.3s]" onClick={() => setShowAddCustomerModal(false)}></div>
                        <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl animate-[scaleIn_0.3s] relative z-10 border border-white/20 flex flex-col max-h-[90vh]">

                            {/* Header - Clean & White */}
                            <div className="p-8 pb-2 flex justify-between items-start shrink-0">
                                <div>
                                    <h3 className="text-2xl font-black text-[#2D241E] tracking-tight">Onboard New User</h3>
                                    <p className="text-[11px] font-bold text-[#897a70] mt-1">Manual entry protocol for offline/support cases</p>
                                </div>
                                <button onClick={() => setShowAddCustomerModal(false)} className="size-9 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all">
                                    <span className="material-symbols-outlined text-[18px] text-[#5C4D42]">close</span>
                                </button>
                            </div>

                            <form ref={formRef} className="p-8 space-y-6 overflow-y-auto flex-1">
                                {/* Profile Section */}
                                <div className="flex gap-6 items-start">
                                    <div className="size-20 bg-gray-50 rounded-[1.5rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 gap-1 hover:border-orange-200 hover:text-orange-500 hover:bg-orange-50 transition-all cursor-pointer">
                                        <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
                                        <span className="text-[8px] font-black uppercase">Photo</span>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-[#2D241E] uppercase ml-1 tracking-widest">Full Name</label>
                                            <input
                                                name="name"
                                                type="text"
                                                required
                                                placeholder="e.g. Aditi Sharma"
                                                className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3.5 rounded-2xl text-sm font-bold text-[#2D241E] focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none placeholder:text-gray-300"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-[#2D241E] uppercase ml-1 tracking-widest">Email Address</label>
                                        <input
                                            name="email"
                                            type="email"
                                            placeholder="user@example.com"
                                            className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3.5 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none placeholder:text-gray-300"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-[#2D241E] uppercase ml-1 tracking-widest">Phone Number</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400">+91</span>
                                            <input
                                                name="phone"
                                                type="tel"
                                                placeholder="98765 43210"
                                                className="w-full bg-gray-50/50 border border-gray-100 pl-12 pr-5 py-3.5 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none placeholder:text-gray-300"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-[#2D241E] uppercase ml-1 tracking-widest">Initial Plan</label>
                                        <div className="relative">
                                            <select
                                                name="plan"
                                                className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3.5 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none appearance-none cursor-pointer"
                                            >
                                                <option value="None">No Plan (Pay as you go)</option>
                                                <option value="Weekly Veg">Weekly Veg</option>
                                                <option value="Monthly Veg">Monthly Veg</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-[18px] pointer-events-none">expand_more</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-[#2D241E] uppercase ml-1 tracking-widest">Area/Locality</label>
                                        <input
                                            name="address"
                                            type="text"
                                            placeholder="e.g. Vijay Nagar"
                                            className="w-full bg-gray-50/50 border border-gray-100 px-5 py-3.5 rounded-2xl text-xs font-bold text-[#2D241E] focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none placeholder:text-gray-300"
                                        />
                                    </div>
                                </div>
                            </form>

                            <div className="flex gap-4 p-8 pt-0 shrink-0 border-t border-gray-50 mt-4 pt-6 bg-white z-10">
                                <button onClick={() => setShowAddCustomerModal(false)} className="flex-1 py-4 rounded-2xl text-xs font-black text-[#897a70] hover:bg-gray-50 transition-all uppercase tracking-widest">Discard</button>
                                <button
                                    type="button"
                                    onClick={handleAddNewCustomer}
                                    className="flex-[2] py-4 bg-[#2D241E] text-white rounded-[1.5rem] text-xs font-black shadow-[0_10px_25px_-5px_rgba(45,36,30,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(45,36,30,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                    Onboard User
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
