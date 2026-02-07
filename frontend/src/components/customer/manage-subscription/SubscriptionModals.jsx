import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const SubscriptionModals = ({
    showCancelModal, setShowCancelModal, handleCancelSubscription,
    showUpgradeModal, setShowUpgradeModal, initiateUpgradePayment,
    showSuccessModal, setShowSuccessModal, successData,
    upgradePlans
}) => {
    const [selectedPlan, setSelectedPlan] = useState(null);

    // Reset selection when modal closes
    useEffect(() => {
        if (!showUpgradeModal) setSelectedPlan(null);
    }, [showUpgradeModal]);

    return (
        <>
            {/* Cancel Confirmation Modal */}
            {showCancelModal && createPortal(
                <CancelFlow
                    onClose={() => setShowCancelModal(false)}
                    onConfirmCancel={handleCancelSubscription}
                />,
                document.body
            )}

            {/* Upgrade Plan Modal */}
            {showUpgradeModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2D241E]/60 backdrop-blur-xl animate-[fadeIn_0.3s]" onClick={() => setShowUpgradeModal(false)}></div>
                    <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-6 shadow-2xl animate-[scaleIn_0.3s] relative overflow-hidden z-10 border border-white/20">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-100 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-black text-[#2D241E] leading-none">Upgrade Plan</h3>
                                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">Pay Difference Only</p>
                                </div>
                                <button onClick={() => setShowUpgradeModal(false)} className="size-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors group">
                                    <span className="material-symbols-outlined text-[#2D241E] text-lg group-hover:rotate-90 transition-transform duration-300">close</span>
                                </button>
                            </div>

                            {/* Bill Preview Section */}
                            {selectedPlan ? (
                                <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl mb-6 space-y-2">
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>New Plan ({selectedPlan.name})</span>
                                        <span>₹{selectedPlan.price}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-green-600 font-bold">
                                        <span>Unused Plan Credit</span>
                                        <span>- ₹{selectedPlan.price - selectedPlan.upgradePrice}</span>
                                    </div>
                                    <div className="h-px bg-gray-200 my-2"></div>
                                    <div className="flex justify-between text-sm font-black text-[#2D241E]">
                                        <span>To Pay Now</span>
                                        <span>₹{selectedPlan.upgradePrice}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-2xl flex items-start gap-3 mb-6">
                                    <span className="material-symbols-outlined text-blue-500 text-lg mt-0.5">info</span>
                                    <p className="text-xs text-blue-800 leading-relaxed">
                                        Select a plan to see your upgrade cost breakdown. We deduct the unused value of your current plan.
                                    </p>
                                </div>
                            )}

                            <div className="space-y-3 mb-6">
                                {upgradePlans && upgradePlans.length > 0 ? (
                                    upgradePlans.map((plan) => (
                                        <label key={plan.id} className="flex justify-between items-center p-4 rounded-2xl border border-gray-100 bg-white/50 cursor-pointer hover:border-[#2D241E] transition-all">
                                            <input
                                                type="radio"
                                                name="plan"
                                                className="peer hidden"
                                                onChange={() => setSelectedPlan(plan)}
                                            />
                                            <div className="peer-checked:text-[#2D241E]">
                                                <h4 className="font-bold text-sm">{plan.name}</h4>
                                                <p className="text-[10px] text-gray-400">{plan.features}</p>
                                            </div>
                                            <div className="font-black">₹{plan.upgradePrice}</div>
                                        </label>
                                    ))
                                ) : (
                                    <p className="text-center text-sm text-gray-500">No upgrade plans available for your current subscription.</p>
                                )}
                            </div>

                            <button
                                onClick={() => selectedPlan && initiateUpgradePayment(selectedPlan.upgradePrice, selectedPlan)}
                                disabled={!selectedPlan}
                                className="w-full py-4 bg-[#2D241E] text-white rounded-[1.5rem] font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {selectedPlan ? `Pay ₹${selectedPlan.upgradePrice} & Upgrade` : 'Select a Plan'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Success Modal */}
            {showSuccessModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2D241E]/90 backdrop-blur-lg animate-[fadeIn_0.3s]" onClick={() => setShowSuccessModal(false)}></div>
                    <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl animate-[scaleIn_0.3s] relative overflow-hidden z-10 text-center border border-white/20">
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="size-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/30 animate-[bounce_1s_infinite]">
                                <span className="material-symbols-outlined text-4xl text-white font-bold">check</span>
                            </div>
                            <h3 className="text-2xl font-black text-[#2D241E] mb-2">{successData.title}</h3>
                            <p className="text-[#5C4D42] text-sm font-medium opacity-80 mb-8">{successData.sub}</p>
                            <button onClick={() => setShowSuccessModal(false)} className="w-full py-4 bg-[#2D241E] text-white rounded-[1.5rem] font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                                Awesome, Continue
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

const CancelFlow = ({ onClose, onConfirmCancel }) => {
    const [step, setStep] = useState(1);
    const [reason, setReason] = useState('');

    const handleReasonSelect = (r) => {
        setReason(r);
        if (r === 'Price') {
            setStep(2); // Offer discount
        } else {
            onConfirmCancel();
        }
    };

    const applyDiscount = () => {
        // Mock API call or logic to apply discount
        alert("10% Discount Coupon 'STAYWITHUS10' applied to your next renewal!");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#2D241E]/90 backdrop-blur-lg animate-[fadeIn_0.3s]" onClick={onClose}></div>
            <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-6 shadow-2xl animate-[scaleIn_0.3s] relative overflow-hidden z-10 border border-white/20">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-red-100 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-100 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

                <div className="relative z-10">
                    {step === 1 && (
                        <>
                            <div className="size-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">🤔</div>
                            <h3 className="text-xl font-black text-[#2D241E] text-center mb-1">Why are you leaving?</h3>
                            <p className="text-center text-[#5C4D42] text-xs mb-6 px-4">Help us improve by selecting a reason.</p>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {['Food Quality', 'Price', 'Service', 'Moving Out'].map(r => (
                                    <button
                                        key={r}
                                        onClick={() => handleReasonSelect(r)}
                                        className="p-3 rounded-xl border border-gray-100 bg-white hover:border-[#2D241E] hover:bg-gray-50 text-xs font-bold text-[#5C4D42] transition-all"
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                            <button onClick={onClose} className="w-full py-3 text-gray-400 text-xs font-bold hover:text-[#2D241E]">
                                Cancel & Go Back
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="size-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm animate-pulse">🎁</div>
                            <h3 className="text-xl font-black text-[#2D241E] text-center mb-1">Wait! Get 10% OFF</h3>
                            <p className="text-center text-[#5C4D42] text-sm mb-6 px-2">
                                We value you! Stay with us and get <span className="font-black text-green-600">10% discount</span> on your next month.
                            </p>

                            <button
                                onClick={applyDiscount}
                                className="w-full py-3.5 bg-[#2D241E] text-white rounded-[1.2rem] font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all mb-3"
                            >
                                Apply Discount & Stay
                            </button>
                            <button
                                onClick={onConfirmCancel}
                                className="w-full py-3.5 bg-gray-50 text-gray-400 hover:bg-gray-100 rounded-[1.2rem] font-bold text-sm transition-colors"
                            >
                                No thanks, Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionModals;
