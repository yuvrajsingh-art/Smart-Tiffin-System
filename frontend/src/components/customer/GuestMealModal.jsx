import React, { useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Guest Meal Booking Modal
 * Premium UX for booking guest meals for today or future dates
 */
const GuestMealModal = ({
    isOpen,
    onClose,
    onBook,        // (data) => { date, lunch, dinner, payNow, paymentMethod, transactionId }
    walletBalance = 0,
    isProcessing = false
}) => {
    // Date Selection
    const [selectedDate, setSelectedDate] = useState('today');
    const [customDate, setCustomDate] = useState('');

    // Quantities
    const [lunchQty, setLunchQty] = useState(0);
    const [dinnerQty, setDinnerQty] = useState(0);

    // Payment
    const [paymentMethod, setPaymentMethod] = useState('wallet');
    const [utrNumber, setUtrNumber] = useState('');

    const PRICE_PER_MEAL = 150;
    const totalMeals = lunchQty + dinnerQty;
    const totalCost = totalMeals * PRICE_PER_MEAL;

    // Get actual date string
    const getBookingDate = () => {
        const today = new Date();
        if (selectedDate === 'today') {
            return today.toISOString().split('T')[0];
        } else if (selectedDate === 'tomorrow') {
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            return tomorrow.toISOString().split('T')[0];
        } else {
            return customDate;
        }
    };

    // Date display helper
    const getDateDisplay = () => {
        const date = getBookingDate();
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    };

    // Handle booking
    const handleSubmit = (payNow) => {
        if (totalMeals === 0) return;

        const bookingData = {
            date: getBookingDate(),
            lunch: lunchQty,
            dinner: dinnerQty,
            payNow,
            paymentMethod: payNow ? paymentMethod : null,
            transactionId: paymentMethod === 'upi' ? utrNumber : null,
            totalCost
        };

        onBook(bookingData);
    };

    // Check if can pay with wallet
    const canPayWallet = walletBalance >= totalCost;

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-orange-500 p-5 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-2xl">group_add</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-black">Book Guest Meals</h2>
                                <p className="text-sm text-white/80">₹{PRICE_PER_MEAL} per meal</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="size-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-5">
                    {/* Date Selection */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                            📅 Select Date
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedDate('today')}
                                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${selectedDate === 'today'
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Today
                            </button>
                            <button
                                onClick={() => setSelectedDate('tomorrow')}
                                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${selectedDate === 'tomorrow'
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Tomorrow
                            </button>
                            <button
                                onClick={() => setSelectedDate('custom')}
                                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${selectedDate === 'custom'
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                Other
                            </button>
                        </div>

                        {/* Custom Date Picker */}
                        {selectedDate === 'custom' && (
                            <input
                                type="date"
                                value={customDate}
                                onChange={(e) => setCustomDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full mt-3 p-3 border-2 border-gray-200 rounded-xl focus:border-primary outline-none text-gray-700 font-medium"
                            />
                        )}
                    </div>

                    {/* Quantity Selectors */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Lunch */}
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-2xl border border-orange-100">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">🌞</span>
                                <span className="font-bold text-gray-800">Lunch</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setLunchQty(Math.max(0, lunchQty - 1))}
                                    className="size-10 bg-white rounded-full flex items-center justify-center font-bold text-xl text-gray-500 hover:bg-gray-50 shadow-sm border"
                                >
                                    −
                                </button>
                                <span className="text-3xl font-black text-primary">{lunchQty}</span>
                                <button
                                    onClick={() => setLunchQty(lunchQty + 1)}
                                    className="size-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl hover:bg-primary/90 shadow-lg shadow-primary/30"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Dinner */}
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-100">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl">🌙</span>
                                <span className="font-bold text-gray-800">Dinner</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setDinnerQty(Math.max(0, dinnerQty - 1))}
                                    className="size-10 bg-white rounded-full flex items-center justify-center font-bold text-xl text-gray-500 hover:bg-gray-50 shadow-sm border"
                                >
                                    −
                                </button>
                                <span className="text-3xl font-black text-indigo-600">{dinnerQty}</span>
                                <button
                                    onClick={() => setDinnerQty(dinnerQty + 1)}
                                    className="size-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/30"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method (only if paying now) */}
                    {totalMeals > 0 && (
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                                💳 Payment Method
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPaymentMethod('wallet')}
                                    className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${paymentMethod === 'wallet'
                                        ? 'bg-green-100 text-green-700 border-2 border-green-400'
                                        : 'bg-gray-100 text-gray-600 border-2 border-transparent'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
                                    Wallet (₹{walletBalance})
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('upi')}
                                    className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${paymentMethod === 'upi'
                                        ? 'bg-purple-100 text-purple-700 border-2 border-purple-400'
                                        : 'bg-gray-100 text-gray-600 border-2 border-transparent'
                                        }`}
                                >
                                    <span className="text-lg">📱</span>
                                    UPI
                                </button>
                            </div>

                            {/* UPI Input */}
                            {paymentMethod === 'upi' && (
                                <input
                                    type="text"
                                    value={utrNumber}
                                    onChange={(e) => setUtrNumber(e.target.value)}
                                    placeholder="Enter 12-digit UTR Number"
                                    maxLength={12}
                                    className="w-full mt-3 p-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 outline-none text-gray-700 font-mono text-center tracking-widest"
                                />
                            )}

                            {/* Wallet warning */}
                            {paymentMethod === 'wallet' && !canPayWallet && totalCost > 0 && (
                                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">warning</span>
                                    Insufficient balance. Need ₹{totalCost - walletBalance} more.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 pt-0 space-y-3">
                    {/* Summary */}
                    {totalMeals > 0 && (
                        <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500">
                                    {totalMeals} meal{totalMeals > 1 ? 's' : ''} • {getDateDisplay()}
                                </p>
                                <p className="text-2xl font-black text-gray-800">₹{totalCost}</p>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleSubmit(false)}
                            disabled={totalMeals === 0 || isProcessing}
                            className="flex-1 py-4 rounded-2xl font-bold text-sm border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            Book (Pay Later)
                        </button>
                        <button
                            onClick={() => handleSubmit(true)}
                            disabled={
                                totalMeals === 0 ||
                                isProcessing ||
                                (paymentMethod === 'wallet' && !canPayWallet) ||
                                (paymentMethod === 'upi' && utrNumber.length !== 12)
                            }
                            className="flex-1 py-4 bg-gradient-to-r from-primary to-orange-500 text-white rounded-2xl font-bold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <span className="animate-spin">⏳</span>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Pay Now ₹{totalCost}
                                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default GuestMealModal;
