import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';

// --- Mock Data Generators ---
const USERS = ['Rahul Sharma', 'Priya Verma', 'Amit Kumar', 'Sneha Patel', 'Vikram Singh', 'Anjali Gupta'];
const ISSUES = ['Late delivery', 'Food quality issue', 'Wrong item', 'Subscription refund', 'App crashing', 'Rider rude'];
const KITCHENS = ['Spice Kitchen', 'Annapurna Rasoi', 'Tiffin Box HQ', 'Mom\'s Kitchen', 'Veg Delight'];

const generateTicket = (idOverride) => ({
    id: idOverride || `TKT${Math.floor(Math.random() * 9000) + 1000}`,
    user: USERS[Math.floor(Math.random() * USERS.length)],
    issue: ISSUES[Math.floor(Math.random() * ISSUES.length)],
    priority: Math.random() > 0.7 ? 'Critical' : Math.random() > 0.4 ? 'High' : 'Medium',
    status: 'New',
    date: 'Just now',
    kitchen: KITCHENS[Math.floor(Math.random() * KITCHENS.length)],
    hasUnread: true,
});

const initialTickets = [
    { id: 'TKT882', user: 'Rahul Sharma', issue: 'Late delivery by 40 minutes', priority: 'High', status: 'Open', date: '10m ago', kitchen: 'Spice Kitchen', hasUnread: true },
    { id: 'TKT881', user: 'Priya Verma', issue: 'Food quality not satisfactory', priority: 'Medium', status: 'In Review', date: '2h ago', kitchen: 'Annapurna Rasoi', hasUnread: false },
    { id: 'TKT880', user: 'Amit Kumar', issue: 'Wrong item delivered', priority: 'Critical', status: 'Open', date: '5h ago', kitchen: 'Annapurna Rasoi', hasUnread: true },
];

const AdminSupport = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`/api/admin/tickets?status=${filter}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                const data = res.data.data;
                setTickets(data.length > 0 ? data : initialTickets);
            }
        } catch (err) {
            console.error("Fetch Tickets Error:", err);
            setTickets(initialTickets);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [filter]);

    // --- Live Simulation Effect ---
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance every check
                const newTicket = generateTicket();
                setTickets(prev => [newTicket, ...prev]);
                toast.custom((t) => (
                    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-white border-l-4 border-rose-500 shadow-xl rounded-xl p-4 flex items-start gap-3 pointer-events-auto`}>
                        <div className="bg-rose-50 p-2 rounded-full"><span className="material-symbols-outlined text-rose-600">notification_important</span></div>
                        <div>
                            <p className="text-xs font-bold text-[#2D241E]">New Ticket Incoming!</p>
                            <p className="text-[10px] text-gray-500 font-medium">#{newTicket.id}: {newTicket.issue}</p>
                        </div>
                    </div>
                ), { duration: 4000 });
            }
        }, 8000); // Check every 8 seconds
        return () => clearInterval(interval);
    }, []);


    const filteredTickets = filter === 'All' ? tickets : tickets.filter(t => t.status === filter);

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto min-h-screen pb-10 relative">

            {/* Header Block */}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-[#2D241E] tracking-tight uppercase">Support Center</h1>
                        <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-lg shadow-blue-500/10">Operations Center</span>
                    </div>
                    <p className="text-[#897a70] text-xs font-bold uppercase tracking-wider opacity-60 flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        Real-time Customer Issue Tracking & Resolution
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-white/40 p-1.5 rounded-2xl border border-white/60 backdrop-blur-md relative z-10">
                    <div className="relative group">
                        <span className="absolute left-3 top-2.5 material-symbols-outlined text-[18px] text-gray-400 group-focus-within:text-[#2D241E] transition-colors">search</span>
                        <input
                            type="text"
                            placeholder="Search Tickets..."
                            className="bg-transparent border-none outline-none text-[10px] font-bold text-[#2D241E] p-2.5 pl-9 w-32 focus:w-48 transition-all placeholder:text-gray-400"
                        />
                    </div>
                    <div className="w-px h-4 bg-gray-200 mx-1"></div>
                    <div className="flex gap-1">
                        {['All', 'New', 'Open', 'Resolved'].map(t => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${filter === t ? 'bg-[#2D241E] text-white shadow-md' : 'text-[#897a70] hover:bg-white'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { l: 'Pending Tickets', v: tickets.filter(t => t.status !== 'Resolved').length, c: 'rose', i: 'mark_email_unread', bg: 'bg-rose-50' },
                    { l: 'Critical Issues', v: tickets.filter(t => t.priority === 'Critical').length, c: 'red', i: 'emergency_home', bg: 'bg-white' },
                    { l: 'Avg Response', v: '14m', c: 'blue', i: 'speed', bg: 'bg-white' },
                    { l: 'Satisfaction', v: '4.9/5', c: 'emerald', i: 'sentiment_very_satisfied', bg: 'bg-emerald-50' },
                ].map((s, i) => (
                    <div key={i} className={`${s.bg} p-5 rounded-[2.5rem] border border-white/60 shadow-sm flex items-center justify-between group hover:scale-[1.02] transition-transform cursor-pointer select-none`}>
                        <div>
                            <p className="text-xs font-bold text-[#5C4D42]/60 uppercase tracking-wider">{s.l}</p>
                            <h3 className="text-2xl font-bold text-[#2D241E] mt-1">{s.v}</h3>
                        </div>
                        <div className={`size-12 rounded-2xl flex items-center justify-center ${s.bg === 'bg-white' ? 'bg-gray-50' : 'bg-white/50 shadow-inner'}`}>
                            <span className={`material-symbols-outlined text-2xl text-${s.c}-500`}>{s.i}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ticket List */}
            <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-lg overflow-hidden min-h-[50vh] flex flex-col">
                <div className="overflow-x-auto flex-1 custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/50 sticky top-0 z-10 backdrop-blur-md">
                            <tr className="border-b border-gray-100">
                                <th className="px-6 py-5 text-[11px] font-bold text-[#897a70] uppercase tracking-wider pl-8">Ticket ID</th>
                                <th className="px-6 py-5 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">User & Issue</th>
                                <th className="px-6 py-5 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Priority</th>
                                <th className="px-6 py-5 text-[11px] font-bold text-[#897a70] uppercase tracking-wider">Status</th>
                                <th className="px-6 py-5 text-[11px] font-bold text-[#897a70] uppercase tracking-wider text-right pr-8">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/50">
                            {filteredTickets.length > 0 ? (
                                filteredTickets.map((ticket) => (
                                    <tr key={ticket.id} className={`group hover:bg-white/80 transition-all cursor-pointer ${ticket.status === 'New' ? 'bg-orange-50/30' : ''}`} onClick={() => setSelectedTicket(ticket)}>
                                        <td className="px-6 py-4 pl-8">
                                            <p className="text-sm font-bold text-[#2D241E]">#{ticket.id}</p>
                                            <p className="text-xs font-bold text-[#897a70]">{ticket.date}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-gradient-to-br from-orange-100 to-rose-100 border border-white shadow-sm flex items-center justify-center text-[11px] font-bold text-orange-800">
                                                    {(ticket?.user || 'U').charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-[#2D241E] leading-tight">{ticket.issue}</p>
                                                    <p className="text-[10px] font-bold text-[#897a70] mt-0.5 flex items-center gap-1">
                                                        {ticket.user} • {ticket.kitchen}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${ticket.priority === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' :
                                                ticket.priority === 'High' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                                }`}>
                                                <span className={`size-1.5 rounded-full ${ticket.priority === 'Critical' ? 'bg-red-500 animate-pulse' : 'bg-current'}`}></span>
                                                {ticket.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                                                ticket.status === 'New' ? 'bg-violet-100 text-violet-700 animate-pulse' : 'bg-amber-50 text-amber-700'
                                                }`}>
                                                {ticket.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right pr-8">
                                            <button className="size-8 rounded-xl bg-[#2D241E] text-white flex items-center justify-center shadow-lg shadow-orange-900/10 hover:scale-110 active:scale-95 transition-all ml-auto">
                                                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-20 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-50">
                                            <div className="size-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mb-4">
                                                <span className="material-symbols-outlined text-4xl text-gray-300">inbox</span>
                                            </div>
                                            <p className="text-base font-bold text-[#2D241E]">All Caught Up!</p>
                                            <p className="text-[10px] font-bold text-[#897a70] mt-1">No tickets found in this category.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Ticket Details Modal */}
            {selectedTicket && <TicketDetailsModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />}
        </div>
    );
};

// --- Sub-Component: Interactive Ticket Detail Modal ---
const TicketDetailsModal = ({ ticket, onClose }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: `Hi, I'm facing an issue: ${ticket.issue}`, sender: 'user', time: '10:30 AM' },
        { id: 2, text: 'We are looking into it. Please wait.', sender: 'bot', time: '10:31 AM' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;
        const newMsg = { id: Date.now(), text: inputText, sender: 'agent', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, newMsg]);
        setInputText('');

        // Sim Bot Reply
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: 'Ticket updated in system. Customer notified.', sender: 'sys', time: 'Just now' }]);
        }, 1500);
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] overflow-hidden shadow-2xl relative z-10 flex">

                {/* Left: Context Panel */}
                <div className="w-[320px] bg-gray-50 border-r border-gray-100 p-6 flex flex-col gap-6 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="size-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-lg font-bold">
                            {(ticket?.user || 'U').charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-base font-bold text-gray-800 truncate">{ticket.user}</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Customer Profile</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-5 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm">
                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">Reported Issue</p>
                            <p className="text-sm font-bold text-[#2D241E] leading-snug">{ticket.issue}</p>
                        </div>
                        <div className="p-5 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm">
                            <p className="text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-wider">Kitchen</p>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px] text-orange-500">storefront</span>
                                <p className="text-sm font-bold text-[#2D241E]">{ticket.kitchen}</p>
                            </div>
                        </div>
                        <div className="p-5 bg-blue-50 rounded-[1.5rem] border border-blue-100 shadow-sm">
                            <p className="text-[10px] uppercase font-bold text-blue-400 mb-1 tracking-wider">AI Insight</p>
                            <p className="text-xs font-bold text-blue-800 leading-relaxed">User churn risk high. Recommend immediate resolution within 30 mins to retain loyalty.</p>
                        </div>
                    </div>

                    <div className="mt-auto space-y-2">
                        <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-black transition-colors uppercase tracking-widest">Mark Resolved</button>
                        <button className="w-full py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-50 transition-colors uppercase tracking-widest">Escalate Case</button>
                    </div>
                </div>

                {/* Right: Interactive Chat */}
                <div className="flex-1 flex flex-col bg-white">
                    <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <div>
                                <p className="text-xs font-bold text-gray-800 uppercase tracking-widest">Live Connect</p>
                                <p className="text-[10px] text-gray-400">#{ticket.id} • Assigned to You</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600">
                            <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : msg.sender === 'sys' ? 'justify-center' : 'justify-start'}`}>
                                {msg.sender === 'sys' ? (
                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 uppercase tracking-tighter">{msg.text}</span>
                                ) : (
                                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${msg.sender === 'agent' ? 'bg-gray-900 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                                        <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                                        <p className={`text-[10px] font-medium mt-1 opacity-40 ${msg.sender === 'agent' ? 'text-white text-right' : 'text-gray-500'}`}>{msg.time}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex items-center gap-1.5 text-gray-400 ml-2">
                                <span className="size-1 bg-gray-300 rounded-full animate-bounce"></span>
                                <span className="size-1 bg-gray-300 rounded-full animate-bounce delay-100"></span>
                                <span className="size-1 bg-gray-300 rounded-full animate-bounce delay-200"></span>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="p-4 bg-white border-t border-gray-100">
                        {/* Quick Responses */}
                        <div className="flex gap-1.5 mb-3 overflow-x-auto no-scrollbar">
                            {['Refund Processed', 'Internal Error Fixed', 'Sending Voucher'].map(txt => (
                                <button key={txt} onClick={() => setInputText(txt)} className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold text-gray-500 hover:bg-gray-900 hover:text-white transition-all whitespace-nowrap">{txt}</button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Write a response..."
                                className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-gray-200 outline-none transition-all"
                            />
                            <button onClick={handleSend} className="size-11 bg-orange-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all shrink-0">
                                <span className="material-symbols-outlined text-[20px]">send</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>,
        document.body
    );
};

export default AdminSupport;
