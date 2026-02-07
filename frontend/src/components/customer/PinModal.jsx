import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const PinModal = ({ isOpen, onClose, onSuccess, title = "Enter PIN", subtitle = "Secure your transaction", isSetting = false }) => {
    const [pin, setPin] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setPin(['', '', '', '']);
            setError('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleInput = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newPin = [...pin];
        newPin[index] = value.slice(-1);
        setPin(newPin);

        // Auto focus next
        if (value && index < 3) {
            const nextInput = document.getElementById(`pin-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            const prevInput = document.getElementById(`pin-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleSubmit = async () => {
        const fullPin = pin.join('');
        if (fullPin.length !== 4) {
            setError('Please enter all 4 digits');
            return;
        }

        setLoading(true);
        try {
            await onSuccess(fullPin);
            onClose();
        } catch (err) {
            setError(err.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#2D241E]/90 backdrop-blur-md" onClick={onClose}></div>
            <div className="bg-white rounded-[1.5rem] w-full max-w-[280px] p-5 shadow-2xl relative z-10 text-center animate-[scaleIn_0.2s_ease-out]">
                <div className="size-10 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-4 border border-orange-100/50">
                    <span className="material-symbols-outlined text-xl text-primary">
                        {isSetting ? 'lock_reset' : 'verified_user'}
                    </span>
                </div>

                <h3 className="text-lg font-black text-[#2D241E] mb-1 leading-tight">{title}</h3>
                <p className="text-[10px] font-black text-gray-400 mb-6 uppercase tracking-wider">{subtitle}</p>

                <div className="flex justify-center gap-2 mb-6">
                    {pin.map((digit, idx) => (
                        <input
                            key={idx}
                            id={`pin-${idx}`}
                            type="password"
                            inputMode="numeric"
                            value={digit}
                            autoFocus={idx === 0 && isOpen}
                            onChange={(e) => handleInput(idx, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                            className={`size-10 text-center text-xl font-black rounded-lg border transition-all outline-none ${digit ? 'border-primary bg-orange-50/20' : 'border-gray-100 bg-gray-50'
                                } focus:border-primary focus:bg-white active:scale-110`}
                        />
                    ))}
                </div>

                {error && <p className="text-red-500 text-[9px] font-black mb-4 animate-[shake_0.5s_ease-in-out] uppercase tracking-tighter">{error}</p>}

                <div className="space-y-2">
                    <button
                        onClick={handleSubmit}
                        disabled={loading || pin.some(d => !d)}
                        className="w-full py-2.5 bg-[#2D241E] text-white rounded-xl font-black text-xs shadow-lg hover:bg-black active:scale-95 transition-all disabled:opacity-30"
                    >
                        {loading ? '...' : 'CONFIRM'}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-2 text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] hover:text-red-500 transition-colors"
                    >
                        CANCEL
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default PinModal;
