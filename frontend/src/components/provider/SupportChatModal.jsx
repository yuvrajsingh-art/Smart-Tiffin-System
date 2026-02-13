import React, { useState, useEffect, useRef } from 'react';
import ProviderApi from '../../services/ProviderApi'; // Adjusted import
import { toast } from 'react-hot-toast';

const SupportChatModal = ({ ticket, onClose }) => {
    const [messages, setMessages] = useState(ticket.messages || []);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        setMessages(ticket.messages);
        scrollToBottom();
    }, [ticket]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!replyText.trim()) return;
        setSending(true);
        try {
            const res = await ProviderApi.post(`/provider/support/${ticket._id}/reply`, { text: replyText });
            if (res.data.success) {
                setMessages(res.data.data.messages);
                setReplyText('');
            }
        } catch (error) {
            toast.error("Failed to send reply");
        } finally {
            setSending(false);
        }
    };

    const handleResolve = async () => {
        if (!window.confirm("Are you sure you want to resolve this ticket?")) return;
        try {
            const res = await ProviderApi.put(`/provider/support/${ticket._id}/resolve`);
            if (res.data.success) {
                toast.success("Ticket Resolved");
                onClose();
            }
        } catch (error) {
            toast.error("Failed to resolve");
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#2D241E]/90 backdrop-blur-sm animate-[fadeIn_0.3s]" onClick={onClose}></div>
            <div className="bg-white rounded-[2rem] w-full max-w-2xl h-[85vh] flex flex-col shadow-2xl animate-[scaleIn_0.3s] relative z-10 overflow-hidden">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-black text-[#2D241E]">{ticket.issue}</h3>
                            <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-[10px] font-bold uppercase">
                                {ticket.status}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 font-bold mt-1">
                            {ticket.user?.fullName} • #{ticket._id.slice(-4).toUpperCase()}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                            <button
                                onClick={handleResolve}
                                className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-black uppercase hover:bg-green-100 transition-all"
                            >
                                Mark Resolved
                            </button>
                        )}
                        <button onClick={onClose} className="size-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                            <span className="material-symbols-outlined text-gray-500">close</span>
                        </button>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FFFBF5]">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium shadow-sm leading-relaxed ${msg.sender === 'admin'
                                    ? 'bg-[#2D241E] text-white rounded-tr-sm'
                                    : 'bg-white text-[#2D241E] border border-gray-100 rounded-tl-sm'
                                }`}>
                                {msg.text}
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold mt-1 px-1">
                                {msg.sender === 'admin' ? 'You' : 'Customer'} • {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                    <div className="p-4 bg-white border-t border-gray-100">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your reply..."
                                className="flex-1 bg-gray-50 border-none rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                            <button
                                onClick={handleSend}
                                disabled={sending}
                                className="bg-[#2D241E] text-white size-12 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
                            >
                                <span className="material-symbols-outlined">{sending ? 'sync' : 'send'}</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupportChatModal;
