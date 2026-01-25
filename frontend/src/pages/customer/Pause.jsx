import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../../context/SubscriptionContext';

const Pause = () => {
    const { hasActiveSubscription } = useSubscription();
    // Demo Days
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const [selectedDays, setSelectedDays] = useState([24, 25]);

    const toggleDay = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
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
        <div className="max-w-7xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out] px-4">

            {/* Header */}
            <div className="flex flex-col gap-1 mb-8 pt-4">
                <Link to="/customer/dashboard" className="text-xs font-bold text-[#5C4D42] hover:text-primary flex items-center gap-1 w-fit transition-colors">
                    <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Dashboard
                </Link>
                <h1 className="text-2xl font-black text-[#2D241E]">Pause Subscription</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left: Calendar */}
                <div className="md:col-span-2">
                    <div className="glass-panel p-8 rounded-[2.5rem] border border-white/60 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                            <span className="material-symbols-outlined text-9xl">calendar_month</span>
                        </div>

                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h3 className="font-black text-xl text-[#2D241E]">January 2026</h3>
                            <div className="flex gap-2 text-xs font-bold text-gray-400">
                                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-red-500"></span> Paused</span>
                                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-white border border-gray-300"></span> Active</span>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-3 mb-6 relative z-10">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                                <div key={d} className="text-center text-xs font-black text-gray-300 uppercase py-2">{d}</div>
                            ))}
                            {days.map(day => (
                                <button
                                    key={day}
                                    onClick={() => toggleDay(day)}
                                    className={`
                                        aspect-square rounded-xl flex items-center justify-center text-sm font-black transition-all duration-300 relative group
                                        ${selectedDays.includes(day)
                                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-105'
                                            : 'bg-white/50 text-[#5C4D42] hover:bg-white border border-transparent hover:border-gray-100'
                                        }
                                    `}
                                >
                                    {day}
                                    {selectedDays.includes(day) && (
                                        <span className="absolute -top-1 -right-1 size-3 bg-white rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[8px] text-red-500 font-bold">close</span>
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Summary */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-[2rem] border border-white/60">
                        <h3 className="font-bold text-[#2D241E] mb-4">Summary</h3>

                        <div className="bg-white/50 rounded-xl p-4 mb-4 border border-white/50">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-400 uppercase">Days Paused</span>
                                <span className="font-black text-xl text-[#2D241E]">{selectedDays.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase">Est. Refund</span>
                                <span className="font-black text-xl text-green-600">₹{selectedDays.length * 80}</span>
                            </div>
                        </div>

                        <p className="text-xs text-center text-gray-400 font-medium mb-6 leading-relaxed">
                            Money will be credited to your wallet automatically at the end of the day.
                        </p>

                        <button onClick={() => alert('Changes Saved!')} className="w-full py-4 bg-[#2D241E] text-white rounded-xl font-bold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                            Save Changes
                        </button>
                    </div>

                    <div className="p-4 rounded-2xl border border-dashed border-red-200 bg-red-50/50 text-center">
                        <span className="material-symbols-outlined text-red-400 mb-1">warning</span>
                        <p className="text-xs font-bold text-red-400">Please update before 10 AM for same-day requests.</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Pause;
