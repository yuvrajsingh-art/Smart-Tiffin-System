import React from 'react';

const Step4Banking = ({ formData, setFormData, onComplete, onPrev }) => {
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="text-center mb-8">
                <h2 className="text-xl font-black text-[#2D241E]">Payout Details</h2>
                <p className="text-sm text-[#2D241E]/60 font-medium text-pretty mt-1">Tell us where to send your payments. Your earnings will be deposited here.</p>
            </div>

            <div className="space-y-4">
                {/* Account Holder Name */}
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-3 text-[#2D241E]/40 text-[18px]">account_circle</span>
                    <input
                        className="w-full bg-white/50 border border-white/60 rounded-xl pl-10 pr-4 h-12 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white placeholder:text-gray-400/80 transition-all uppercase"
                        placeholder="Account Holder Name"
                        name="accountHolderName"
                        value={formData.accountHolderName || ""}
                        onChange={handleChange}
                    />
                </div>

                {/* Account Number */}
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-3 text-[#2D241E]/40 text-[18px]">account_balance</span>
                    <input
                        className="w-full bg-white/50 border border-white/60 rounded-xl pl-10 pr-4 h-12 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white placeholder:text-gray-400/80 transition-all font-mono"
                        placeholder="Bank Account Number"
                        name="accountNumber"
                        value={formData.accountNumber || ""}
                        onChange={handleChange}
                    />
                </div>

                {/* IFSC Code */}
                <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-3 text-[#2D241E]/40 text-[18px]">domain</span>
                    <input
                        className="w-full bg-white/50 border border-white/60 rounded-xl pl-10 pr-4 h-12 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white placeholder:text-gray-400/80 transition-all font-mono uppercase"
                        placeholder="IFSC Code"
                        name="ifscCode"
                        maxLength={11}
                        value={formData.ifscCode || ""}
                        onChange={handleChange}
                    />
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
                    onClick={onComplete}
                    disabled={!formData.accountHolderName || !formData.accountNumber || !formData.ifscCode}
                    className="flex-[2] bg-primary hover:bg-primary-dark text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98] text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Finish Onboarding <span className="material-symbols-outlined text-[18px]">celebration</span>
                </button>
            </div>
        </div>
    );
};

export default Step4Banking;
