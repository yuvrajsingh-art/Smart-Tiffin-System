import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import BackgroundBlobs from '../../components/common/BackgroundBlobs';
import PageHeader from '../../components/common/PageHeader';
import { useAuth } from '../../context/UserContext';
import { toast } from 'react-hot-toast';

const Support = () => {
    const { token } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [newTicket, setNewTicket] = useState({
        issue: '',
        description: '',
        priority: 'Medium'
    });
    const [replyText, setReplyText] = useState('');

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/customer/support', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setTickets(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching tickets", error);
            toast.error("Failed to load tickets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchTickets();
    }, [token]);

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/customer/support', newTicket, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                toast.success("Ticket raised successfully!");
                setShowTicketModal(false);
                setNewTicket({ issue: '', description: '', priority: 'Medium' });
                fetchTickets();
            }
        } catch (error) {
            toast.error("Failed to raise ticket");
        }
    };

    const handleAddMessage = async (ticketId) => {
        if (!replyText.trim()) return;
        try {
            const res = await axios.post(`/api/customer/support/${ticketId}/message`, { text: replyText }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setReplyText('');
                // Update local selected ticket
                setSelectedTicket(res.data.data);
                fetchTickets();
            }
        } catch (error) {
            toast.error("Failed to send message");
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Open': return 'bg-green-50 text-green-600 border-green-100';
            case 'Resolved': return 'bg-gray-100 text-gray-600 border-gray-200';
            case 'Closed': return 'bg-gray-200 text-gray-500 border-gray-300';
            default: return 'bg-orange-50 text-orange-600 border-orange-100';
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out] px-4 relative">
            <BackgroundBlobs />
            <PageHeader
                title="Support Center"
                rightElement={
                    <button
                        onClick={() => setShowTicketModal(true)}
                        className="bg-[#2D241E] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        New Case
                    </button>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* FAQ / Info Cards */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-panel p-6 rounded-[2rem] border border-white/60 bg-gradient-to-br from-white/80 to-blue-50/30">
                        <div className="size-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined">help</span>
                        </div>
                        <h3 className="font-black text-[#2D241E] text-lg mb-2">Need Immediate Help?</h3>
                        <p className="text-sm text-[#5C4D42] opacity-80 leading-relaxed mb-4">
                            Check out our FAQ for the quickest answers to common questions about subscriptions and delivery.
                        </p>
                        <button className="w-full py-3 bg-white border border-blue-100 text-blue-600 rounded-xl font-bold text-xs hover:bg-blue-50 transition-all">
                            Visit Help Center
                        </button>
                    </div>

                    <div className="glass-panel p-6 rounded-[2rem] border border-white/60 bg-gradient-to-br from-white/80 to-green-50/30">
                        <div className="size-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined">chat_bubble</span>
                        </div>
                        <h3 className="font-black text-[#2D241E] text-lg mb-2">WhatsApp Support</h3>
                        <p className="text-sm text-[#5C4D42] opacity-80 leading-relaxed mb-4">
                            Connect with us directly on WhatsApp for real-time order updates.
                        </p>
                        <button className="w-full py-3 bg-[#25D366] text-white rounded-xl font-bold text-xs shadow-lg shadow-green-200 hover:scale-105 transition-all">
                            Chat on WhatsApp
                        </button>
                    </div>
                </div>

                {/* Tickets List */}
                <div className="lg:col-span-8 space-y-4">
                    <h2 className="font-black text-[#2D241E] opacity-40 uppercase tracking-[0.2em] text-[10px] px-2">
                        Your Support Requests
                    </h2>

                    {loading ? (
                        <div className="py-20 flex justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                        </div>
                    ) : tickets.length > 0 ? (
                        <div className="space-y-4">
                            {tickets.map(ticket => (
                                <div
                                    key={ticket._id}
                                    onClick={() => setSelectedTicket(ticket)}
                                    className="group glass-panel p-5 rounded-[2.2rem] border border-white/60 flex items-center justify-between hover:bg-white transition-all cursor-pointer shadow-sm hover:shadow-md"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`size-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${getStatusStyle(ticket.status)}`}>
                                            <span className="material-symbols-outlined">{ticket.status === 'Resolved' ? 'verified' : 'stadium'}</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-black text-[#2D241E] text-base">{ticket.issue}</h3>
                                                <span className="text-[10px] font-black text-gray-300">#TKT{ticket._id.slice(-4).toUpperCase()}</span>
                                            </div>
                                            <p className="text-xs font-medium text-gray-400">
                                                Opened on {new Date(ticket.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                        <p className="text-[9px] font-black text-gray-300 uppercase">
                                            {ticket.messages.length} Messages
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white/40 border-2 border-dashed border-orange-100 rounded-[3rem]">
                            <span className="material-symbols-outlined text-5xl text-gray-200 mb-4">support_agent</span>
                            <p className="text-gray-400 font-bold">No active support cases.</p>
                            <p className="text-xs text-gray-300 mt-1">Raise a ticket if you face any issues.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* New Ticket Modal */}
            {showTicketModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2D241E]/90 backdrop-blur-lg animate-[fadeIn_0.3s]" onClick={() => setShowTicketModal(false)}></div>
                    <form onSubmit={handleCreateTicket} className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-[scaleIn_0.3s] relative overflow-hidden z-10 border border-white/20">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black text-[#2D241E] mb-2 text-center">Raise a Ticket</h3>
                            <p className="text-[#5C4D42] text-sm font-medium leading-relaxed mb-8 opacity-80 text-center">
                                Explain your issue clearly and we'll get back to you shortly.
                            </p>

                            <div className="space-y-5">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={newTicket.issue}
                                        onChange={(e) => setNewTicket({ ...newTicket, issue: e.target.value })}
                                        className="w-full px-5 py-4 bg-gray-50 border border-orange-50 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="Order not delivered, Slow app, etc."
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Priority</label>
                                    <div className="flex gap-2">
                                        {['Low', 'Medium', 'High'].map(p => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setNewTicket({ ...newTicket, priority: p })}
                                                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all border ${newTicket.priority === p ? 'bg-[#2D241E] text-white' : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-white'}`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Description</label>
                                    <textarea
                                        required
                                        value={newTicket.description}
                                        onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                        className="w-full h-32 px-5 py-4 bg-gray-50 border border-orange-50 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                        placeholder="Describe the issue in detail..."
                                    ></textarea>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowTicketModal(false)}
                                        className="flex-1 py-4 bg-gray-100 text-[#5C4D42] rounded-[1.5rem] font-black text-sm hover:bg-gray-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-4 bg-[#2D241E] text-white rounded-[1.5rem] font-black text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        Raise Case
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>,
                document.body
            )}

            {/* Ticket Detail Modal */}
            {selectedTicket && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2D241E]/90 backdrop-blur-lg animate-[fadeIn_0.3s]" onClick={() => setSelectedTicket(null)}></div>
                    <div className="bg-[#FFFBF5] rounded-[3rem] w-full max-w-2xl h-[90vh] flex flex-col shadow-2xl animate-[scaleIn_0.3s] relative overflow-hidden z-10 border border-white/20">
                        {/* Header */}
                        <div className="p-8 border-b border-orange-100 bg-white/50 backdrop-blur-md flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-black text-[#2D241E]">{selectedTicket.issue}</h3>
                                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusStyle(selectedTicket.status)}`}>
                                        {selectedTicket.status}
                                    </span>
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic opacity-60">Case #TKT{selectedTicket._id.slice(-4).toUpperCase()}</p>
                            </div>
                            <button onClick={() => setSelectedTicket(null)} className="size-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-all">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                            {selectedTicket.messages.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[80%] p-5 rounded-[2rem] text-sm font-medium shadow-sm leading-relaxed ${msg.sender === 'user'
                                        ? 'bg-[#2D241E] text-white rounded-tr-sm'
                                        : 'bg-white text-[#2D241E] border border-orange-100 rounded-tl-sm'
                                        }`}>
                                        {msg.text}
                                    </div>
                                    <p className="text-[10px] font-black text-gray-300 uppercase mt-2 px-2">
                                        {msg.sender === 'user' ? 'You' : 'Support Team'} • {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Reply Area */}
                        {selectedTicket.status !== 'Closed' && (
                            <div className="p-6 bg-white border-t border-orange-100">
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 bg-gray-50 border border-orange-50 rounded-2xl px-5 py-4 text-sm font-bold focus:bg-white outline-none transition-all"
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddMessage(selectedTicket._id)}
                                    />
                                    <button
                                        onClick={() => handleAddMessage(selectedTicket._id)}
                                        className="bg-[#2D241E] text-white size-14 rounded-2xl flex items-center justify-center shadow-lg hover:rotate-12 transition-all"
                                    >
                                        <span className="material-symbols-outlined">send</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Support;
