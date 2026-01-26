import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useSubscription } from '../../context/SubscriptionContext';

const Feedback = () => {
    const { hasActiveSubscription } = useSubscription();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const tags = ['Fresh', 'Tasty', 'On Time', 'Great Portion', 'Hot Food', 'Healthy', 'Good Packaging'];

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowSuccessModal(true);
        // Reset form
        setRating(5);
        setComment('');
        setSelectedTags([]);
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
                        You can provide feedback for meals after subscribing.
                    </p>
                </div>
                <Link to="/customer/find-mess" className="px-8 py-3 bg-[#2D241E] text-white rounded-xl font-bold shadow-lg hover:translate-y-px transition-all">
                    Find a Mess
                </Link>
            </div>
        );
    }

    // Mock Stats
    const stats = [
        { label: 'Total Reviews', value: '12', icon: 'reviews' },
        { label: 'Avg Rating', value: '4.8', icon: 'star', color: 'text-amber-500' },
        { label: 'Badges', value: '3', icon: 'military_tech', color: 'text-primary' },
    ];

    // Mock Feedback History
    const feedbackHistory = [
        { id: 1, date: '22 Jan', meal: 'Lunch', rating: 5, comment: 'Paneer was very soft, liked it!', tags: ['Fresh', 'Tasty'] },
        { id: 2, date: '21 Jan', meal: 'Dinner', rating: 4, comment: 'Delivery was a bit late but food was hot.', tags: ['Hot Food'] },
        { id: 3, date: '20 Jan', meal: 'Lunch', rating: 5, comment: 'Authentic taste as always.', tags: ['Healthy', 'Great Portion'] },
    ];

    const getEmoji = (r) => {
        if (r >= 5) return '😍';
        if (r >= 4) return '😊';
        if (r >= 3) return '😐';
        if (r >= 2) return '🙁';
        return '🤮';
    };

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out] px-4 relative">

            {/* Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="blob blob-1 blob-primary opacity-30 scale-75"></div>
                <div className="blob blob-2 blob-secondary opacity-30 scale-75"></div>
            </div>

            {/* Header */}
            <div className="flex flex-col gap-1 mb-8 pt-4">
                <Link to="/customer/dashboard" className="text-xs font-bold text-[#5C4D42] hover:text-primary flex items-center gap-1 w-fit transition-colors">
                    <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Dashboard
                </Link>
                <h1 className="text-3xl font-black text-[#2D241E]">Meal Feedback</h1>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {stats.map((stat, i) => (
                    <div key={i} className="glass-panel p-5 rounded-2xl border border-white/60 flex items-center gap-4 hover:translate-y-[-2px] transition-all cursor-default text-left">
                        <div className="size-12 rounded-xl bg-white/80 shadow-sm flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">{stat.icon}</span>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">{stat.label}</p>
                            <p className={`text-xl font-black ${stat.color || 'text-[#2D241E]'}`}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                {/* Form Section */}
                <div className="lg:col-span-3">
                    <div className="glass-panel p-8 sm:p-10 rounded-[2.5rem] border border-white/60 shadow-xl relative overflow-hidden">
                        {/* Inner Decorative */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2 opacity-50"></div>

                        <div className="relative z-10 text-center">
                            <div className="inline-block p-4 rounded-2xl bg-orange-50 text-orange-600 mb-6">
                                <span className="material-symbols-outlined text-4xl">lunch_dining</span>
                            </div>

                            <h3 className="text-2xl font-black text-[#2D241E] mb-2 leading-tight">How was today's Lunch?</h3>
                            <p className="text-sm font-medium text-gray-400 mb-8">Paneer Butter Masala • Today</p>

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
                                    {tags.map(tag => (
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
                                onClick={handleSubmit}
                                className="w-full py-4 bg-[#2D241E] text-white rounded-[1.5rem] font-bold text-base shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Submit Feedback
                            </button>
                        </div>
                    </div>
                </div>

                {/* History Section */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="font-black text-[#2D241E] opacity-40 uppercase tracking-[0.2em] text-[10px] px-2">
                        Recent Feedbacks
                    </h2>
                    <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                        {feedbackHistory.map(item => (
                            <div key={item.id} className="glass-panel p-5 rounded-[2rem] border border-white/60 hover:bg-white transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-lg">
                                            {getEmoji(item.rating)}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-[#2D241E] text-sm">{item.meal}</h4>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase">{item.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex text-amber-400">
                                        {[...Array(item.rating)].map((_, i) => (
                                            <span key={i} className="material-symbols-outlined text-sm fill-1">star</span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs font-medium text-[#5C4D42] mb-3 leading-relaxed">"{item.comment}"</p>
                                <div className="flex flex-wrap gap-1">
                                    {item.tags.map(t => (
                                        <span key={t} className="px-2 py-0.5 rounded-full bg-gray-100 text-[8px] font-black text-gray-400 uppercase tracking-tighter">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2D241E]/90 backdrop-blur-lg animate-[fadeIn_0.3s]" onClick={() => setShowSuccessModal(false)}></div>
                    <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl animate-[scaleIn_0.3s] relative overflow-hidden z-10 text-center border border-white/20">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-100 rounded-full blur-[80px] -translate-y-1/2 pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="size-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/30 animate-[bounce_1s_infinite]">
                                <span className="material-symbols-outlined text-4xl text-white font-bold">thumb_up</span>
                            </div>
                            <h3 className="text-2xl font-black text-[#2D241E] mb-2">Thank You!</h3>
                            <p className="text-[#5C4D42] text-sm font-medium leading-relaxed mb-8 opacity-80">
                                Your feedback helps us improve your meal experience. Keep sharing!
                            </p>
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="w-full py-4 bg-[#2D241E] text-white rounded-[1.5rem] font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Continue Eating
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Feedback;

