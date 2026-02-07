import React from 'react';
import { createPortal } from 'react-dom';

const MealTicketModal = ({ isOpen, onClose, meal }) => {
    if (!isOpen || !meal) return null;

    const handlePrint = () => {
        const printContent = document.getElementById('meal-ticket-content');
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s]">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">

                {/* Header Actions */}
                <div className="flex justify-between items-center p-4 bg-[#2D241E] text-white">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <span className="material-symbols-outlined">confirmation_number</span>
                        Meal Ticket
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrint}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            title="Print Ticket"
                        >
                            <span className="material-symbols-outlined">print</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                {/* Ticket Content */}
                <div id="meal-ticket-content" className="bg-gray-100 p-6">
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden relative dashed-separator">
                        {/* Top Section */}
                        <div className="p-6 bg-primary text-white relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 opacity-20">
                                <span className="material-symbols-outlined text-9xl">lunch_dining</span>
                            </div>
                            <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">{meal.mess}</p>
                            <h1 className="text-2xl font-black">{meal.type} Meal</h1>
                            <p className="text-sm font-medium opacity-90 mt-2 flex items-center gap-1">
                                <span className="material-symbols-outlined text-base">calendar_today</span>
                                {meal.date}
                            </p>
                        </div>

                        {/* Middle Section */}
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Item</p>
                                    <p className="font-bold text-lg text-[#2D241E]">{meal.item}</p>
                                    <p className="text-xs font-medium text-gray-400">{meal.mainDish}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Qty</p>
                                    <p className="font-black text-xl text-primary">x{meal.quantity}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Order ID</p>
                                    <p className="font-bold text-sm bg-gray-50 px-2 py-1 rounded-md inline-block border border-gray-100">
                                        {meal.orderId}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Status</p>
                                    <span className={`px-2 py-1 rounded-md text-xs font-black uppercase inline-block ${meal.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                        meal.status === 'Skipped' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {meal.status}
                                    </span>
                                </div>
                            </div>

                            {meal.isGuest && (
                                <div className="border-t border-dashed border-gray-200 pt-4">
                                    <div className="flex justify-between items-center">
                                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">Total Paid</p>
                                        <p className="font-black text-lg text-[#2D241E]">₹{meal.amount}</p>
                                    </div>
                                    <p className="text-[10px] text-right text-green-600 font-bold mt-1">Paid via Wallet/Online</p>
                                </div>
                            )}
                        </div>

                        {/* Bottom Tear-off Section */}
                        <div className="bg-gray-50 p-6 border-t border-dashed border-gray-200 relative">
                            {/* Cutout Circles */}
                            <div className="absolute -left-3 -top-3 size-6 bg-gray-100 rounded-full"></div>
                            <div className="absolute -right-3 -top-3 size-6 bg-gray-100 rounded-full"></div>

                            <div className="flex items-center gap-4">
                                <div className="size-16 bg-white p-1 rounded-lg border border-gray-200 shadow-sm flex items-center justify-center">
                                    {/* Mock QR */}
                                    <span className="material-symbols-outlined text-4xl text-gray-800">qr_code_2</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Delivery Address</p>
                                    <p className="text-xs font-bold text-gray-600 truncate">
                                        {meal.deliveryAddress?.street || 'Registered Address'}
                                    </p>
                                    <p className="text-[10px] text-gray-400 truncate">
                                        {meal.deliveryAddress?.city}, {meal.deliveryAddress?.zipCode}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-[10px] text-gray-400 font-bold mt-4 uppercase tracking-widest">
                        Smart Tiffin • Verified Order
                    </p>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default MealTicketModal;
