import React, { useState } from 'react';
import { createPortal } from 'react-dom';

const WalletSettingsModal = ({ isOpen, onClose, settings, onUpdate }) => {
    const [localSettings, setLocalSettings] = useState(settings || {
        autoRecharge: false,
        thresholdAmount: 200,
        rechargeAmount: 500,
        lowBalanceAlert: true
    });

    if (!isOpen) return null;

    const handleToggle = (key) => {
        setLocalSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleValueChange = (key, value) => {
        setLocalSettings(prev => ({ ...prev, [key]: parseInt(value) || 0 }));
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#2D241E]/90 backdrop-blur-md" onClick={onClose}></div>
            <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl relative z-10 animate-[scaleIn_0.2s_ease-out]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black text-[#2D241E]">Wallet Settings</h3>
                    <button onClick={onClose} className="size-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Auto Recharge Section */}
                    <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">autorenew</span>
                                <h4 className="font-bold text-[#2D241E]">Auto Recharge</h4>
                            </div>
                            <button
                                onClick={() => handleToggle('autoRecharge')}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${localSettings.autoRecharge ? 'bg-primary' : 'bg-gray-300'}`}
                            >
                                <div className={`size-4 bg-white rounded-full shadow-md transition-transform ${localSettings.autoRecharge ? 'translate-x-6' : ''}`}></div>
                            </button>
                        </div>

                        {localSettings.autoRecharge && (
                            <div className="space-y-4 pt-2 border-t border-orange-100 animate-[slideDown_0.2s_ease-out]">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">When balance is below</label>
                                    <div className="flex gap-2">
                                        {[100, 200, 500].map(amt => (
                                            <button
                                                key={amt}
                                                onClick={() => handleValueChange('thresholdAmount', amt)}
                                                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${localSettings.thresholdAmount === amt ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-200'
                                                    }`}
                                            >
                                                ₹{amt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Recharge with</label>
                                    <div className="flex gap-2">
                                        {[500, 1000, 2000].map(amt => (
                                            <button
                                                key={amt}
                                                onClick={() => handleValueChange('rechargeAmount', amt)}
                                                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${localSettings.rechargeAmount === amt ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-200'
                                                    }`}
                                            >
                                                ₹{amt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Alerts Section */}
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-blue-500">notifications_active</span>
                                <h4 className="font-bold text-[#2D241E]">Low Balance Alert</h4>
                            </div>
                            <button
                                onClick={() => handleToggle('lowBalanceAlert')}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${localSettings.lowBalanceAlert ? 'bg-blue-500' : 'bg-gray-300'}`}
                            >
                                <div className={`size-4 bg-white rounded-full shadow-md transition-transform ${localSettings.lowBalanceAlert ? 'translate-x-6' : ''}`}></div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 bg-gray-100 rounded-[1.5rem] font-bold text-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onUpdate(localSettings)}
                        className="flex-1 py-4 bg-[#2D241E] text-white rounded-[1.5rem] font-bold shadow-xl shadow-black/10"
                    >
                        Save Settings
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default WalletSettingsModal;
