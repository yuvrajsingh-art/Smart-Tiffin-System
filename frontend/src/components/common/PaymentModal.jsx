import React, { useState } from 'react';
import { createPortal } from 'react-dom';

const PaymentModal = ({ isOpen, onClose, amount, onSuccess, title = "Complete Payment" }) => {
    const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI, CARD, CASH, INSTALLMENT
    const [processing, setProcessing] = useState(false);
    const [installments, setInstallments] = useState(2); // Default 2 parts

    if (!isOpen) return null;

    const handlePayment = () => {
        setProcessing(true);
        // Simulate API Call
        setTimeout(() => {
            setProcessing(false);
            onSuccess({
                method: paymentMethod,
                amount: paymentMethod === 'INSTALLMENT' ? amount / installments : amount,
                isPartial: paymentMethod === 'INSTALLMENT',
                totalAmount: amount
            });
            onClose();
        }, 2000);
    };

    const installmentAmount = Math.ceil(amount / installments);

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md animate-[fadeIn_0.2s]">
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 shadow-2xl animate-[slideUp_0.3s] relative overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <div>
                        <h3 className="text-xl font-bold text-[#2D241E]">{title}</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total: ₹{amount}</p>
                    </div>
                    <button onClick={onClose} className="size-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <span className="material-symbols-outlined text-[#2D241E]">close</span>
                    </button>
                </div>

                {/* Methods Grid */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                    {['UPI', 'CARD', 'CASH', 'IST'].map((method) => (
                        <button
                            key={method}
                            onClick={() => setPaymentMethod(method === 'IST' ? 'INSTALLMENT' : method)}
                            className={`flex flex-col items-center justify-center gap-1 py-3 rounded-2xl border-2 transition-all ${(paymentMethod === method || (method === 'IST' && paymentMethod === 'INSTALLMENT'))
                                    ? 'border-[#2D241E] bg-[#2D241E] text-white'
                                    : 'border-gray-100 bg-gray-50 text-gray-400 hover:bg-gray-100'
                                }`}
                        >
                            <span className="material-symbols-outlined text-xl">
                                {method === 'UPI' ? 'qr_code_scanner' :
                                    method === 'CARD' ? 'credit_card' :
                                        method === 'CASH' ? 'payments' : 'pie_chart'}
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-wider">
                                {method === 'IST' ? 'Kist' : method}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Dynamic Content Based on Method */}
                <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">

                    {paymentMethod === 'UPI' && (
                        <div className="text-center space-y-3">
                            <div className="size-32 bg-white p-3 rounded-xl mx-auto shadow-sm border border-gray-200">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR" className="w-full h-full opacity-80" />
                            </div>
                            <p className="text-xs font-bold text-gray-400">Scan to pay with Any UPI App</p>
                        </div>
                    )}

                    {paymentMethod === 'CARD' && (
                        <div className="space-y-3">
                            <input placeholder="Card Number" className="w-full bg-white p-3 rounded-xl text-sm font-bold outline-none border border-gray-200 focus:border-[#2D241E]" />
                            <div className="flex gap-3">
                                <input placeholder="MM/YY" className="w-full bg-white p-3 rounded-xl text-sm font-bold outline-none border border-gray-200 focus:border-[#2D241E]" />
                                <input placeholder="CVV" className="w-full bg-white p-3 rounded-xl text-sm font-bold outline-none border border-gray-200 focus:border-[#2D241E]" />
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'CASH' && (
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined">local_shipping</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-[#2D241E]">Pay on Delivery</h4>
                                <p className="text-xs text-gray-500 font-medium">Cash will be collected by the delivery partner.</p>
                            </div>
                        </div>
                    )}

                    {paymentMethod === 'INSTALLMENT' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase">Pay in Parts (Kist)</span>
                                <span className="bg-[#2D241E] text-white text-[10px] font-bold px-2 py-1 rounded">0% Interest</span>
                            </div>

                            <input
                                type="range"
                                min="2"
                                max="4"
                                step="1"
                                value={installments}
                                onChange={(e) => setInstallments(parseInt(e.target.value))}
                                className="w-full accent-[#2D241E] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />

                            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                                <span>2 Parts</span>
                                <span>3 Parts</span>
                                <span>4 Parts</span>
                            </div>

                            <div className="bg-white p-3 rounded-xl border border-gray-200 flex justify-between items-center">
                                <span className="text-xs font-bold text-[#2D241E]">Pay Now</span>
                                <span className="text-lg font-bold text-[#2D241E]">₹{installmentAmount}</span>
                            </div>
                            <p className="text-[10px] text-gray-400 text-center font-bold">Remaining amount will be auto-debited next month.</p>
                        </div>
                    )}
                </div>

                {/* Footer Action */}
                <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full py-4 bg-[#2D241E] text-white rounded-[1.5rem] font-bold shadow-xl shadow-gray-900/10 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    {processing ? (
                        <span className="material-symbols-outlined animate-spin">sync</span>
                    ) : (
                        <>
                            <span>Pay {paymentMethod === 'CASH' ? 'on Delivery' : `₹${paymentMethod === 'INSTALLMENT' ? installmentAmount : amount}`}</span>
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </>
                    )}
                </button>

            </div>
        </div>,
        document.body
    );
};

export default PaymentModal;
