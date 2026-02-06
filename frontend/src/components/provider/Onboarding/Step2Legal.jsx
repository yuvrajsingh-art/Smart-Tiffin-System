import React from 'react';

const Step2Legal = ({ formData, setFormData, onNext, onPrev }) => {
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, fssaiCertificate: file.name });
        }
    };

    return (
        <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="text-center mb-8">
                <h2 className="text-xl font-black text-[#2D241E]">Legal Compliance</h2>
                <p className="text-sm text-[#2D241E]/60 font-medium text-pretty mt-1">We need your FSSAI details to verify your kitchen as per government regulations.</p>
            </div>

            <div className="space-y-4">
                {/* FSSAI Number */}
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-3 text-[#2D241E]/40 text-[18px]">gavel</span>
                    <input
                        className="w-full bg-white/50 border border-white/60 rounded-xl pl-10 pr-4 h-12 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white placeholder:text-gray-400/80 transition-all font-mono"
                        placeholder="14-Digit FSSAI License Number"
                        name="fssaiNumber"
                        maxLength={14}
                        value={formData.fssaiNumber || ""}
                        onChange={handleChange}
                    />
                </div>

                {/* FSSAI Certificate Upload */}
                <div className="pt-2">
                    <label className="text-[10px] font-black text-[#2D241E]/50 uppercase tracking-widest ml-2 mb-2 block">Upload FSSAI Certificate (PDF/Image)</label>
                    <div className="relative group">
                        <input
                            type="file"
                            accept=".pdf,image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="w-full h-24 bg-white/40 border-2 border-dashed border-white/70 rounded-2xl flex flex-col items-center justify-center group-hover:bg-white/60 transition-all">
                            <span className="material-symbols-outlined text-[#2D241E]/30 text-3xl group-hover:scale-110 transition-transform">content_paste_search</span>
                            <p className="text-[11px] font-bold text-[#2D241E]/40 mt-1 uppercase tracking-wider">
                                {formData.fssaiCertificate || "Choose License Document"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 mt-6">
                <button
                    onClick={onPrev}
                    className="flex-1 bg-white border border-gray-200 text-[#2D241E] font-bold h-12 rounded-xl hover:bg-gray-50 transition-all active:scale-[0.98] text-sm flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back
                </button>
                <button
                    onClick={onNext}
                    disabled={!formData.fssaiNumber || formData.fssaiNumber.length < 14}
                    className="flex-[2] bg-[#111716] hover:bg-black text-white font-bold h-12 rounded-xl shadow-lg shadow-black/10 transition-all hover:scale-[1.01] active:scale-[0.98] text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Save & Next <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
            </div>
        </div>
    );
};

export default Step2Legal;
