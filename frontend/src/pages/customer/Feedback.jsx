import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useSubscription } from '../../context/SubscriptionContext';
import { RatingForm, FeedbackHistoryList } from '../../components/customer';
import {
    FeedbackSkeleton,
    BackgroundBlobs,
    PageHeader
} from '../../components/common';
import feedbackService from '../../services/feedbackService';

const Feedback = () => {
    const { hasActiveSubscription } = useSubscription();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Data states
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([]);
    const [currentMeal, setCurrentMeal] = useState(null);
    const [feedbackHistory, setFeedbackHistory] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [error, setError] = useState(null);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            if (!hasActiveSubscription()) return;
            setLoading(true);
            try {
                const dashboardRes = await feedbackService.getFeedbackData();
                if (dashboardRes.success) {
                    setStats(dashboardRes.data.stats);
                    setCurrentMeal(dashboardRes.data.currentMeal);
                }
                const historyRes = await feedbackService.getFeedbackHistory();
                if (historyRes.success) setFeedbackHistory(historyRes.data.feedbackHistory);
                const tagsRes = await feedbackService.getFeedbackTags();
                if (tagsRes.success) setAvailableTags(tagsRes.data.tags);
            } catch (err) {
                setError("Failed to load feedback data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [hasActiveSubscription]);

    const toggleTag = (tag) => {
        setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentMeal) return setError("No meal available to review");
        try {
            const res = await feedbackService.submitFeedback({ orderId: currentMeal.orderId, rating, comment, tags: selectedTags });
            if (res.success) {
                setShowSuccessModal(true);
                setRating(5); setComment(''); setSelectedTags([]);
                const historyRes = await feedbackService.getFeedbackHistory();
                if (historyRes.success) setFeedbackHistory(historyRes.data.feedbackHistory);
            }
        } catch (err) {
            setError("Something went wrong");
            setTimeout(() => setError(null), 3000);
        }
    };

    if (!hasActiveSubscription()) return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
            <div className="size-24 bg-gray-100 rounded-full flex items-center justify-center"><span className="material-symbols-outlined text-4xl text-gray-400">lock</span></div>
            <h2 className="text-2xl font-black">Feature Locked</h2>
            <Link to="/customer/find-mess" className="px-8 py-3 bg-[#2D241E] text-white rounded-xl font-bold">Find a Mess</Link>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out] px-4 relative">
            <BackgroundBlobs />
            <PageHeader title="Meal Feedback" />

            {error && <div className="mb-6 mx-auto max-w-lg bg-red-50 text-red-600 px-4 py-3 rounded-xl text-center text-sm font-bold">{error}</div>}

            {loading ? (
                <FeedbackSkeleton />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                        {stats.map((stat, i) => (
                            <div key={i} className="glass-panel p-5 rounded-2xl flex items-center gap-4">
                                <span className="material-symbols-outlined text-primary">{stat.icon}</span>
                                <div><p className="text-[10px] text-gray-400 font-black uppercase">{stat.label}</p><p className="text-xl font-black">{stat.value}</p></div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <div className="lg:col-span-3">
                            <RatingForm
                                currentMeal={currentMeal} rating={rating} setRating={setRating}
                                comment={comment} setComment={setComment} availableTags={availableTags}
                                selectedTags={selectedTags} toggleTag={toggleTag} onSubmit={handleSubmit}
                            />
                        </div>
                        <FeedbackHistoryList history={feedbackHistory} />
                    </div>
                </>
            )}

            {showSuccessModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2D241E]/90 backdrop-blur-lg" onClick={() => setShowSuccessModal(false)}></div>
                    <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl relative z-10 text-center">
                        <div className="size-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"><span className="material-symbols-outlined text-white text-4xl">thumb_up</span></div>
                        <h3 className="text-2xl font-black mb-2">Thank You!</h3>
                        <button onClick={() => setShowSuccessModal(false)} className="w-full py-4 bg-[#2D241E] text-white rounded-[1.5rem] font-bold">Continue eating</button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};
export default Feedback;
