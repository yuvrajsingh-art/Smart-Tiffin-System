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
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            <h2 className="text-2xl font-bold text-gray-900">Give Feedback ✍️</h2>

            <div className="glass-panel p-8 rounded-3xl text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-2">How was today's Lunch?</h3>
                <p className="text-sm text-gray-500 mb-6">Your feedback helps us improve.</p>

                {/* Star Rating */}
                <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="transition-transform hover:scale-110 focus:outline-none"
                        >
                            <span className={`material-symbols-outlined text-[40px] ${star <= rating ? 'fill-1 text-amber-400' : 'text-gray-300'}`}>
                                star
                            </span>
                        </button>
                    ))}
                </div>

                <textarea
                    className="w-full h-32 bg-white/50 border border-white rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/50 placeholder-gray-400 resize-none mb-6"
                    placeholder="Tell us what you liked or disliked..."
                ></textarea>

                <Button className="w-full">Submit Feedback</Button>
            </div>
        </div>
    );
};

export default Feedback;
