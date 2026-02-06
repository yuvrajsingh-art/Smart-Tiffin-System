import React from 'react';
import { createPortal } from 'react-dom';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    showSyncOption = false,
    syncText = "Apply to all meals",
    isDestructive = false
}) => {
    const [applyToAll, setApplyToAll] = React.useState(false);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-[fadeIn_0.2s]">
            <div className="bg-white/90 backdrop-blur-xl w-full max-w-sm rounded-[2.5rem] border border-white/60 shadow-2xl p-8 animate-[scaleIn_0.3s_ease-out] relative overflow-hidden">
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10 text-center">
                    <div className={`size-16 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg ${isDestructive ? 'bg-red-50 text-red-500 shadow-red-500/10' : 'bg-orange-50 text-orange-500 shadow-orange-500/10'}`}>
                        <span className="material-symbols-outlined text-3xl">
                            {isDestructive ? 'warning' : 'help'}
                        </span>
                    </div>

                    <h3 className="text-xl font-black text-[#2D241E] mb-2">{title}</h3>
                    <p className="text-sm font-medium text-[#5C4D42] opacity-80 leading-relaxed mb-8">
                        {message}
                    </p>

                    {showSyncOption && (
                        <button
                            onClick={() => setApplyToAll(!applyToAll)}
                            className="flex items-center gap-3 mx-auto mb-8 group cursor-pointer"
                        >
                            <div className={`size-5 rounded-lg border-2 transition-all flex items-center justify-center ${applyToAll ? 'bg-[#2D241E] border-[#2D241E]' : 'border-gray-200 group-hover:border-primary'}`}>
                                {applyToAll && <span className="material-symbols-outlined text-white text-[14px] font-bold">check</span>}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[#2D241E] transition-colors">{syncText}</span>
                        </button>
                    )}

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => onConfirm(applyToAll)}
                            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 ${isDestructive ? 'bg-red-500 text-white shadow-red-500/20 hover:bg-red-600' : 'bg-[#2D241E] text-white shadow-black/20 hover:bg-black'}`}
                        >
                            {confirmText}
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmationModal;
