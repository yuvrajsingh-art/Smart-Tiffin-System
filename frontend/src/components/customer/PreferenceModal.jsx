import React from 'react';
import { createPortal } from 'react-dom';

const PreferenceModal = ({ isOpen, onClose, activeMealType, preferences, setPreferences, onSave, walletBalance = 0, originalPreferences }) => {
    const [paymentMethod, setPaymentMethod] = React.useState('wallet');
    if (!isOpen) return null;

    const currentPrefs = preferences[activeMealType];
    const originalPrefs = originalPreferences?.[activeMealType] || { extras: { extraRoti: 0, extraRice: false } };

    // Calculate Total Cost
    const totalRotiCost = (currentPrefs.extras?.extraRoti || 0) * 10;
    const totalRiceCost = currentPrefs.extras?.extraRice ? 30 : 0;
    const totalExtraCost = totalRotiCost + totalRiceCost;

    // Calculate Already Paid (from original state)
    const paidRotiCost = (originalPrefs.extras?.extraRoti || 0) * 10;
    const paidRiceCost = originalPrefs.extras?.extraRice ? 30 : 0;
    const alreadyPaidCost = paidRotiCost + paidRiceCost;

    const payableDifference = Math.max(0, totalExtraCost - alreadyPaidCost);

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-md animate-[fadeIn_0.2s]">
            <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 shadow-2xl animate-[slideUp_0.3s] relative overflow-hidden">

                {/* Decorative Background for Modal */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-[#2D241E]">Customize Meal</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{activeMealType}</p>
                        </div>
                        <button onClick={onClose} className="size-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors group">
                            <span className="material-symbols-outlined text-[#2D241E] group-hover:rotate-90 transition-transform">close</span>
                        </button>
                    </div>

                    {/* Spice Level */}
                    <div className="mb-6">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Spice Level</label>
                        <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
                            {['Low', 'Medium', 'High'].map(level => (
                                <button
                                    key={level}
                                    onClick={() => setPreferences(prev => ({
                                        ...prev,
                                        [activeMealType]: { ...prev[activeMealType], spice: level }
                                    }))}
                                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${currentPrefs.spice === level
                                        ? 'bg-white text-[#2D241E] shadow-sm scale-100'
                                        : 'text-gray-400 hover:text-gray-600 scale-95'
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Add-ons */}
                    <div className="mb-6">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Add-ons (Extras)</label>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Extra Roti */}
                            <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border border-gray-100">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Extra Roti</span>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setPreferences(prev => ({
                                            ...prev,
                                            [activeMealType]: {
                                                ...prev[activeMealType],
                                                extras: { ...prev[activeMealType].extras, extraRoti: Math.max(0, (prev[activeMealType].extras?.extraRoti || 0) - 1) }
                                            }
                                        }))}
                                        className="size-8 rounded-full bg-white shadow-sm flex items-center justify-center active:scale-90 transition-transform"
                                    >
                                        <span className="material-symbols-outlined text-lg">remove</span>
                                    </button>
                                    <span className="font-bold text-[#2D241E]">{currentPrefs.extras?.extraRoti || 0}</span>
                                    <button
                                        onClick={() => setPreferences(prev => ({
                                            ...prev,
                                            [activeMealType]: {
                                                ...prev[activeMealType],
                                                extras: { ...prev[activeMealType].extras, extraRoti: (prev[activeMealType].extras?.extraRoti || 0) + 1 }
                                            }
                                        }))}
                                        className="size-8 rounded-full bg-white shadow-sm flex items-center justify-center active:scale-90 transition-transform"
                                    >
                                        <span className="material-symbols-outlined text-lg">add</span>
                                    </button>
                                </div>
                            </div>

                            {/* Extra Rice */}
                            <button
                                onClick={() => setPreferences(prev => ({
                                    ...prev,
                                    [activeMealType]: {
                                        ...prev[activeMealType],
                                        extras: { ...prev[activeMealType].extras, extraRice: !prev[activeMealType].extras?.extraRice }
                                    }
                                }))}
                                className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all ${currentPrefs.extras?.extraRice ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-100'}`}
                            >
                                <span className={`text-[10px] font-bold uppercase ${currentPrefs.extras?.extraRice ? 'text-orange-500' : 'text-gray-400'}`}>Extra Rice</span>
                                <span className={`material-symbols-outlined text-2xl ${currentPrefs.extras?.extraRice ? 'text-orange-500 fill-1' : 'text-gray-300'}`}>
                                    {currentPrefs.extras?.extraRice ? 'check_circle' : 'circle'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Payment Method Selector (Only if extras > 0) */}
                    {totalExtraCost > 0 && (
                        <div className="mb-8 p-5 bg-orange-50/50 rounded-[2rem] border border-orange-100 animate-[fadeIn_0.3s]">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Total Extras</p>
                                    <p className="text-xl font-black text-[#2D241E]">₹{totalExtraCost}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Wallet Balance</p>
                                    <p className={`font-bold text-xs ${walletBalance < 0 ? 'text-red-500' : 'text-green-600'}`}>₹{walletBalance}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 p-1 bg-white/60 rounded-xl">
                                <button
                                    onClick={() => setPaymentMethod('wallet')}
                                    className={`flex-1 py-2 rounded-lg font-bold text-[10px] uppercase transition-all flex items-center justify-center gap-1 ${paymentMethod === 'wallet' ? 'bg-[#2D241E] text-white shadow-md' : 'text-gray-400'}`}
                                >
                                    <span className="material-symbols-outlined text-sm">account_balance_wallet</span> Wallet
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('online')}
                                    className={`flex-1 py-2 rounded-lg font-bold text-[10px] uppercase transition-all flex items-center justify-center gap-1 ${paymentMethod === 'online' ? 'bg-primary text-white shadow-md' : 'text-gray-400'}`}
                                >
                                    <span className="material-symbols-outlined text-sm">payments</span> Online
                                </button>
                            </div>

                            {paymentMethod === 'wallet' && walletBalance < totalExtraCost && (
                                <p className="text-[9px] text-orange-600 font-bold mt-2 text-center animate-pulse">
                                    Low balance! This will be added to your debt (Udhaar).
                                </p>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors text-xs uppercase"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onSave({ ...currentPrefs, paymentMethod })}
                            className="flex-[2] py-4 bg-[#2D241E] hover:bg-[#3D342E] text-white rounded-2xl font-bold shadow-lg shadow-[#2D241E]/20 transition-all active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                        >
                            <span>Confirm & Save</span>
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default PreferenceModal;
