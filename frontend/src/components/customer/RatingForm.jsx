import React from 'react';

const RatingForm = ({ currentMeal, rating, setRating, comment, setComment, availableTags, selectedTags, toggleTag, onSubmit, isEditing, onCancel }) => {
    if (!currentMeal) return (
        <div className="glass-panel p-12 rounded-[3rem] border border-white/60 text-center backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 mesh-gradient opacity-30"></div>
            <div className="relative z-10">
                <div className="inline-block p-6 rounded-full bg-green-50 text-green-600 mb-6 shadow-inner animate-bounce">
                    <span className="material-symbols-outlined text-5xl">verified</span>
                </div>
                <h3 className="text-2xl font-black text-[#2D241E] mb-3">You're All Set!</h3>
                <p className="text-sm font-bold text-gray-400 px-4 leading-relaxed opacity-80">
                    Everything has been reviewed. We appreciate your valuable insights to improve our meals.
                </p>
            </div>
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
        <div className="glass-panel p-8 sm:p-10 rounded-[3rem] border border-white/60 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(255,87,36,0.15)]">
            <div className="absolute inset-0 mesh-gradient opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-100/40 rounded-full blur-[90px] translate-x-1/2 -translate-y-1/2 transition-colors duration-500"></div>

            <div className="relative z-10 text-center">
                <div className="inline-block p-5 rounded-[2rem] bg-orange-50 text-orange-600 mb-6 shadow-sm group-hover:rotate-12 transition-all duration-500">
                    <span className="material-symbols-outlined text-4xl">{isEditing ? 'auto_fix_high' : 'restaurant_menu'}</span>
                </div>

                <h3 className="text-2xl font-black text-[#2D241E] mb-2 leading-tight tracking-tight">
                    {isEditing ? 'Refine your review' : `Delicious thoughts?`}
                </h3>
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-10 opacity-60">
                    {currentMeal.mealName} • {currentMeal.date}
                </p>

                {/* Main Rating */}
                <div className="mb-8">
                    <div className="text-7xl mb-6 animate-[float_3s_ease-in-out_infinite] grayscale-0 drop-shadow-xl select-none">{getEmoji(rating)}</div>
                    <div className="flex justify-center gap-1 mb-10 items-center bg-white/60 p-4 rounded-[2.2rem] border border-white shadow-[inner_0_2px_4px_rgba(0,0,0,0.02)] backdrop-blur-md">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                className="group/star px-1 focus:outline-none transition-all active:scale-75"
                            >
                                <span
                                    className={`material-symbols-outlined text-[46px] transition-all duration-500 ${star <= rating
                                        ? 'fill-1 text-amber-400 drop-shadow-[0_4px_10px_rgba(251,191,36,0.4)] scale-110'
                                        : 'text-gray-200 hover:text-gray-300 scale-100 hover:scale-125'
                                        }`}
                                >
                                    star
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tags */}
                <div className="text-left mb-10">
                    <div className="flex justify-between items-center mb-5 px-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] opacity-70">Experience Tags</label>
                        <span className="text-[9px] font-black text-primary/60 bg-primary/5 px-2 py-0.5 rounded-full">{selectedTags.length}/5</span>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        {availableTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${selectedTags.includes(tag)
                                    ? 'bg-[#2D241E] text-white border-[#2D241E] shadow-xl scale-105 pulsing-badge'
                                    : 'bg-white/80 text-gray-500 border-white hover:border-gray-200 hover:bg-white hover:translate-y-[-2px]'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Textarea */}
                <div className="mb-10 text-left">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-5 block ml-1 opacity-70">Detailed Review</label>
                    <div className="relative">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full h-36 bg-white/80 backdrop-blur-md border border-white rounded-[2.5rem] p-7 text-sm font-bold text-[#2D241E] outline-none focus:ring-[12px] focus:ring-primary/5 focus:bg-white transition-all resize-none shadow-sm placeholder:text-gray-300 placeholder:italic custom-scrollbar"
                            placeholder="Tell us everything about the food..."
                        ></textarea>
                    </div>
                </div>

                <div className="flex gap-4">
                    {isEditing && (
                        <button
                            onClick={onCancel}
                            className="flex-1 py-5 bg-gray-50 text-[#5C4D42] rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-gray-100 border border-gray-100 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={onSubmit}
                        className={`flex-[2] py-5 bg-[#2D241E] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:shadow-primary/20 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center justify-center gap-3 ${isEditing ? 'bg-gradient-to-r from-[#2D241E] to-[#40352d]' : ''}`}
                    >
                        <span className="material-symbols-outlined text-lg">{isEditing ? 'published_with_changes' : 'send'}</span>
                        {isEditing ? 'Update Review' : 'Post Review'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RatingForm;
