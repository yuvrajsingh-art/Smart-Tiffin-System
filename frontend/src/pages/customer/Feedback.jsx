import React, { useState } from 'react';
import Button from '../../components/ui/Button';

const Feedback = () => {
    const [rating, setRating] = useState(4);

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
