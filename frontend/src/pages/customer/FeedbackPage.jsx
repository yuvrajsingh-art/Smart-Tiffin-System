import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/UserContext';

const FeedbackPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState(null);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        } else {
            fetchPendingOrders();
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const { data } = await axios.get(`/api/customer/track/live`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setOrder(data.data.order);
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        }
    };

    const fetchPendingOrders = async () => {
        try {
            const { data } = await axios.get('/api/customer/feedback/pending', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success && data.data.length > 0) {
                setOrder(data.data[0]);
            }
        } catch (error) {
            console.error('Error fetching pending orders:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setLoading(true);
        try {
            const targetOrderId = orderId || order._id;
            const { data } = await axios.post(
                `/api/customer/feedback/${targetOrderId}`,
                { rating, feedback },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                toast.success('Feedback submitted successfully!');
                navigate('/customer/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit feedback');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h1 className="text-2xl font-bold text-[#2D241E] mb-2">Rate Your Experience</h1>
                    <p className="text-gray-600 mb-6">Help us improve by sharing your feedback</p>

                    {order && (
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                            <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
                            <p className="font-semibold text-[#2D241E]">{order.mealType} Meal</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Rating Stars */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                                How would you rate your meal?
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`text-4xl transition-all ${
                                            star <= rating ? 'text-yellow-400' : 'text-gray-300'
                                        } hover:scale-110`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <p className="text-sm text-gray-600 mt-2">
                                    {rating === 5 && 'Excellent!'}
                                    {rating === 4 && 'Very Good!'}
                                    {rating === 3 && 'Good'}
                                    {rating === 2 && 'Fair'}
                                    {rating === 1 && 'Poor'}
                                </p>
                            )}
                        </div>

                        {/* Feedback Text */}
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Share your feedback (Optional)
                            </label>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Tell us about your experience..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                rows="4"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/customer/dashboard')}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                            >
                                Skip
                            </button>
                            <button
                                type="submit"
                                disabled={loading || rating === 0}
                                className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {loading ? 'Submitting...' : 'Submit Feedback'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FeedbackPage;
