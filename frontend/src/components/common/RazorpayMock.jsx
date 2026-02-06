import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const RazorpayMock = ({ isOpen, onClose, amount, orderId, onSuccess, messName = "Smart Tiffin" }) => {
    const [step, setStep] = useState('loading'); // loading, methods, processing, success
    const [selectedMethod, setSelectedMethod] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setStep('loading');
            const timer = setTimeout(() => setStep('methods'), 1200);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handlePayment = (method) => {
        setSelectedMethod(method);
        setStep('processing');

        // Simulating Bank/Gateway Processing
        setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onSuccess({
                    razorpay_order_id: orderId,
                    razorpay_payment_id: `pay_${Math.random().toString(36).slice(2, 11).toUpperCase()}`,
                    razorpay_signature: 'mock_signature_verified'
                });
                onClose();
            }, 1500);
        }, 2500);
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative w-full max-w-[400px] bg-white rounded-lg shadow-2xl overflow-hidden animate-[scaleIn_0.3s_ease-out]">
                {/* Header */}
                <div className="bg-[#2D241E] p-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="size-8 bg-white/10 rounded flex items-center justify-center">
                            <span className="material-symbols-outlined text-white text-lg">local_mall</span>
                        </div>
                        <div>
                            <h3 className="text-[10px] font-bold opacity-60 uppercase tracking-widest leading-none mb-1">Paying To</h3>
                            <p className="text-sm font-black leading-none">{messName}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest leading-none mb-1">Amount</p>
                        <p className="text-sm font-black leading-none">₹{amount.toLocaleString()}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-gray-100 w-full overflow-hidden">
                    <div className={`h-full bg-blue-500 transition-all duration-[3000ms] ${step === 'processing' ? 'w-full' : 'w-0'}`}></div>
                </div>

                {/* Content */}
                <div className="min-h-[300px] flex flex-col items-center justify-center p-8 bg-[#F8F9FA]">

                    {step === 'loading' && (
                        <div className="text-center">
                            <div className="size-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Opening Secure Gateway...</p>
                        </div>
                    )}

                    {step === 'methods' && (
                        <div className="w-full space-y-4">
                            <div className="text-center mb-6">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Select Payment Method</p>
                                <p className="text-[10px] text-blue-500 font-bold">Securely Managed by Razorpay Simulation</p>
                            </div>

                            {[
                                { id: 'card', name: 'Card', icon: 'credit_card', desc: 'Visa, Mastercard, RuPay' },
                                { id: 'vpa', name: 'UPI', icon: 'qr_code_2', desc: 'Google Pay, PhonePe, Paytm' },
                                { id: 'net', name: 'Netbanking', icon: 'account_balance', desc: 'All Indian Banks' }
                            ].map(m => (
                                <button
                                    key={m.id}
                                    onClick={() => handlePayment(m.id)}
                                    className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-blue-50">
                                            <span className="material-symbols-outlined text-gray-400 group-hover:text-blue-500 text-xl">{m.icon}</span>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-black text-[#2D241E] leading-none mb-1">{m.name}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{m.desc}</p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-300 group-hover:text-blue-500 text-lg transition-colors">chevron_right</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 'processing' && (
                        <div className="text-center">
                            <div className="size-16 relative mx-auto mb-6">
                                <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-blue-500 text-2xl animate-pulse">lock</span>
                                </div>
                            </div>
                            <h4 className="text-lg font-black text-[#2D241E] mb-2 uppercase tracking-tight">Processing Payment</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                                Please do not close this window <br /> or press the back button.
                            </p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="text-center">
                            <div className="size-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-100 animate-[bounce_0.5s_ease-out]">
                                <span className="material-symbols-outlined text-white text-4xl font-bold">check</span>
                            </div>
                            <h4 className="text-lg font-black text-[#2D241E] mb-2 uppercase tracking-tight">Payment Successful</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                                Order Verified Successfully <br /> Redirecting you back...
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-center gap-4 opacity-40">
                    <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="h-4 grayscale" />
                    <div className="w-px h-3 bg-gray-300"></div>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.2em]">Verified Secure Checkout</p>
                </div>
            </div>

            <style>{`
                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>,
        document.body
    );
};

export default RazorpayMock;
