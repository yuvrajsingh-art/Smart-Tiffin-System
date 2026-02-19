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
    const [isEditing, setIsEditing] = useState(false);
    const [editReviewId, setEditReviewId] = useState(null);

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
            const res = await axios.get('/api/customer/feedback/pending', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success && res.data.data.length > 0) {
                const order = res.data.data[0];
                setCurrentMeal({
                    orderId: order._id,
                    mealType: order.mealType,
                    mealName: `${order.mealType} Meal`,
                    date: new Date(order.deliveredAt).toLocaleDateString()
                });
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
                setHistory(res.data.data);
                setStats([
                    { icon: 'star', value: res.data.data.length, label: 'Total Reviews', color: 'text-yellow-500' },
                    { icon: 'thumb_up', value: res.data.data.filter(r => r.rating >= 4).length, label: 'Positive', color: 'text-green-500' },
                    { icon: 'restaurant', value: res.data.data.length, label: 'Meals Rated', color: 'text-orange-500' }
                ]);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTags = async () => {
        // Set default tags
        setAvailableTags(['Delicious', 'Fresh', 'Hot', 'Good Quantity', 'On Time', 'Well Packed', 'Tasty', 'Healthy']);
    };

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(prev => prev.filter(t => t !== tag));
        } else {
            if (selectedTags.length < 5) { // Increased to 5 for better expression
                setSelectedTags(prev => [...prev, tag]);
            } else {
                toast.error('You can select up to 5 tags');
            }
        }
    };

    const handleEdit = (review) => {
        setIsEditing(true);
        setEditReviewId(review.id);
        setRating(review.rating);
        setComment(review.comment);
        setSelectedTags(review.tags || []);
        // Setup a mock "currentMeal" object for the form to display
        setCurrentMeal({
            orderId: review.order?._id || review.id, // Fallback to id if order populated differently
            mealType: review.meal,
            mealName: review.mealName || 'Previous Meal',
            date: review.date,
            isUpdate: true
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditReviewId(null);
        setRating(0);
        setComment('');
        setSelectedTags([]);
        fetchFeedbackData(); // Reset currentMeal to today's if available
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Please give a rating');
            return;
        }

        try {
            const payload = {
                rating,
                feedback: comment
            };

            const res = await axios.post(`/api/customer/feedback/${currentMeal.orderId}`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                toast.success('Feedback submitted successfully!');
                setCurrentMeal(null);
                setRating(0);
                setComment('');
                setSelectedTags([]);
                fetchHistory();
                fetchFeedbackData();
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

            <div className="reveal-section active transition-all duration-700">
                {/* Stats Section */}
                <div className="grid grid-cols-3 gap-6 mb-12">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="glass-panel p-6 rounded-[2.5rem] border border-white/60 text-center shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all cursor-default relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className={`material-symbols-outlined text-4xl mb-2 ${stat.color || 'text-[#2D241E]'} group-hover:rotate-12 transition-transform`}>
                                {stat.icon}
                            </span>
                            <p className="text-4xl font-black text-[#2D241E] leading-tight mb-1">{stat.value}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] opacity-60">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Left Column: Rating Form */}
                    <div className="lg:col-span-4 space-y-8 sticky top-24">
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
                                isEditing={isEditing}
                                onCancel={cancelEdit}
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
                    <div className="lg:col-span-8">
                        <FeedbackHistoryList history={history} onEdit={handleEdit} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
