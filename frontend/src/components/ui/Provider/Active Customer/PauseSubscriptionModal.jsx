import React, { useState } from 'react';
import { IoClose, IoPauseOutline } from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import ProviderApi from '../../../../services/ProviderApi';

const PauseSubscriptionModal = ({ isOpen, onClose, subscriptionId, customerName, onPaused }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        pauseFrom: '',
        pauseTo: '',
        reason: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.pauseFrom || !formData.pauseTo) {
            toast.error('Please select both start and end dates');
            return;
        }

        if (new Date(formData.pauseFrom) >= new Date(formData.pauseTo)) {
            toast.error('Pause Start Date must be before End Date');
            return;
        }

        setLoading(true);
        try {
            const response = await ProviderApi.put(`/provider-subscription/${subscriptionId}/pause`, formData);
            if (response.data.success) {
                toast.success(`Subscription for ${customerName} paused successfully`);
                onPaused();
                onClose();
            }
        } catch (error) {
            console.error('Pause Subscription Error:', error);
            toast.error(error.response?.data?.message || 'Failed to pause subscription');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            <div className="bg-white rounded-3xl w-full max-w-md relative z-10 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="bg-[#2D241E] p-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-white/10 rounded-xl flex items-center justify-center">
                            <IoPauseOutline className="text-xl text-orange-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Pause Subscription</h3>
                            <p className="text-xs text-white/60">For {customerName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="size-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors">
                        <IoClose className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Pause From</label>
                            <input
                                type="date"
                                required
                                min={new Date().toISOString().split('T')[0]}
                                value={formData.pauseFrom}
                                onChange={(e) => setFormData({ ...formData, pauseFrom: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Pause To</label>
                            <input
                                type="date"
                                required
                                min={formData.pauseFrom || new Date().toISOString().split('T')[0]}
                                value={formData.pauseTo}
                                onChange={(e) => setFormData({ ...formData, pauseTo: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Reason for Pause</label>
                        <textarea
                            placeholder="e.g. Customer out of town, Kitchen renovation etc."
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all h-24 resize-none"
                        />
                    </div>

                    <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl flex items-start gap-3">
                        <span className="material-symbols-outlined text-orange-500 text-[18px] mt-0.5">info</span>
                        <p className="text-[11px] font-medium text-orange-800 italic leading-snug">
                            Paused subscriptions will not generate daily orders for the selected duration. Customers will be notified.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-gray-400 tracking-wider hover:text-gray-600 transition-colors">Cancel</button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-3 bg-[#2D241E] text-white rounded-2xl text-sm font-bold tracking-widest hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'CONFIRM PAUSE'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PauseSubscriptionModal;
