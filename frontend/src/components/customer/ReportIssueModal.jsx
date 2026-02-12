import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/UserContext';

const ReportIssueModal = ({ isOpen, onClose, order, onSuccess }) => {
    const { token } = useAuth();
    const [issue, setIssue] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !order) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/api/customer/support', {
                issue,
                description,
                priority: 'High', // Default to High for order issues
                relatedOrderId: order.orderId || order._id, // Handle both id formats if needed
                relatedProviderId: order.providerId || order.provider?._id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                toast.success("Issue Reported. Support Team will contact you.");
                onSuccess();
                onClose();
            }
        } catch (error) {
            toast.error("Failed to report issue");
        } finally {
            setLoading(false);
        }
    };

    const commonIssues = [
        "Food not delivered",
        "Wrong item delivered",
        "Quality issue",
        "Packaging damage",
        "Late delivery"
    ];

    return createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#2D241E]/90 backdrop-blur-sm animate-[fadeIn_0.3s]" onClick={onClose}></div>
            <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-6 shadow-2xl animate-[scaleIn_0.3s] relative z-10 overflow-hidden">
                <div className="text-center mb-6">
                    <div className="size-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                        <span className="material-symbols-outlined text-3xl">report_problem</span>
                    </div>
                    <h3 className="text-xl font-black text-[#2D241E]">Report Issue</h3>
                    <p className="text-xs text-gray-400 font-bold mt-1">
                        Order #{order.orderId} • {order.item}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">What went wrong?</label>
                        <select
                            value={issue}
                            onChange={(e) => setIssue(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                        >
                            <option value="">Select Issue Type</option>
                            {commonIssues.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block ml-1">Details</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            placeholder="Please describe the problem..."
                            className="w-full h-24 px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                        ></textarea>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-gray-100 text-[#5C4D42] rounded-xl font-black text-xs hover:bg-gray-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-red-500 text-white rounded-xl font-black text-xs shadow-lg shadow-red-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-70"
                        >
                            {loading ? 'Sending...' : 'Report Problem'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default ReportIssueModal;
