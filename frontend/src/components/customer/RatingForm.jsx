import React from 'react';

const RatingForm = ({ currentMeal, rating, setRating, comment, setComment, availableTags, selectedTags, toggleTag, onSubmit }) => {
    if (!currentMeal) return (
        <div className="text-center py-8">
            <p className="text-gray-500 font-medium mb-4">No delivered orders found for today.</p>
            <p className="text-xs text-gray-400">You can only review meals after they have been marked as delivered.</p>
        </div>
    );

    const getEmoji = (r) => {
        if (r >= 5) return '😍';
        if (r >= 4) return '😊';
        if (r >= 3) return '😐';
        if (r >= 2) return '🙁';
        return '🤮';
    };

    return (
        <div className="glass-panel p-8 sm:p-10 rounded-[2.5rem] border border-white/60 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2 opacity-50"></div>

            <div className="relative z-10 text-center">
                <div className="inline-block p-4 rounded-2xl bg-orange-50 text-orange-600 mb-6">
                    <span className="material-symbols-outlined text-4xl">lunch_dining</span>
                </div>

                <h3 className="text-2xl font-black text-[#2D241E] mb-2 leading-tight">How was today's {currentMeal.mealType}?</h3>
                <p className="text-sm font-medium text-gray-400 mb-8">{currentMeal.mealName} • Today</p>

                {/* Main Rating */}
                <div className="mb-4">
                    <div className="text-5xl mb-4 animate-bounce grayscale-0">{getEmoji(rating)}</div>
                    <div className="flex justify-center gap-3 mb-8">
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
                </div>

                {/* Tags */}
                <div className="text-left mb-8">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Quick Feedback</label>
                    <div className="flex flex-wrap gap-2">
                        {availableTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all border ${selectedTags.includes(tag)
                                    ? 'bg-[#2D241E] text-white border-[#2D241E] shadow-md'
                                    : 'bg-white/50 text-gray-500 border-white hover:bg-white hover:border-gray-100'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Textarea */}
                <div className="mb-8 text-left">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block ml-1">Write a Review</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full h-32 bg-white/60 backdrop-blur-sm border border-white rounded-[1.5rem] p-5 text-sm font-medium text-[#2D241E] outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all resize-none shadow-inner placeholder:text-gray-300"
                        placeholder="What did you like? What can be improved?"
                    ></textarea>
                </div>

                <button
                    onClick={onSubmit}
                    className="w-full py-4 bg-[#2D241E] text-white rounded-[1.5rem] font-bold text-base shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    Submit Feedback
                </button>
            </div>
        </div>
    );
};

export default RatingForm;
