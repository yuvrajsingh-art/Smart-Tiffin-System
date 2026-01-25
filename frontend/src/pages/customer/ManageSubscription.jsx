import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useSubscription } from '../../context/SubscriptionContext';

const ManageSubscription = () => {
    const { hasActiveSubscription } = useSubscription();
    // Demo Days
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const [selectedDays, setSelectedDays] = useState([24, 25]);

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successData, setSuccessData] = useState({ title: '', sub: '' });

    const toggleDay = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const handleCancelSubscription = () => {
        setShowCancelModal(false);
        setSuccessData({
            title: 'Subscription Cancelled',
            sub: 'Your refund has been initiated and will reach your wallet in 5-7 days.'
        });
        setShowSuccessModal(true);
        // Redirect logic would go here after a delay or user action
    };

    const handleUpgradeSuccess = () => {
        setShowUpgradeModal(false);
        setSuccessData({
            title: 'Plan Upgraded!',
            sub: 'You have successfully upgraded to the Premium Non-Veg plan.'
        });
        setShowSuccessModal(true);
    };

    if (!hasActiveSubscription()) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-[fadeIn_0.5s_ease-out] px-4">
                <div className="size-24 bg-gray-100 rounded-full flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined text-4xl text-gray-400">lock</span>
                </div>
                <div>
                    <h2 className="text-2xl font-black text-[#2D241E]">Feature Locked</h2>
                    <p className="text-[#5C4D42] mt-2 max-w-md mx-auto font-medium">
                        You need an active subscription to pause meals.
                    </p>
                </div>
                <Link to="/customer/find-mess" className="px-8 py-3 bg-[#2D241E] text-white rounded-xl font-bold shadow-lg hover:translate-y-px transition-all">
                    Find a Mess
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out] px-4 relative">

            {/* Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="blob blob-1 blob-primary opacity-30 scale-75"></div>
                <div className="blob blob-2 blob-secondary opacity-30 scale-75"></div>
            </div>

            {/* Header */}
            <div className="flex flex-col gap-1 mb-6 pt-4">
                <Link to="/customer/dashboard" className="text-xs font-bold text-[#5C4D42] hover:text-primary flex items-center gap-1 w-fit transition-colors">
                    <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Dashboard
                </Link>
                <h1 className="text-2xl font-black text-[#2D241E]">Manage Subscription</h1>
            </div>

            {/* Main Layout: Medium Compact Mode */}
            <div className="flex flex-col gap-6 max-w-5xl mx-auto">

                {/* Top Row: Info & Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    {/* 1. Plan Details Card */}
                    <div className="relative overflow-hidden rounded-2xl p-4 shadow-lg group flex flex-col justify-between min-h-[140px]">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#2D241E] to-[#1a1a1a]"></div>
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-symbols-outlined text-6xl text-white">verified</span>
                        </div>

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="size-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-base border border-white/10">
                                        🍱
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">Active</span>
                                </div>
                                <h3 className="text-white font-black text-lg leading-tight">Standard Veg</h3>
                                <p className="text-white/60 text-xs font-medium">Expires: 31 Jan</p>
                            </div>

                            <button onClick={() => setShowUpgradeModal(true)} className="mt-2 w-full py-2 bg-white text-[#2D241E] rounded-xl font-bold text-xs shadow-sm hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                                <span className="material-symbols-outlined text-sm">upgrade</span>
                                Upgrade
                            </button>
                        </div>
                    </div>

                    {/* 2. Summary Stats */}
                    <div className="glass-panel p-4 rounded-2xl border border-white/60 flex flex-col justify-between min-h-[140px]">
                        <div>
                            <h3 className="font-bold text-[#2D241E] mb-2 text-xs uppercase tracking-wide">Summary</h3>
                            <div className="bg-white/50 rounded-xl p-3 mb-2 border border-white/50 space-y-1">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Paused</span>
                                    <span className="font-black text-base text-[#2D241E]">{selectedDays.length} Days</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Refund</span>
                                    <span className="font-black text-base text-green-600">₹{selectedDays.length * 80}</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => alert('Changes Saved!')} className="w-full py-2 bg-[#2D241E] text-white rounded-xl font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all text-xs">
                            Save Changes
                        </button>
                    </div>

                    {/* 3. Danger Zone */}
                    <div className="glass-panel p-4 rounded-2xl border border-red-100/50 relative overflow-hidden group hover:bg-red-50/30 transition-colors flex flex-col justify-between min-h-[140px]">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="size-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-sm">warning</span>
                                </div>
                                <h3 className="font-bold text-[#2D241E] text-xs uppercase tracking-wide">Danger Zone</h3>
                            </div>
                            <p className="text-[10px] text-[#5C4D42] leading-relaxed opacity-80 mb-2">
                                Cancelling stops deliveries immediately. Refund in 5-7 days.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowCancelModal(true)}
                            className="w-full py-2 rounded-xl border border-red-200 text-red-500 font-bold text-xs hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                        >
                            Cancel Plan
                        </button>
                    </div>

                </div>

                {/* Bottom Row: Medium Compact Calendar */}
                <div className="glass-panel p-5 rounded-[2rem] border border-white/60 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-5 opacity-5 pointer-events-none">
                        <span className="material-symbols-outlined text-8xl">calendar_month</span>
                    </div>

                    <div className="flex justify-between items-center mb-4 relative z-10 gap-4">
                        <h3 className="font-black text-xl text-[#2D241E]">January 2026</h3>
                        <div className="flex gap-2 text-[10px] font-bold text-gray-400 bg-white/40 p-1.5 rounded-full backdrop-blur-sm">
                            <span className="flex items-center gap-1.5 px-2"><span className="size-2 rounded-full bg-red-500"></span> Paused</span>
                            <span className="flex items-center gap-1.5 px-2"><span className="size-2 rounded-full bg-white border border-gray-300"></span> Active</span>
                        </div>
                    </div>

                    {/* Medium Fixed Size Grid */}
                    <div className="flex flex-col items-center">
                        <div className="grid grid-cols-7 gap-2 relative z-10 w-fit">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                                <div key={d} className="text-center text-[10px] font-black text-gray-400 uppercase py-1">{d}</div>
                            ))}
                            {days.map(day => (
                                <button
                                    key={day}
                                    onClick={() => toggleDay(day)}
                                    className={`
                                        h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200 relative group
                                        ${selectedDays.includes(day)
                                            ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md shadow-red-500/30'
                                            : 'bg-white/40 text-[#5C4D42] hover:bg-white border border-white/50 hover:border-white hover:shadow-sm'
                                        }
                                    `}
                                >
                                    {day}
                                    {selectedDays.includes(day) && (
                                        <span className="absolute top-0.5 right-0.5 size-2.5 bg-white rounded-full flex items-center justify-center shadow-sm">
                                            <span className="material-symbols-outlined text-[7px] text-red-500 font-bold">close</span>
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cancel Confirmation Modal */}
                {showCancelModal && createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-[#2D241E]/90 backdrop-blur-lg animate-[fadeIn_0.3s]" onClick={() => setShowCancelModal(false)}></div>

                        {/* Modal Container */}
                        <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-6 shadow-2xl animate-[scaleIn_0.3s] relative overflow-hidden z-10 border border-white/20">

                            {/* Decorative Background Elements */}
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
                        {/* Backdrop with heavy blur - MATCHING Wallet.jsx */}
                        <div
                            className="absolute inset-0 bg-[#2D241E]/60 backdrop-blur-xl animate-[fadeIn_0.3s]"
                            onClick={() => setShowUpgradeModal(false)}
                        ></div>

                        {/* Modal Container - MATCHING Wallet.jsx */}
                        <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-6 shadow-2xl animate-[scaleIn_0.3s] relative overflow-hidden z-10 border border-white/20">

                            {/* Decorative Background Elements - MATCHING Wallet.jsx */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-100 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-100 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

                            <div className="relative z-10">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="text-xl font-black text-[#2D241E] leading-none">Upgrade Plan</h3>
                                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">Pay Difference Only</p>
                                    </div>
                                    <button
                                        onClick={() => setShowUpgradeModal(false)}
                                        className="size-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors group"
                                    >
                                        <span className="material-symbols-outlined text-[#2D241E] text-lg group-hover:rotate-90 transition-transform duration-300">close</span>
                                    </button>
                                </div>

                                {/* Credit Section */}
                                <div className="bg-green-50/50 border border-green-100 p-3 rounded-2xl flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="size-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-xs">check</span>
                                        </div>
                                        <span className="text-xs font-bold text-green-700">Credit Applied</span>
                                    </div>
                                    <span className="font-black text-sm text-green-700">- ₹500</span>
                                </div>

                                {/* Plans List */}
                                <div className="space-y-3 mb-6">
                                    {[
                                        { id: 1, name: 'Premium Non-Veg', price: 4500, features: 'Chicken, Mutton, Fish', tag: 'Popular' },
                                        { id: 2, name: 'Gold Weight Loss', price: 5000, features: 'High Protein, Low Carbs', tag: 'Best Value' }
                                    ].map((plan) => (
                                        <div key={plan.id} className="group relative">
                                            <input type="radio" name="plan" id={`plan-${plan.id}`} className="peer hidden" />
                                            <label htmlFor={`plan-${plan.id}`} className="flex justify-between items-center p-4 rounded-2xl border border-gray-100 bg-white/50 cursor-pointer hover:border-[#2D241E] peer-checked:border-[#2D241E] peer-checked:bg-[#2D241E] peer-checked:text-white transition-all shadow-sm">
                                                <div>
                                                    <h4 className="font-bold text-inherit text-sm transition-colors">{plan.name}</h4>
                                                    <p className="text-[10px] text-gray-400 font-medium peer-checked:text-white/60">{plan.features}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs font-bold text-gray-400 line-through peer-checked:text-white/40">₹{plan.price}</div>
                                                    <div className="font-black text-inherit transition-colors">
                                                        ₹{plan.price - 500}
                                                    </div>
                                                </div>
                                            </label>
                                            <div className="absolute top-1/2 -right-2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity">
                                                <div className="size-6 bg-white rounded-full flex items-center justify-center text-[#2D241E] shadow-lg">
                                                    <span className="material-symbols-outlined text-xs">done</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Action Button */}
                                <button onClick={handleUpgradeSuccess} className="w-full py-4 bg-[#2D241E] text-white rounded-[1.5rem] font-bold text-sm shadow-xl shadow-gray-900/10 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
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

                            {/* Decorative Background */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-100 rounded-full blur-[80px] -translate-y-1/2 pointer-events-none"></div>

                            <div className="relative z-10 flex flex-col items-center">
                                <div className="size-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/30 animate-[bounce_1s_infinite]">
                                    <span className="material-symbols-outlined text-4xl text-white font-bold">check</span>
                                </div>

                                <h3 className="text-2xl font-black text-[#2D241E] mb-2">{successData.title}</h3>
                                <p className="text-[#5C4D42] text-sm font-medium leading-relaxed mb-8 opacity-80">
                                    {successData.sub}
                                </p>

                                <button
                                    onClick={() => setShowSuccessModal(false)}
                                    className="w-full py-4 bg-[#2D241E] text-white rounded-[1.5rem] font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Awesome, Continue
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </div>

        </div>

    );
};

export default ManageSubscription;
