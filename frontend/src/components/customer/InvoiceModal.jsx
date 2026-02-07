import React from 'react';
import { createPortal } from 'react-dom';

const InvoiceModal = ({ isOpen, onClose, transaction, user }) => {
    if (!isOpen || !transaction) return null;

    const handlePrint = () => {
        const printContent = document.getElementById('invoice-content');
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Reload to restore event listeners
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s]">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">

                {/* Header Actions */}
                <div className="flex justify-end p-4 gap-2 sticky top-0 bg-white z-10 border-b border-gray-100">
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-[#2D241E] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-colors"
                    >
                        <span className="material-symbols-outlined">print</span>
                        Print / Save PDF
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Printable Content */}
                <div id="invoice-content" className="p-8 md:p-12 bg-white text-[#2D241E]">
                    {/* Invoice Header */}
                    <div className="flex justify-between items-start mb-12 border-b border-gray-100 pb-8">
                        <div>
                            <h1 className="text-3xl font-black uppercase tracking-tight mb-2">Invoice</h1>
                            <p className="font-bold opacity-50">#INV-{transaction.id.slice(-6).toUpperCase()}</p>
                            <p className="text-sm font-medium text-gray-400 mt-1">{transaction.date}</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-black text-primary">Smart Tiffin</h2>
                            <p className="text-xs font-bold text-gray-400 mt-1 max-w-[150px]">
                                Premium Homemade Food Delivery
                            </p>
                        </div>
                    </div>

                    {/* Bill To & From */}
                    <div className="flex justify-between mb-12">
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Billed To</p>
                            <p className="font-bold text-lg">{user?.fullName || 'Customer'}</p>
                            <p className="text-sm font-medium text-gray-500">{user?.email}</p>
                            <p className="text-sm font-medium text-gray-500">{user?.phone}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Payment Details</p>
                            <p className="font-bold">{transaction.status}</p>
                            <p className="text-sm font-medium text-gray-500">{transaction.title}</p>
                            <p className="text-xs font-bold text-gray-400 mt-1 uppercase">{transaction.referenceId || transaction.subtitle}</p>
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="mb-12">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-gray-100">
                                    <th className="py-3 text-xs font-black uppercase tracking-widest text-gray-400">Description</th>
                                    <th className="py-3 text-right text-xs font-black uppercase tracking-widest text-gray-400">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-50">
                                    <td className="py-4 font-bold">
                                        {transaction.title}
                                        {transaction.subtitle && (
                                            <span className="block text-xs font-medium text-gray-400 mt-1">
                                                Ref: {transaction.subtitle}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 text-right font-bold">₹{transaction.amount}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Total */}
                    <div className="flex justify-end mb-12">
                        <div className="w-full max-w-xs">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="font-bold text-gray-500">Subtotal</span>
                                <span className="font-bold">₹{transaction.amount}</span>
                            </div>
                            <div className="flex justify-between py-4">
                                <span className="text-xl font-black">Total</span>
                                <span className="text-xl font-black text-primary">₹{transaction.amount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center border-t border-gray-100 pt-8">
                        <p className="font-bold text-sm text-gray-400">Thank you for choosing Smart Tiffin!</p>
                        <p className="text-xs font-medium text-gray-300 mt-2">
                            For support, contact help@smarttiffin.com
                        </p>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default InvoiceModal;
