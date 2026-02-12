import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import ProviderApi from '../../services/ProviderApi';
import BackgroundBlobs from '../../components/common/BackgroundBlobs';
import PageHeader from '../../components/common/PageHeader';
import { useAuth } from '../../context/UserContext';
import SupportChatModal from '../../components/provider/SupportChatModal';

const ProviderSupport = () => {
    const { token } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [activeTab, setActiveTab] = useState('Active'); // Active, History

    const fetchTickets = async () => {
        setLoading(true);
        try {
            // Using direct axios if ProviderApi wrapper doesn't have custom method yet
            const response = await ProviderApi.get('/provider/support');
            if (response.data.success) {
                setTickets(response.data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load support tickets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchTickets();
    }, [token]);

    const filteredTickets = tickets.filter(t => {
        if (activeTab === 'Active') return t.status !== 'Resolved' && t.status !== 'Closed';
        return t.status === 'Resolved' || t.status === 'Closed';
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'red-500';
            case 'Open': return 'orange-500';
            case 'In Review': return 'blue-500';
            case 'Resolved': return 'green-500';
            default: return 'gray-500';
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out] px-4 relative min-h-screen">
            <BackgroundBlobs />
            <PageHeader title="Support & Disputes" />

            {/* Tabs */}
            <div className="flex bg-white/40 backdrop-blur-xl p-1 rounded-2xl max-w-md mb-8 border border-white/60">
                {['Active', 'History'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === tab
                            ? 'bg-[#2D241E] text-white shadow-lg'
                            : 'text-[#5C4D42] hover:bg-white/50'
                            }`}
                    >
                        {tab} Issues
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : filteredTickets.length > 0 ? (
                <div className="grid gap-4">
                    {filteredTickets.map((ticket) => (
                        <div
                            key={ticket._id}
                            onClick={() => setSelectedTicket(ticket)}
                            className="group glass-panel p-6 rounded-[2rem] border border-white/60 hover:bg-white cursor-pointer transition-all shadow-sm hover:shadow-lg animate-[slideUp_0.3s_ease-out]"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    <div className={`size-12 rounded-2xl flex items-center justify-center text-white bg-${getStatusColor(ticket.status)} shadow-lg shadow-${getStatusColor(ticket.status)}/20`}>
                                        <span className="material-symbols-outlined text-xl">
                                            {ticket.status === 'Resolved' ? 'verified' : 'warning'}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-black text-[#2D241E] text-base">{ticket.user?.fullName || 'Unknown User'}</h3>
                                            <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] font-bold">
                                                {ticket.relatedOrder?.orderNumber ? `#${ticket.relatedOrder.orderNumber}` : 'General'}
                                            </span>
                                        </div>
                                        <p className="font-bold text-[#5C4D42]">{ticket.issue}</p>
                                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{ticket.description}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-${getStatusColor(ticket.status)} text-${getStatusColor(ticket.status)} bg-white`}>
                                        {ticket.status}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-300">
                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 opacity-50">
                    <span className="material-symbols-outlined text-6xl mb-4 text-gray-300">thumb_up</span>
                    <h3 className="text-xl font-black text-gray-400">All Good!</h3>
                    <p className="text-gray-400">No {activeTab.toLowerCase()} support tickets found.</p>
                </div>
            )}

            {/* Chat Modal */}
            {selectedTicket && (
                <SupportChatModal
                    ticket={selectedTicket}
                    onClose={() => {
                        setSelectedTicket(null);
                        fetchTickets(); // Refresh on close
                    }}
                />
            )}
        </div>
    );
};

export default ProviderSupport;
