import ProviderSidebar from "../../components/ui/Provider/ProviderSidebar";
import ProviderHeader from '../../components/ui/Provider/ProviderHeader';
import FeedbackStateCards from '../../components/ui/Provider/CustomerFeedback/FeedbackStateCards';
import { useState } from "react";
import FeedbackRatingDistribution from "../../components/ui/Provider/CustomerFeedback/FeedbackRatingDistribution";
import FeedbackFiltereReviews from "../../components/ui/Provider/CustomerFeedback/FeedbackFilterReviews";
import FeedackCards from "../../components/ui/Provider/CustomerFeedback/FeedbackCards";


function CustomerFeedback() {
    const [feedbacks] = useState([
        {
            id: 1,
            customer: 'Rahul Sharma',
            avatar: 'RS',
            rating: 5,
            comment: 'Excellent food quality and timely delivery. The lunch special was amazing!',
            date: '2024-01-25',
            time: '2:30 PM',
            orderId: 'ORD001',
            item: 'Lunch Special',
            helpful: 12,
            replied: false
        },
        {
            id: 2,
            customer: 'Priya Singh',
            avatar: 'PS',
            rating: 4,
            comment: 'Good taste but the quantity could be a bit more. Overall satisfied with the service.',
            date: '2024-01-24',
            time: '8:45 PM',
            orderId: 'ORD002',
            item: 'Dinner Special',
            helpful: 8,
            replied: true,
            reply: 'Thank you for your feedback! We\'ll work on improving the quantity.'
        },
        {
            id: 3,
            customer: 'Amit Kumar',
            avatar: 'AK',
            rating: 3,
            comment: 'Food was okay but delivery was delayed by 30 minutes. Please improve delivery time.',
            date: '2024-01-23',
            time: '1:45 PM',
            orderId: 'ORD003',
            item: 'Lunch Special',
            helpful: 5,
            replied: false
        },
        {
            id: 4,
            customer: 'Sneha Patel',
            avatar: 'SP',
            rating: 5,
            comment: 'Absolutely loved the dinner special! Fresh ingredients and perfect taste. Will order again.',
            date: '2024-01-22',
            time: '9:15 PM',
            orderId: 'ORD004',
            item: 'Dinner Special',
            helpful: 15,
            replied: true,
            reply: 'Thank you so much! We\'re glad you enjoyed your meal.'
        },
        {
            id: 5,
            customer: 'Vikash Gupta',
            avatar: 'VG',
            rating: 2,
            comment: 'Food was cold when delivered and taste was not up to the mark. Need improvement.',
            date: '2024-01-21',
            time: '7:30 PM',
            orderId: 'ORD005',
            item: 'Dinner Special',
            helpful: 3,
            replied: false
        }
    ]);

    const [filter, setFilter] = useState('all');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');

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
        // Here you would typically send the reply to your backend
        console.log(`Replying to feedback ${feedbackId}: ${replyText}`);
        setReplyingTo(null);
        setReplyText('');
    };




    return (
        <div className="flex h-screen bg-gray-50">
            <ProviderSidebar />
            <div className="flex-1 p-6 overflow-y-auto">
                <ProviderHeader
                    title="Welcome Back Chef!"
                    subtitle="  Here's what's happening with your tiffin service today."
                />

                {/* Stats Cards */}
                <div >
                    <FeedbackStateCards feedbacks={feedbacks} />
                </div>
                {/* RatingDistribution Tabs */}

                <FeedbackRatingDistribution feedbacks={feedbacks} />

                {/* Filter Tabs */}
                <FeedbackFiltereReviews feedbacks={feedbacks} />

                {/* Feedback Cards */}
                <FeedackCards
                    feedbacks={filteredFeedbacks}       // filtered feedbacks
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                    replyText={replyText}
                    setReplyText={setReplyText}
                    handleReply={handleReply}
                    getRatingColor={getRatingColor} />
                {/* Empty State */}
                {filteredFeedbacks.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                        <div className="text-6xl mb-4">💬</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Feedback Found</h3>
                        <p className="text-gray-600">No reviews match the selected filter</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CustomerFeedback; 