import React from 'react';
import { createPortal } from 'react-dom';

const PreferenceModal = ({ isOpen, onClose, activeMealType, preferences, setPreferences, onSave }) => {
    if (!isOpen) return null;

    const currentPrefs = preferences[activeMealType];

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

                    {/* Note */}
                    <div className="mb-8">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Special Instructions</label>
                        <textarea
                            value={currentPrefs.note}
                            onChange={(e) => setPreferences(prev => ({
                                ...prev,
                                [activeMealType]: { ...prev[activeMealType], note: e.target.value }
                            }))}
                            placeholder="Any preferences? (e.g. No Onion)"
                            className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-bold text-[#2D241E] border border-transparent outline-none focus:bg-white focus:border-primary/20 focus:shadow-sm transition-all resize-none h-28 placeholder:font-medium placeholder:text-gray-300"
                        />
                    </div>

                    <button
                        onClick={() => onSave(currentPrefs)}
                        className="w-full py-4 bg-[#2D241E] text-white rounded-[1.5rem] font-bold shadow-xl shadow-orange-900/10 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                    >
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        <span>Save Preferences</span>
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default PreferenceModal;
