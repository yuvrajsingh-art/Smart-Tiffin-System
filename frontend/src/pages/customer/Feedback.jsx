import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/UserContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { toast } from 'react-hot-toast';
import {
    BackgroundBlobs,
    PageHeader
} from '../../components/common';
import {
    RatingForm,
    FeedbackHistoryList
} from '../../components/customer';

const Feedback = () => {
    const { token } = useAuth();
    const { hasActiveSubscription } = useSubscription();

    const [loading, setLoading] = useState(true);
    const [currentMeal, setCurrentMeal] = useState(null);
    const [stats, setStats] = useState([]);
    const [history, setHistory] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);

    // Form State
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        if (token && hasActiveSubscription()) {
            fetchFeedbackData();
            fetchHistory();
            fetchTags();
        } else {
            setLoading(false);
        }
    }, [token, hasActiveSubscription]);

    const fetchFeedbackData = async () => {
        try {
            const res = await axios.get('/api/customer/feedback/data', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setCurrentMeal(res.data.data.currentMeal);
                setStats(res.data.data.stats);
            }
        } catch (error) {
            console.error('Error fetching feedback data:', error);
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await axios.get('/api/customer/feedback/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setHistory(res.data.data.feedbackHistory);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTags = async () => {
        try {
            const res = await axios.get('/api/customer/feedback/tags', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setAvailableTags(res.data.data.tags);
            }
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(prev => prev.filter(t => t !== tag));
        } else {
            if (selectedTags.length < 3) {
                setSelectedTags(prev => [...prev, tag]);
            } else {
                toast.error('You can select up to 3 tags');
            }
        }
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Please give a rating');
            return;
        }

        try {
            const payload = {
                orderId: currentMeal.orderId,
                rating,
                comment,
                tags: selectedTags
            };

            const res = await axios.post('/api/customer/feedback/submit', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                toast.success('Feedback submitted successfully!');
                setCurrentMeal(null); // Hide form
                setRating(0);
                setComment('');
                setSelectedTags([]);
                fetchHistory(); // Refresh history
                fetchFeedbackData(); // Refresh stats
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.error(error.response?.data?.message || 'Failed to submit feedback');
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-4 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="h-64 bg-gray-200 rounded-3xl"></div>
                    <div className="h-64 bg-gray-200 rounded-3xl lg:col-span-2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out] px-4 relative">
            <BackgroundBlobs />
            <PageHeader title="Your Feedback" />

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="glass-panel p-4 rounded-2xl border border-white/60 text-center">
                        <span className={`material-symbols-outlined text-2xl mb-1 ${stat.color || 'text-[#2D241E]'}`}>
                            {stat.icon}
                        </span>
                        <p className="text-2xl font-black text-[#2D241E]">{stat.value}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Rating Form */}
                <div className="lg:col-span-1 space-y-8 sticky top-24">
                    {currentMeal ? (
                        <RatingForm
                            currentMeal={currentMeal}
                            rating={rating}
                            setRating={setRating}
                            comment={comment}
                            setComment={setComment}
                            availableTags={availableTags}
                            selectedTags={selectedTags}
                            toggleTag={toggleTag}
                            onSubmit={handleSubmit}
                        />
                    ) : (
                        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/60 text-center opacity-80">
                            <div className="inline-block p-4 rounded-full bg-green-50 text-green-600 mb-4">
                                <span className="material-symbols-outlined text-4xl">check_circle</span>
                            </div>
                            <h3 className="text-xl font-black text-[#2D241E]">All Caught Up!</h3>
                            <p className="text-sm font-medium text-gray-400 mt-2">
                                You have reviewed all your recent delivered meals. Check back after your next delivery.
                            </p>
                        </div>
                    )}
                </div>

                {/* Right Column: History */}
                <FeedbackHistoryList history={history} />
            </div>
        </div>
    );
};

export default Feedback;
