import React, { useState } from 'react';
import { createPortal } from 'react-dom';

const AvatarSelectorModal = ({ isOpen, onClose, onSelect, currentAvatar }) => {
    const [seed, setSeed] = useState(Date.now());
    const [selected, setSelected] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);

    if (!isOpen) return null;

    // Generate 6 random avatars
    const avatars = Array.from({ length: 6 }).map((_, i) =>
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed + i}&backgroundColor=b6e3f4,c0aede,d1d4f9`
    );

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedFile(reader.result);
                setSelected(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleConfirm = () => {
        if (selected) {
            onSelect(selected);
            onClose();
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#2D241E]/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-[2rem] w-full max-w-md p-6 shadow-2xl relative z-10 animate-[scaleIn_0.2s_ease-out]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-[#2D241E]">Choose Avatar</h3>
                    <button onClick={onClose} className="size-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>

                {/* Upload Section */}
                <div className="mb-6">
                    <label className="flex items-center gap-4 p-3 rounded-xl border-2 border-dashed border-gray-200 cursor-pointer hover:border-primary/50 hover:bg-orange-50/50 transition-all group">
                        <div className="size-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                            <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">cloud_upload</span>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm text-[#2D241E]">Upload Custom Photo</h4>
                            <p className="text-[10px] text-gray-400">Supports JPG, PNG (Max 2MB)</p>
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                </div>

                <div className="border-t border-gray-100 my-4 relative">
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs font-bold text-gray-300">OR CHOOSE ONE</span>
                </div>

                {/* Avatar Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {avatars.map((avatar, i) => (
                        <button
                            key={i}
                            onClick={() => { setSelected(avatar); setUploadedFile(null); }}
                            className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all group ${selected === avatar ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-transparent hover:border-gray-200'}`}
                        >
                            <img src={avatar} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                            {selected === avatar && (
                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                    <div className="size-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                        <span className="material-symbols-outlined text-white text-xs font-bold">check</span>
                                    </div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex justify-center mb-6">
                    <button
                        onClick={() => setSeed(Date.now())}
                        className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">refresh</span>
                        Generate More
                    </button>
                </div>

                <button
                    onClick={handleConfirm}
                    disabled={!selected}
                    className="w-full py-3 bg-[#2D241E] text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-orange-500/20 transition-all"
                >
                    Set New Avatar
                </button>
            </div>
        </div>,
        document.body
    );
};

export default AvatarSelectorModal;
