import { useState, useEffect } from "react";
import ProviderSidebar from "../../components/ui/Provider/ProviderSidebar";
import ProviderHeader from '../../components/ui/Provider/ProviderHeader';
import FeedbackStateCards from '../../components/ui/Provider/CustomerFeedback/FeedbackStateCards';
import FeedbackRatingDistribution from "../../components/ui/Provider/CustomerFeedback/FeedbackRatingDistribution";
import FeedbackFiltereReviews from "../../components/ui/Provider/CustomerFeedback/FeedbackFilterReviews";
import FeedackCards from "../../components/ui/Provider/CustomerFeedback/FeedbackCards";
import ProviderApi from '../../services/ProviderApi';

function CustomerFeedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await ProviderApi.get('/provider-reviews/categorized');
            console.log('Reviews Response:', response.data);
            if (response.data && response.data.reviews) {
                const allReviews = [
                    ...response.data.reviews.negative || [],
                    ...response.data.reviews.neutral || [],
                    ...response.data.reviews.positive || []
                ];
                const formattedFeedbacks = allReviews.map(review => ({
                    id: review._id,
                    customer: review.customer?.fullName || review.customer?.name || 'Anonymous',
                    avatar: (review.customer?.fullName || review.customer?.name || 'NA').split(' ').map(n => n[0]).join('').toUpperCase(),
                    rating: review.rating || 0,
                    comment: review.comment || review.reviewText || 'No comment',
                    date: new Date(review.createdAt).toLocaleDateString('en-IN'),
                    time: new Date(review.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                    orderId: review.order || 'N/A',
                    item: 'N/A',
                    helpful: 0,
                    replied: !!review.response,
                    reply: review.response
                }));
                setFeedbacks(formattedFeedbacks);
            }
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            setFeedbacks([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredFeedbacks = feedbacks.filter(feedback => {
        if (filter === 'all') return true;
        if (filter === 'high') return feedback.rating >= 4;
        if (filter === 'low') return feedback.rating <= 3;
        if (filter === 'replied') return feedback.replied;
        if (filter === 'pending') return !feedback.replied;
        return true;
    });

    const getRatingColor = (rating) => {
        if (rating >= 4) return 'text-green-600';
        if (rating >= 3) return 'text-yellow-600';
        return 'text-red-600';
    };

    const handleReply = (feedbackId) => {
        console.log(`Replying to feedback ${feedbackId}: ${replyText}`);
        setReplyingTo(null);
        setReplyText('');
    };

    return (
        <div className="flex h-screen bg-[#FFFBF5]">
            <ProviderSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col">
                <ProviderHeader
                    title="Customer Feedback"
                    subtitle="View and respond to customer reviews"
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <div className="flex-1 p-6 overflow-y-auto">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                        </div>
                    ) : (
                        <>
                            <FeedbackStateCards feedbacks={feedbacks} />
                            <FeedbackRatingDistribution feedbacks={feedbacks} />
                            <FeedbackFiltereReviews feedbacks={feedbacks} />
                            <FeedackCards
                                feedbacks={filteredFeedbacks}
                                replyingTo={replyingTo}
                                setReplyingTo={setReplyingTo}
                                replyText={replyText}
                                setReplyText={setReplyText}
                                handleReply={handleReply}
                                getRatingColor={getRatingColor}
                            />
                            {filteredFeedbacks.length === 0 && (
                                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                                    <div className="text-6xl mb-4">💬</div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Feedback Found</h3>
                                    <p className="text-gray-600">No reviews match the selected filter</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CustomerFeedback;