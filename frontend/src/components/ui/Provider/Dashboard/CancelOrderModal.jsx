import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { IoClose, IoWarningOutline } from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import ProviderApi from '../../../../services/ProviderApi';

const CancelOrderModal = ({ isOpen, onClose, orderId, customerName, onCancelled }) => {
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reason.trim()) {
            toast.error('Please provide a reason for cancellation');
            return;
        }

        setLoading(true);
        try {
            const response = await ProviderApi.post('/provider-orders/cancel', {
                orderId,
                reason
            });

            if (response.data.success) {
                toast.success('Order cancelled successfully');
                if (response.data.message.includes('refunded')) {
                    toast.success('Refund processed to customer wallet', { icon: '💸' });
                }
                onCancelled();
                onClose();
            }
        } catch (error) {
            console.error('Cancel Order Error:', error);
            toast.error(error.response?.data?.message || 'Failed to cancel order');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            <div className="bg-white rounded-3xl w-full max-w-md relative z-10 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="bg-red-50 p-6 flex justify-between items-center border-b border-red-100">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-red-100 rounded-xl flex items-center justify-center">
                            <IoWarningOutline className="text-xl text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-red-900">Cancel Order</h3>
                            <p className="text-xs text-red-700/60">For {customerName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="size-8 rounded-lg hover:bg-red-100 flex items-center justify-center transition-colors text-red-400 hover:text-red-700">
                        <IoClose className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Reason for Cancellation</label>
                        <textarea
                            placeholder="e.g. Out of stock, Delivery issue, Emergency..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all h-24 resize-none"
                            autoFocus
                        />
                    </div>

                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-start gap-3">
                        <span className="material-symbols-outlined text-gray-500 text-[18px] mt-0.5">info</span>
                        <div className="space-y-1">
                            <p className="text-[11px] font-medium text-gray-600 leading-snug">
                                If the customer has already paid, the amount will be automatically refunded to their wallet.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-gray-400 tracking-wider hover:text-gray-600 transition-colors">Abort</button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-3 bg-red-600 text-white rounded-2xl text-sm font-bold tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'CONFIRM CANCEL'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default CancelOrderModal;
