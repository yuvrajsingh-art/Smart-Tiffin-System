import React from 'react';

const Step1Identity = ({ formData, setFormData, onNext }) => {
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        // Simplified file handling for UI
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, logo: file.name });
            // In a real app, you'd handle image preview or upload here
        }
    };

    return (
        <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="text-center mb-8">
                <h2 className="text-xl font-black text-[#2D241E]">Kitchen Identity</h2>
                <p className="text-sm text-[#2D241E]/60 font-medium text-pretty mt-1">Tell us about your mess. This is how customers will see you.</p>
            </div>

            <div className="space-y-4">
                {/* Mess Name */}
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-3 text-[#2D241E]/40 text-[18px]">storefront</span>
                    <input
                        className="w-full bg-white/50 border border-white/60 rounded-xl pl-10 pr-4 h-12 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white placeholder:text-gray-400/80 transition-all"
                        placeholder="Mess / Kitchen Name"
                        name="messName"
                        value={formData.messName || ""}
                        onChange={handleChange}
                    />
                </div>

                {/* Owner Name */}
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-3 text-[#2D241E]/40 text-[18px]">person</span>
                    <input
                        className="w-full bg-white/50 border border-white/60 rounded-xl pl-10 pr-4 h-12 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white placeholder:text-gray-400/80 transition-all"
                        placeholder="Owner Full Name"
                        name="ownerName"
                        value={formData.ownerName || ""}
                        onChange={handleChange}
                    />
                </div>

                {/* Phone */}
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-3 text-[#2D241E]/40 text-[18px]">call</span>
                    <input
                        className="w-full bg-white/50 border border-white/60 rounded-xl pl-10 pr-4 h-12 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white placeholder:text-gray-400/80 transition-all"
                        placeholder="Business Phone Number"
                        name="phone"
                        maxLength={10}
                        value={formData.phone || ""}
                        onChange={handleChange}
                    />
                </div>

                {/* Logo Upload */}
                <div className="pt-2">
                    <label className="text-[10px] font-black text-[#2D241E]/50 uppercase tracking-widest ml-2 mb-2 block">Upload Mess Logo</label>
                    <div className="relative group">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-full h-24 bg-white/40 border-2 border-dashed border-white/70 rounded-2xl flex flex-col items-center justify-center group-hover:bg-white/60 transition-all">
                            <span className="material-symbols-outlined text-[#2D241E]/30 text-3xl group-hover:scale-110 transition-transform">add_photo_alternate</span>
                            <p className="text-[11px] font-bold text-[#2D241E]/40 mt-1 uppercase tracking-wider">
                                {formData.logo || "Choose Logo Image"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={onNext}
                disabled={!formData.messName || !formData.ownerName || !formData.phone}
                className="w-full bg-[#111716] hover:bg-black text-white font-bold h-12 rounded-xl shadow-lg shadow-black/10 transition-all hover:scale-[1.01] active:scale-[0.98] mt-6 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Verify & Next <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
        </div>
    );
};

export default Step1Identity;
