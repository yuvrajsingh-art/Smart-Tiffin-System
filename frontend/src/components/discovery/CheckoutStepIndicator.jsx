import React from 'react';

const CheckoutStepIndicator = ({ currentStep, totalSteps = 4 }) => {
    return (
        <div className="flex items-center gap-1.5 mb-4 px-1 overflow-x-hidden">
            {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                    <div className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${currentStep >= s ? 'bg-[#2D241E] text-white scale-100' : 'bg-white border border-gray-200 text-gray-300 scale-90'}`}>
                        {currentStep > s ? <span className="material-symbols-outlined text-[12px]">check</span> : s}
                    </div>
                    {s < totalSteps && (
                        <div className={`w-8 h-0.5 rounded-full transition-all duration-300 ${currentStep > s ? 'bg-[#2D241E]' : 'bg-gray-200'}`}></div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CheckoutStepIndicator;
