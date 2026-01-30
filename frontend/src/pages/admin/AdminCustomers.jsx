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
    const [stats, setStats] = useState({
        totalCustomers: 0,
        activeCustomers: 0,
        totalBalance: 0,
        newToday: 0
    });
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
                if (data.stats) {
                    setStats(data.stats);
                }
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
            toast.success(`Customer ${newCustomer.name} added successfully`, {
                style: { borderRadius: '15px', background: '#2D241E', color: '#fff' }
            });
            setShowAddCustomerModal(false);
        } catch (err) {
            toast.error("Failed to add customer");
        }
    };

    const handleAction = async (type, customer) => {
        const token = localStorage.getItem('token');
        const customerId = customer._id || customer.id;

        try {
            if (type === 'Ban' || type === 'Unban') {
                const res = await axios.put(
                    `http://localhost:5000/api/admin/customers/${customerId}/status`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.data.success) {
                    fetchCustomers();
                    toast.success(res.data.message, {
                        style: { borderRadius: '15px', background: '#2D241E', color: '#fff' }
                    });
                }
            } else if (type === 'Delete') {
                if (!window.confirm(`Are you sure you want to delete ${customer.fullName || customer.name}?`)) return;

                const res = await axios.delete(
                    `http://localhost:5000/api/admin/customers/${customerId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.data.success) {
                    fetchCustomers();
                    toast.success('Customer deleted', {
                        style: { borderRadius: '15px', background: '#2D241E', color: '#fff' }
                    });
                }
            } else {
                toast.success(`${type} done for ${customer.fullName || customer.name}`, {
                    style: { borderRadius: '15px', background: '#2D241E', color: '#fff' }
                });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${type.toLowerCase()}`);
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredCustomers.length) setSelectedIds([]);
        else setSelectedIds(filteredCustomers.map(c => c.id));
    };

    const handleLoginAs = (name) => {
        toast.loading(`Logging in as ${name}...`, { duration: 1000 });
        setTimeout(() => {
            localStorage.setItem('userRole', 'customer');
            localStorage.setItem('userName', name);
            localStorage.setItem('impersonationMode', 'true');
            toast.dismiss();
            toast.success(`Logged in as ${name}`, {
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

    const handleUpdateCustomer = async (e) => {
        try {
            if (e && e.preventDefault) e.preventDefault();
            const form = formRef.current;
            if (!form) return;

            const procToast = toast.loading("Saving changes...");
            const token = localStorage.getItem('token');

            const updateData = {
                fullName: form.elements['name']?.value,
                email: form.elements['email']?.value,
                mobile: form.elements['phone']?.value,
                address: form.elements['address']?.value,
            };

            const res = await axios.put(
                `http://localhost:5000/api/admin/customers/${editingCustomer._id || editingCustomer.id}`,
                updateData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                // Refresh the customer list
                fetchCustomers();
                toast.dismiss(procToast);
                toast.success(`Customer updated successfully`, {
                    style: { borderRadius: '15px', background: '#2D241E', color: '#fff' }
                });
                setEditingCustomer(null);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save");
        }
    };


    return (
        <div className="space-y-6 max-w-[1600px] mx-auto min-h-screen pb-10 relative">

            {/* Header Block */}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-[#2D241E] tracking-tight uppercase">Customers</h1>
                        <span className="px-2 py-0.5 bg-[#2D241E] text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-lg shadow-black/10">Active List</span>
                    </div>
                    <p className="text-[#897a70] text-xs font-bold uppercase tracking-wider opacity-60">Manage all your members and their profiles in one place</p>
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
                {[
                    { label: 'Total Customers', val: stats.totalCustomers, trend: 'TOTAL', icon: 'groups', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Active Members', val: stats.activeCustomers, trend: 'ACTIVE', icon: 'person_check', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Total Balance', val: `₹${stats.totalBalance}`, trend: 'WALLET', icon: 'payments', color: 'text-rose-500', bg: 'bg-rose-50' },
                    { label: 'New Today', val: stats.newToday, trend: 'NEW', icon: 'person_add', color: 'text-orange-500', bg: 'bg-orange-50' },
                ].map((s, i) => (
                    <div key={i} className="bg-white/70 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/60 shadow-lg group hover:-translate-y-1 transition-all duration-500 relative overflow-hidden h-[160px] flex flex-col justify-center">
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
                ))}
            </div>

            {/* Search & Bulk Action Bar */}
            <div className="flex flex-col lg:flex-row items-center gap-5">
                <div className="flex-1 w-full bg-white/70 backdrop-blur-xl p-3 rounded-[2.5rem] border border-white/60 shadow-lg flex flex-col sm:flex-row items-center gap-4 group-focus-within:border-orange-500/20 transition-all">
                    <div className="relative flex-1 w-full group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#897a70] text-[18px] group-focus-within:text-orange-500 transition-colors">search</span>
                        <input
                            type="text"
                            placeholder="Search by Name, Email, or Phone..."
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
                                <p className="text-xs font-bold text-white leading-tight uppercase tracking-wider">{selectedIds.length} Selected</p>
                                <p className="text-xs font-bold text-orange-400 uppercase tracking-wider">Actions</p>
                            </div>
                            <div className="h-8 w-px bg-white/10"></div>
                            <div className="flex items-center gap-3">
                                {[
                                    { icon: 'notifications', col: 'hover:bg-blue-600', action: 'Notify' },
                                    { icon: 'pause_circle', col: 'hover:bg-orange-600', action: 'Pause' },
                                    { icon: 'delete', col: 'hover:bg-rose-600', action: 'Remove' },
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
            </div>

            {/* Customer Table */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-lg overflow-hidden mt-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[11px] font-bold text-[#5C4D42] uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-[#5C4D42] uppercase tracking-wider">Plan & Status</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-[#5C4D42] uppercase tracking-wider">Balance</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-[#5C4D42] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((cus) => (
                                    <tr key={cus.id} className="group hover:bg-white/60 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-[1rem] bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-bold shadow-sm overflow-hidden">
                                                    {(cus?.name || 'U').charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-bold text-[#2D241E]">{cus.name}</p>
                                                        {cus.kyc === 'Verified' && (
                                                            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded uppercase bg-blue-100 text-blue-700">Verified</span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-[#897a70] font-bold">{cus.email}</p>
                                                    <p className="text-[10px] text-[#897a70] opacity-70 font-medium">{cus.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase w-fit ${cus.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : cus.status === 'Paused' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                                                    {cus.status}
                                                </span>
                                                <p className="text-xs font-bold text-[#2D241E]">{cus.plan || 'No Plan'}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 w-fit">
                                                {cus.balance}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleLoginAs(cus.name)}
                                                    className="size-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-all shadow-sm"
                                                    title="Login As User"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">key</span>
                                                </button>
                                                <button
                                                    onClick={() => setEditingCustomer(cus)}
                                                    className="size-8 rounded-xl bg-gray-50 text-[#5C4D42] flex items-center justify-center hover:bg-[#2D241E] hover:text-white transition-all shadow-sm"
                                                    title="Edit"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">edit_square</span>
                                                </button>
                                                <button
                                                    onClick={() => setSelectedCustomer(cus)}
                                                    className="size-8 rounded-xl bg-[#2D241E] text-white flex items-center justify-center hover:bg-orange-500 transition-all shadow-lg shadow-black/10"
                                                    title="View Details"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-60">
                                            <div className="size-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                <span className="material-symbols-outlined text-4xl text-gray-300">person_off</span>
                                            </div>
                                            <p className="text-base font-bold text-[#2D241E]">No customers found</p>
                                            <p className="text-xs text-[#897a70] mt-1">Try changing your search or filters</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* =========================================================================
                MODALS
            ========================================================================= */}

            {/* 1. Customer Profile Modal */}
            {
                selectedCustomer && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
                        {/* Dark overlay with blur */}
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedCustomer(null)}></div>

                        {/* Modal Container - Clean White */}
                        <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[85vh] animate-[slideUp_0.3s_ease-out]">

                            {/* Compact Light Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                                        {(selectedCustomer?.name || 'U').charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-gray-800">{selectedCustomer.name}</h3>
                                        <p className="text-xs text-gray-500">{selectedCustomer.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${selectedCustomer.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                        {selectedCustomer.status}
                                    </span>
                                    <button onClick={() => setSelectedCustomer(null)} className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-all text-gray-400 hover:text-gray-600">
                                        <span className="material-symbols-outlined text-[18px]">close</span>
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-5 overflow-y-auto flex-1">
                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: 'Balance', val: selectedCustomer.balance, icon: 'account_balance_wallet', color: 'bg-emerald-50 text-emerald-600' },
                                        { label: 'Plan', val: selectedCustomer.plan || 'None', icon: 'event_repeat', color: 'bg-blue-50 text-blue-600' },
                                        { label: 'KYC', val: selectedCustomer.kyc, icon: 'verified_user', color: 'bg-purple-50 text-purple-600' },
                                        { label: 'Phone', val: selectedCustomer.phone, icon: 'phone', color: 'bg-orange-50 text-orange-600' },
                                    ].map((stat, i) => (
                                        <div key={i} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={`size-7 rounded-lg ${stat.color} flex items-center justify-center`}>
                                                    <span className="material-symbols-outlined text-[14px]">{stat.icon}</span>
                                                </div>
                                                <span className="text-xs font-medium text-gray-500">{stat.label}</span>
                                            </div>
                                            <p className="text-sm font-bold text-gray-800 truncate">{stat.val}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Order History */}
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold text-gray-700">Order History (30 days)</span>
                                        <span className="text-xs text-emerald-600 font-bold">92% success</span>
                                    </div>
                                    <div className="flex gap-1">
                                        {[...Array(30)].map((_, i) => (
                                            <div key={i} className={`flex-1 h-6 rounded ${i > 24 ? 'bg-gray-200' : [4, 9, 15, 22].includes(i) ? 'bg-rose-400' : 'bg-emerald-400'}`}></div>
                                        ))}
                                    </div>
                                    <div className="flex gap-4 mt-2 text-[10px] text-gray-500">
                                        <span className="flex items-center gap-1"><span className="size-2 bg-emerald-400 rounded"></span>Delivered</span>
                                        <span className="flex items-center gap-1"><span className="size-2 bg-rose-400 rounded"></span>Skipped</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => {
                                            const newStatus = selectedCustomer.status === 'Paused' ? 'Active' : 'Paused';
                                            const updatedCustomer = { ...selectedCustomer, status: newStatus };
                                            setSelectedCustomer(updatedCustomer);
                                            setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
                                            toast.success(`Subscription ${newStatus === 'Paused' ? 'Paused' : 'Resumed'}`);
                                        }}
                                        className={`p-4 rounded-xl text-sm font-bold transition-all ${selectedCustomer.status === 'Paused' ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-amber-100 hover:bg-amber-200 text-amber-700'}`}
                                    >
                                        {selectedCustomer.status === 'Paused' ? '▶ Resume' : '⏸ Pause'}
                                    </button>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="± Amount" className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2D241E]/20" />
                                        <button onClick={() => toast.success('Balance updated')} className="px-4 bg-gray-800 text-white rounded-xl text-xs font-bold hover:bg-black transition-all">
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-gray-100 flex justify-between">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { handleAction(selectedCustomer.status === 'banned' ? 'Unban' : 'Ban', selectedCustomer); setSelectedCustomer(null); }}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${selectedCustomer.status === 'banned' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
                                    >
                                        {selectedCustomer.status === 'banned' ? 'Unban' : 'Ban'}
                                    </button>
                                    <button
                                        onClick={() => { handleAction('Delete', selectedCustomer); setSelectedCustomer(null); }}
                                        className="px-4 py-2 bg-rose-100 text-rose-700 rounded-lg text-xs font-bold hover:bg-rose-200 transition-all"
                                    >
                                        Delete
                                    </button>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setSelectedCustomer(null)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors">
                                        Close
                                    </button>
                                    <button onClick={() => { toast.success('Profile Saved'); setSelectedCustomer(null); }} className="px-5 py-2.5 bg-[#2D241E] text-white rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }

            {/* 2. Edit Profile Modal */}
            {
                editingCustomer && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditingCustomer(null)}></div>
                        <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[88vh]">

                            {/* Compact Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-gray-800">Edit Profile</h3>
                                    <p className="text-xs text-gray-500">Update customer information</p>
                                </div>
                                <button onClick={() => setEditingCustomer(null)} className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600">
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            </div>

                            <form ref={formRef} className="p-5 space-y-4 overflow-y-auto flex-1">
                                {/* User Info */}
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="size-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold">
                                        {(editingCustomer?.name || 'U').charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{editingCustomer.name}</p>
                                        <p className="text-xs text-gray-500">{editingCustomer.email}</p>
                                    </div>
                                    <span className="ml-auto text-xs text-gray-400">{editingCustomer.id}</span>
                                </div>

                                {/* Contact */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-semibold text-gray-700">Contact</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] font-medium text-gray-500 mb-1 block">Full Name</label>
                                            <input name="name" type="text" defaultValue={editingCustomer.name} className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-gray-400 transition-colors" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-medium text-gray-500 mb-1 block">Phone</label>
                                            <input name="phone" type="text" defaultValue={editingCustomer.phone || ''} className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-gray-400 transition-colors" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-medium text-gray-500 mb-1 block">Email</label>
                                        <input name="email" type="email" defaultValue={editingCustomer.email} className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-gray-400 transition-colors" />
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-semibold text-gray-700">Address</h4>
                                    <textarea name="address" defaultValue={editingCustomer.address || ''} className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-gray-400 transition-colors h-20 resize-none" placeholder="Enter delivery address..." />
                                </div>

                                {/* Tags */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-semibold text-gray-700">Tags</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['VIP', 'Frequent', 'Regular', 'New', 'Trial', 'At Risk'].map(t => (
                                            <button
                                                key={t}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const newTags = editingCustomer.tags.includes(t) ? editingCustomer.tags.filter(tag => tag !== t) : [...editingCustomer.tags, t];
                                                    setEditingCustomer({ ...editingCustomer, tags: newTags });
                                                }}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${editingCustomer.tags.includes(t) ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </form>

                            {/* Compact Footer */}
                            <div className="p-3 border-t border-gray-100 flex justify-end gap-2">
                                <button onClick={() => setEditingCustomer(null)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                                <button onClick={handleUpdateCustomer} className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-semibold hover:bg-gray-900 transition-all">
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }

            {/* 3. Add Customer Modal */}
            {
                showAddCustomerModal && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddCustomerModal(false)}></div>
                        <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[88vh]">

                            {/* Compact Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-gray-800">Add New Customer</h3>
                                    <p className="text-xs text-gray-500">Create a new customer profile</p>
                                </div>
                                <button onClick={() => setShowAddCustomerModal(false)} className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600">
                                    <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                            </div>

                            {/* Form Body */}
                            <form ref={formRef} className="p-5 space-y-4 overflow-y-auto flex-1">
                                <div className="flex items-center gap-4">
                                    <div className="size-14 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-all cursor-pointer">
                                        <span className="material-symbols-outlined text-[20px]">add_a_photo</span>
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] font-medium text-gray-500 mb-1 block">Full Name *</label>
                                        <input name="name" type="text" required placeholder="Enter name..." className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-gray-400 transition-colors" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-medium text-gray-500 mb-1 block">Email</label>
                                        <input name="email" type="email" placeholder="customer@email.com" className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-gray-400 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-medium text-gray-500 mb-1 block">Phone</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">+91</span>
                                            <input name="phone" type="tel" placeholder="00000 00000" className="w-full border border-gray-200 pl-10 pr-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-gray-400 transition-colors" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-medium text-gray-500 mb-1 block">Plan</label>
                                        <select name="plan" className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-gray-400 transition-colors bg-white">
                                            <option value="None">No Plan</option>
                                            <option value="Weekly Veg">Weekly Veg</option>
                                            <option value="Monthly Veg">Monthly Veg</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-medium text-gray-500 mb-1 block">Address</label>
                                        <input name="address" type="text" placeholder="Enter address..." className="w-full border border-gray-200 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-gray-400 transition-colors" />
                                    </div>
                                </div>
                            </form>

                            {/* Compact Footer */}
                            <div className="p-3 border-t border-gray-100 flex justify-end gap-2">
                                <button onClick={() => setShowAddCustomerModal(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                                <button onClick={handleAddNewCustomer} className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-semibold hover:bg-gray-900 transition-all flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">person_add</span>
                                    Add Customer
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            }
        </div>
    );
};

export default AdminCustomers;
