import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import { RazorpayMock } from './index';

const PaymentModal = ({ isOpen, onClose, amount, onSuccess, title = "Complete Payment", initialMethod = 'UPI' }) => {
    // Default 'online' to 'UPI' if passed from unified selection
    const [paymentMethod, setPaymentMethod] = useState(initialMethod === 'online' ? 'UPI' : initialMethod);

    useEffect(() => {
        if (isOpen) {
            setPaymentMethod(initialMethod === 'online' ? 'UPI' : initialMethod);
        }
    }, [isOpen, initialMethod]);
    const [processing, setProcessing] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const [showRazorpay, setShowRazorpay] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [razorpayOrder, setRazorpayOrder] = useState(null);

    if (!isOpen) return null;

    const handlePayment = async () => {
        if (paymentMethod === 'UPI' && !transactionId) {
            return;
        }

        if (paymentMethod === 'CARD') {
            try {
                setProcessing(true);
                const { data } = await axios.post('/api/customer/razorpay/create-order', {
                    amount: amount
                });

                if (data.success) {
                    setRazorpayOrder(data.order);
                    setShowRazorpay(true);
                }
            } catch (error) {
                console.error("Razorpay Error:", error);
            } finally {
                setProcessing(false);
            }
            return;
        }

        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            onSuccess({
                method: paymentMethod,
                amount: amount,
                totalAmount: amount,
                transactionId: paymentMethod === 'UPI' ? transactionId : null
            });
            onClose();
            setTransactionId('');
        }, 1500);
    };

    const handleRazorpaySuccess = async (response) => {
        try {
            setProcessing(true);
            const { data } = await axios.post('/api/customer/razorpay/verify-payment', {
                ...response,
                amount: amount
            });

            if (data.success) {
                onSuccess({
                    method: 'CARD',
                    amount: amount,
                    totalAmount: amount,
                    transactionId: response.razorpay_payment_id,
                    razorpayDetails: response
                });
                onClose();
            }
        } catch (error) {
            console.error("Verification failed");
        } finally {
            setProcessing(false);
            setShowRazorpay(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md animate-[fadeIn_0.2s]">
            <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 shadow-2xl animate-[slideUp_0.3s] relative overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <div>
                        <h3 className="text-xl font-bold text-[#2D241E]">{title}</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Payable Amount: ₹{amount}</p>
                    </div>
                    <button onClick={onClose} className="size-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
                        <span className="material-symbols-outlined text-[#2D241E]">close</span>
                    </button>
                </div>

                {/* Unified Content Area */}
                {!showConfirmation ? (
                    <div className="bg-gray-50 rounded-[2rem] p-6 mb-6 border border-gray-100 min-h-[350px] flex flex-col items-center justify-center space-y-6">

                        {/* Primary Option: UPI QR */}
                        <div className="text-center space-y-5 w-full">
                            <div className="size-40 bg-white p-5 rounded-[2.5rem] mx-auto shadow-sm border border-gray-200 flex items-center justify-center relative group">
                                <QRCodeSVG
                                    value={`upi://pay?pa=smarttiffin@upi&pn=Smart Tiffin System&am=${amount}&cu=INR&tn=Meal Subscription`}
                                    size={120}
                                />
                                <div className="absolute inset-x-0 -bottom-2 flex justify-center">
                                    <span className="bg-[#2D241E] text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Scan & Pay</span>
                                </div>
                            </div>

                            <div className="space-y-4 max-w-[280px] mx-auto">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter 12-digit Transaction ID"
                                        className={`w-full bg-white border-2 rounded-2xl px-5 py-4 font-bold text-[#2D241E] outline-none transition-all text-sm shadow-sm placeholder:text-gray-300 ${transactionId.length === 12 ? 'border-green-500/20' : 'border-transparent focus:border-black/5'}`}
                                        value={transactionId}
                                        onChange={(e) => {
                                            // Allow Letters & Numbers, and Auto-Uppercase
                                            const cleanInput = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 12);
                                            setTransactionId(cleanInput);
                                            if (paymentMethod !== 'UPI') setPaymentMethod('UPI');
                                        }}
                                    />
                                    {transactionId.length === 12 && (
                                        <div className="absolute inset-y-0 right-4 flex items-center">
                                            <span className="material-symbols-outlined text-green-500">check_circle</span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setShowConfirmation(true)}
                                    disabled={processing || transactionId.length !== 12}
                                    className="w-full py-4 bg-[#2D241E] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-3"
                                >
                                    <span className="uppercase tracking-widest text-[10px]">Verify & Proceed</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full">
                            <div className="h-px bg-gray-200 flex-1"></div>
                            <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">OR</span>
                            <div className="h-px bg-gray-200 flex-1"></div>
                        </div>

                        {/* Secondary Option: Other Methods */}
                        <button
                            onClick={() => {
                                setPaymentMethod('CARD');
                                setShowConfirmation(true);
                            }}
                            disabled={processing}
                            className="flex items-center gap-3 px-6 py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
                        >
                            <span className="material-symbols-outlined text-gray-400 group-hover:text-blue-500">credit_card</span>
                            <div className="text-left">
                                <p className="text-[10px] font-black text-[#2D241E] uppercase tracking-tight group-hover:text-blue-600">Cards & Netbanking</p>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Secure Razorpay Gateway</p>
                            </div>
                        </button>
                    </div>
                ) : (
                    // Confirmation View
                    <div className="bg-gray-50 rounded-[2rem] p-6 mb-6 border border-gray-100 min-h-[350px] flex flex-col items-center justify-center space-y-6 animate-[fadeIn_0.3s]">
                        <div className="size-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
                            <span className="material-symbols-outlined text-4xl text-green-600">secure</span>
                        </div>

                        <div className="text-center space-y-1">
                            <h4 className="text-lg font-black text-[#2D241E]">Confirm Payment</h4>
                            <p className="text-xs font-bold text-gray-400">Please review before proceeding</p>
                        </div>

                        <div className="w-full bg-white rounded-xl p-4 border border-gray-200 space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-gray-400">Amount</span>
                                <span className="font-black text-[#2D241E] text-lg">₹{amount}</span>
                            </div>
                            <div className="h-px bg-gray-100"></div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-gray-400">Method</span>
                                <span className="font-bold text-[#2D241E] bg-gray-100 px-2 py-1 rounded-md uppercase">{paymentMethod}</span>
                            </div>
                            {paymentMethod === 'UPI' && (
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-gray-400">Transaction ID</span>
                                    <span className="font-mono font-bold text-[#2D241E]">{transactionId}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 w-full">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="flex-1 py-3 rounded-xl font-bold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-colors uppercase text-[10px] tracking-widest"
                            >
                                Back
                            </button>
                            <button
                                onClick={handlePayment}
                                disabled={processing}
                                className="flex-1 py-3 bg-[#2D241E] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center uppercase text-[10px] tracking-widest gap-2"
                            >
                                {processing ? (
                                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <span>Pay Now</span>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                <p className="text-[8px] text-center font-bold text-gray-300 uppercase tracking-[0.3em] mt-6">
                    Secured by Smart Tiffin Payments
                </p>

            </div>

            {/* Razorpay Mock Integration */}
            <RazorpayMock
                isOpen={showRazorpay}
                onClose={() => setShowRazorpay(false)}
                amount={amount}
                orderId={razorpayOrder?.id}
                onSuccess={handleRazorpaySuccess}
            />
        </div>,
        document.body
    );
};

export default PaymentModal;
