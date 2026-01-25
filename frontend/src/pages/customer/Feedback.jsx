import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import { useSubscription } from '../../context/SubscriptionContext';
import { Link } from 'react-router-dom';

const Feedback = () => {
    const { hasActiveSubscription } = useSubscription();
    const [rating, setRating] = useState(4);

    if (!hasActiveSubscription()) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-[fadeIn_0.5s_ease-out]">
                <div className="size-24 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-gray-400">lock</span>
                </div>
                <div>
                    <h2 className="text-2xl font-black text-[#2D241E]">Feature Locked</h2>
                    <p className="text-[#5C4D42] mt-2 max-w-md mx-auto">
                        You can only provide feedback for meals after subscribing.
                    </p>
                </div>
                <Link to="/customer/find-mess" className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-[#e05d00] transition-colors">
                    Find a Mess
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out] px-4 md:px-6">

            {/* Header */}
            <div className="flex flex-col gap-1 mb-8 pt-4">
                <Link to="/customer/dashboard" className="text-xs font-bold text-[#5C4D42] hover:text-primary flex items-center gap-1 w-fit transition-colors">
                    <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Dashboard
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-[#2D241E] leading-tight">Meal Feedback</h1>
                    <p className="text-xs font-bold text-[#5C4D42] opacity-60 uppercase tracking-widest">Rate your experience</p>
                </div>
            </div>

            {/* Feedback Main Card */}
            <div className="max-w-xl mx-auto">
                <div className="glass-panel p-8 sm:p-10 rounded-[2.5rem] text-center relative overflow-hidden border border-white shadow-xl">

                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-50 rounded-full blur-[60px] -translate-x-1/2 translate-y-1/2"></div>

                    <div className="relative z-10">
                        <div className="inline-block p-4 rounded-2xl bg-orange-50 text-orange-600 mb-6">
                            <span className="material-symbols-outlined text-4xl">lunch_dining</span>
                        </div>

                        <h3 className="text-2xl font-black text-[#2D241E] mb-2 leading-tight">How was today's Lunch?</h3>
                        <p className="text-sm font-medium text-gray-400 mb-8">Paneer Butter Masala • Today</p>

                        {/* Star Rating */}
                        <div className="flex justify-center gap-3 mb-10">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className="group focus:outline-none transition-transform active:scale-90"
                                >
                                    <span
                                        className={`material-symbols-outlined text-[48px] transition-all duration-300 ${star <= rating
                                            ? 'fill-1 text-amber-400 drop-shadow-md scale-110'
                                            : 'text-gray-200 hover:text-gray-300 scale-100'
                                            }`}
                                    >
                                        star
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="mb-8 text-left">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 block ml-1">Write a Review</label>
                            <textarea
                                className="w-full h-40 bg-white/60 backdrop-blur-sm border border-white rounded-[1.5rem] p-5 text-sm font-medium text-[#2D241E] outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all resize-none shadow-inner placeholder:text-gray-300"
                                placeholder="What did you like? What can be improved?"
                            ></textarea>
                        </div>

                        <Button className="w-full py-4 text-base rounded-[1.5rem] shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]">
                            Submit Feedback
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
