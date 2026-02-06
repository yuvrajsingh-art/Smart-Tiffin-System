import React, { createPortal } from 'react-dom';

const SubscriptionModals = ({
    showCancelModal, setShowCancelModal, handleCancelSubscription,
    showUpgradeModal, setShowUpgradeModal, initiateUpgradePayment,
    showSuccessModal, setShowSuccessModal, successData
}) => {
    return (
        <>
            {/* Cancel Confirmation Modal */}
            {showCancelModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2D241E]/90 backdrop-blur-lg animate-[fadeIn_0.3s]" onClick={() => setShowCancelModal(false)}></div>
                    <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-6 shadow-2xl animate-[scaleIn_0.3s] relative overflow-hidden z-10 border border-white/20">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-red-100 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-100 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="size-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
                                💔
                            </div>
                            <h3 className="text-xl font-black text-[#2D241E] text-center mb-1">Cancel Subscription?</h3>
                            <p className="text-center text-[#5C4D42] text-sm mb-6 leading-relaxed px-4">
                                You will be refunded <span className="font-black text-[#2D241E]">₹1,200</span> to your wallet within 5-7 days.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="w-full py-3.5 bg-[#2D241E] text-white rounded-[1.2rem] font-bold text-sm shadow-xl shadow-gray-900/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    No, Keep My Plan
                                </button>
                                <button
                                    onClick={handleCancelSubscription}
                                    className="w-full py-3.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-[1.2rem] font-bold text-sm transition-colors"
                                >
                                    Yes, Cancel It
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
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

                            <div className="bg-green-50/50 border border-green-100 p-3 rounded-2xl flex justify-between items-center mb-6">
                                <span className="text-xs font-bold text-green-700">Credit Applied: - ₹500</span>
                            </div>

                            <div className="space-y-3 mb-6">
                                {[
                                    { id: 1, name: 'Premium Non-Veg', price: 4500, features: 'Chicken, Mutton, Fish' },
                                    { id: 2, name: 'Gold Weight Loss', price: 5000, features: 'High Protein, Low Carbs' }
                                ].map((plan) => (
                                    <label key={plan.id} className="flex justify-between items-center p-4 rounded-2xl border border-gray-100 bg-white/50 cursor-pointer hover:border-[#2D241E] transition-all">
                                        <input type="radio" name="plan" className="peer hidden" />
                                        <div>
                                            <h4 className="font-bold text-sm">{plan.name}</h4>
                                            <p className="text-[10px] text-gray-400">{plan.features}</p>
                                        </div>
                                        <div className="font-black">₹{plan.price - 500}</div>
                                    </label>
                                ))}
                            </div>

                            <button onClick={() => initiateUpgradePayment(4000)} className="w-full py-4 bg-[#2D241E] text-white rounded-[1.5rem] font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                                Pay Balance & Upgrade
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

export default SubscriptionModals;
