import React, { useState } from 'react';
import toast from 'react-hot-toast';

const complaintsData = [
    { id: 'TKT882', user: 'Rahul Sharma', issue: 'Late delivery by 40 minutes', priority: 'High', status: 'Open', date: 'Just now', kitchen: 'Spice Kitchen' },
    { id: 'TKT881', user: 'Priya Verma', issue: 'Food quality not satisfactory', priority: 'Medium', status: 'In Review', date: '2h ago', kitchen: 'Annapurna Rasoi' },
    { id: 'TKT880', user: 'Amit Kumar', issue: 'Wrong item delivered', priority: 'Critical', status: 'Open', date: '5h ago', kitchen: 'Annapurna Rasoi' },
    { id: 'TKT879', user: 'Sneha Patel', issue: 'Refund for cancelled subscription', priority: 'Low', status: 'Resolved', date: '1d ago', kitchen: 'N/A' },
];

const AdminSupport = () => {
    const [tickets, setTickets] = useState(complaintsData);
    const [filter, setFilter] = useState('All');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [modalTab, setModalTab] = useState('Intelligence');

    const handleAction = (type, id) => {
        toast.success(`${type} action for ticket ${id}`, {
            icon: type === 'Resolve' ? '✅' : '👀',
            style: { borderRadius: '12px', background: '#2D241E', color: '#fff' }
        });
        if (type === 'Resolve') {
            setTickets(tickets.map(t => t.id === id ? { ...t, status: 'Resolved' } : t));
        }
    };

    const filteredTickets = filter === 'All' ? tickets : tickets.filter(t => t.status === filter);

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto min-h-full pb-8 animate-[fadeIn_0.5s]">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black text-[#2D241E] tracking-tight flex items-center gap-2">
                        Customer Support Desk
                        <span className="px-2 py-0.5 bg-red-500 text-white text-[9px] font-black rounded-lg uppercase tracking-wider">Helpdesk</span>
                    </h2>
                    <p className="text-[#5C4D42] text-xs font-medium opacity-80 mt-0.5 italic">Managing active complaints, refunds, and platform feedback.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-white/40 p-1 rounded-xl border border-white/60">
                        {['All', 'Open', 'In Review', 'Resolved'].map(t => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${filter === t ? 'bg-[#2D241E] text-white' : 'text-[#897a70] hover:bg-white'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Active Tickets', val: '12', color: 'text-rose-500', bg: 'bg-rose-50', icon: 'confirmation_number' },
                    { label: 'Critical Issues', val: '03', color: 'text-red-600', bg: 'bg-red-50', icon: 'error' },
                    { label: 'Avg Resolution', val: '4.2h', color: 'text-blue-600', bg: 'bg-blue-50', icon: 'timer' },
                    { label: 'Resolved Today', val: '28', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'task_alt' },
                ].map((stat, i) => (
                    <div key={i} className={`${stat.bg} p-5 rounded-[2rem] border border-white/60 shadow-sm flex items-center justify-between group`}>
                        <div>
                            <p className="text-[9px] font-black text-[#5C4D42]/60 uppercase tracking-widest">{stat.label}</p>
                            <h3 className={`text-2xl font-black ${stat.color}`}>{stat.val}</h3>
                        </div>
                        <span className={`material-symbols-outlined text-2xl ${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`}>{stat.icon}</span>
                    </div>
                ))}
            </div>

            {/* Tickets Table */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/30 border-b border-gray-100">
                                <th className="px-6 py-5 text-[10px] font-black text-[#5C4D42] uppercase tracking-wider pl-8">Inquiry / ID</th>
                                <th className="px-6 py-5 text-[10px] font-black text-[#5C4D42] uppercase tracking-wider">User & Kitchen</th>
                                <th className="px-6 py-5 text-[10px] font-black text-[#5C4D42] uppercase tracking-wider">Priority</th>
                                <th className="px-6 py-5 text-[10px] font-black text-[#5C4D42] uppercase tracking-wider">Status</th>
                                <th className="px-6 py-5 text-[10px] font-black text-[#5C4D42] uppercase tracking-wider text-right pr-8">Management</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredTickets.map((ticket) => (
                                <tr key={ticket.id} className="group hover:bg-white/60 transition-colors">
                                    <td className="px-6 py-5 pl-8">
                                        <div className="flex items-center gap-4">
                                            <div className={`size-1.5 rounded-full ${ticket.status === 'Resolved' ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}></div>
                                            <div>
                                                <p className="text-xs font-black text-[#2D241E] truncate max-w-[200px]">{ticket.issue}</p>
                                                <p className="text-[9px] font-bold text-[#897a70]">#{ticket.id} • {ticket.date}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-xs font-bold text-[#2D241E]">{ticket.user}</p>
                                        <p className="text-[9px] text-[#5C4D42] flex items-center gap-1 uppercase tracking-tighter">
                                            <span className="material-symbols-outlined text-[12px]">store</span> {ticket.kitchen}
                                        </p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${ticket.priority === 'Critical' ? 'bg-red-100 text-red-600' :
                                            ticket.priority === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-blue-50 text-blue-600'
                                            }`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${ticket.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                            }`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right pr-8">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleAction('Resolve', ticket.id)}
                                                className={`size-9 rounded-xl flex items-center justify-center transition-all ${ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-600 cursor-not-allowed opacity-50' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                                                    }`}
                                                disabled={ticket.status === 'Resolved'}
                                            >
                                                <span className="material-symbols-outlined text-[18px]">done_all</span>
                                            </button>
                                            <button
                                                onClick={() => setSelectedTicket(ticket)}
                                                className="size-9 rounded-xl bg-[#2D241E] text-white flex items-center justify-center hover:bg-orange-600 transition-all"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* System Info Bar */}
            <div className="p-4 bg-[#2D241E] rounded-3xl text-white flex items-center justify-between border border-white/5 relative overflow-hidden group">
                <div className="absolute right-0 top-0 size-32 bg-rose-500/10 blur-3xl group-hover:bg-rose-500/20 transition-colors"></div>
                <div className="flex items-center gap-4 relative z-10">
                    <span className="material-symbols-outlined text-rose-400">psychiatry</span>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Pro Tip for Admin</p>
                        <p className="text-xs font-bold leading-tight">Resolve 'Critical' tickets within 2 hours to maintain platform rating above 4.8★</p>
                    </div>
                </div>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-bold transition-all relative z-10">View Policies</button>
            </div>
            {/* Ticket DNA Resolution Modal - [NEW] */}
            {selectedTicket && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2D241E]/80 backdrop-blur-md animate-[fadeIn_0.3s]" onClick={() => setSelectedTicket(null)}></div>
                    <div className="bg-white rounded-[3rem] w-full max-w-3xl overflow-hidden shadow-2xl animate-[scaleIn_0.3s] relative z-10 border border-black/5 flex flex-col max-h-[92vh]">

                        {/* Modal Header [DNA STYLE] */}
                        <div className="p-8 pb-4 flex justify-between items-start shrink-0">
                            <div>
                                <h3 className="text-2xl font-black text-[#2D241E]">Ticket DNA</h3>
                                <p className="text-[11px] font-bold text-[#897a70] mt-1">Complaint resolution & quality assurance tunnel</p>
                            </div>
                            <button onClick={() => setSelectedTicket(null)} className="size-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all">
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        </div>

                        {/* Tab Navigation */}
                        <div className="px-8 mb-4 shrink-0 overflow-x-auto no-scrollbar">
                            <div className="flex gap-1 bg-gray-50 p-1.5 rounded-[1.5rem] border border-black/5 w-fit">
                                {[
                                    { id: 'Intelligence', label: 'Intelligence', icon: 'psychology' },
                                    { id: 'Chat', label: 'Interaction', icon: 'forum' },
                                    { id: 'Order', label: 'Order Sync', icon: 'inventory' },
                                    { id: 'Kitchen', label: 'Kitchen Hub', icon: 'storefront' },
                                    { id: 'Audit', label: 'Resolution', icon: 'task_alt' },
                                ].map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setModalTab(t.id)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-tight transition-all whitespace-nowrap ${modalTab === t.id ? 'bg-[#2D241E] text-white shadow-lg' : 'text-[#897a70] hover:bg-white hover:text-[#2D241E]'}`}
                                    >
                                        <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pb-4 space-y-8">

                            {/* Ticket Info Card */}
                            <div className="p-5 bg-rose-50/50 border border-rose-100 rounded-[2.5rem] flex items-center gap-6 shadow-sm">
                                <div className="relative">
                                    <div className="size-20 rounded-2xl bg-[#2D241E] flex flex-col items-center justify-center text-white shadow-lg border-2 border-white">
                                        <span className="text-[10px] font-black opacity-40">TKT</span>
                                        <span className="text-lg font-black italic">{selectedTicket.id.replace('TKT', '')}</span>
                                    </div>
                                    <div className={`absolute -bottom-2 -left-2 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase border-2 border-white shadow-sm ${selectedTicket.priority === 'Critical' ? 'bg-red-500' : 'bg-orange-500'}`}>{selectedTicket.priority}</div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xl font-black text-[#2D241E] tracking-tight">{selectedTicket.user}</h4>
                                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase ${selectedTicket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{selectedTicket.status}</span>
                                    </div>
                                    <p className="text-sm font-bold text-[#5C4D42] mt-1 italic">"{selectedTicket.issue}"</p>
                                </div>
                            </div>

                            {modalTab === 'Intelligence' && (
                                <div className="space-y-6 animate-[fadeIn_0.3s]">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 bg-white border border-gray-100 rounded-[2rem] space-y-2">
                                            <p className="text-[10px] font-black text-[#897a70] uppercase">Kitchen Involved</p>
                                            <div className="flex items-center gap-2">
                                                <div className="size-2 rounded-full bg-violet-500" />
                                                <p className="text-xs font-black text-[#2D241E]">{selectedTicket.kitchen}</p>
                                            </div>
                                        </div>
                                        <div className="p-5 bg-white border border-gray-100 rounded-[2rem] space-y-2">
                                            <p className="text-[10px] font-black text-[#897a70] uppercase">Reported Time</p>
                                            <p className="text-xs font-black text-[#2D241E]">{selectedTicket.date}</p>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-gray-50 rounded-[2.5rem] space-y-4">
                                        <p className="text-[10px] font-black text-[#897a70] uppercase tracking-widest ml-1">AI Recommendation</p>
                                        <div className="p-4 bg-white rounded-2xl border-l-4 border-blue-500 shadow-sm">
                                            <p className="text-[11px] font-bold text-[#2D241E] leading-relaxed">Based on history, {selectedTicket.user} responds well to <b>Partial Refunds</b>. Kitchen '{selectedTicket.kitchen}' has had 3 similar complaints this week.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalTab === 'Chat' && (
                                <div className="space-y-4 animate-[fadeIn_0.3s]">
                                    <div className="space-y-3 px-2">
                                        <div className="flex justify-start">
                                            <div className="max-w-[80%] bg-gray-100 p-4 rounded-2xl rounded-tl-none">
                                                <p className="text-xs font-bold text-[#2D241E]">Hi, my tiffin is late by 40 mins. This is the 3rd time this week.</p>
                                                <p className="text-[8px] text-[#897a70] font-black mt-1 uppercase">Customer • 12:45 PM</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <div className="max-w-[80%] bg-[#2D241E] text-white p-4 rounded-2xl rounded-tr-none shadow-lg">
                                                <p className="text-xs font-medium">We extremely apologize, Rahul. We are syncing with the fleet agent immediately.</p>
                                                <p className="text-[8px] text-white/40 font-black mt-1 uppercase">Support Bot • 12:46 PM</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative pt-4">
                                        <input type="text" placeholder="Type administrative response..." className="w-full bg-gray-50 border-none px-5 py-4 rounded-2xl text-xs font-bold outline-none pr-12" />
                                        <button className="absolute right-3 top-[26px] size-8 bg-[#FF5722] text-white rounded-lg flex items-center justify-center shadow-lg"><span className="material-symbols-outlined text-[18px]">send</span></button>
                                    </div>
                                </div>
                            )}

                            {modalTab === 'Order' && (
                                <div className="space-y-4 animate-[fadeIn_0.3s]">
                                    <div className="p-6 bg-[#2D241E] rounded-[2.5rem] text-white flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-black text-white/40 uppercase">Related Order</p>
                                            <p className="text-2xl font-black italic mt-1">#ORD-99021</p>
                                        </div>
                                        <button className="px-6 py-3 bg-white text-[#2D241E] rounded-xl text-[10px] font-black uppercase">View Hub</button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 bg-gray-50 rounded-[2rem] border border-black/5">
                                            <p className="text-[10px] font-black text-[#897a70] uppercase mb-1">Status</p>
                                            <span className="px-2 py-1 bg-emerald-100 text-emerald-600 text-[9px] font-black rounded uppercase">Delivered</span>
                                        </div>
                                        <div className="p-5 bg-gray-50 rounded-[2rem] border border-black/5">
                                            <p className="text-[10px] font-black text-[#897a70] uppercase mb-1">Delivery Time</p>
                                            <p className="text-xs font-black text-[#2D241E]">1:15 PM (Delayed)</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalTab === 'Audit' && (
                                <div className="space-y-4 animate-[fadeIn_0.3s]">
                                    <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] space-y-4 text-center">
                                        <div className="size-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm text-emerald-600"><span className="material-symbols-outlined text-3xl">verified</span></div>
                                        <h4 className="text-lg font-black text-emerald-900">Final Resolution Flow</h4>
                                        <div className="flex gap-2">
                                            <button className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-emerald-600/20">Full Refund</button>
                                            <button className="flex-1 py-4 bg-white border border-emerald-200 text-emerald-600 rounded-2xl text-[10px] font-black uppercase">Credit ₹50</button>
                                        </div>
                                    </div>
                                    <div className="space-y-2 p-2">
                                        <p className="text-[10px] font-black text-[#897a70] uppercase">Admin Decision History</p>
                                        <div className="text-xs font-bold text-[#2D241E] flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#2D241E]" /> Ticket opened via App</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-8 pb-10 bg-white border-t border-gray-50 flex items-center justify-end gap-10 shrink-0">
                            <button onClick={() => setSelectedTicket(null)} className="text-[12px] font-black text-[#897a70] hover:text-[#2D241E] transition-colors">Close</button>
                            <button onClick={() => {
                                toast.success('Ticket Resolution Synced');
                                setSelectedTicket(null);
                            }} className="px-12 py-5 bg-[#FF5722] text-white rounded-[1.5rem] text-[12px] font-black shadow-[0_10px_25px_-5px_rgba(255,87,34,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all">Close Ticket</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AdminSupport;
