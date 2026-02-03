import React, { useState } from 'react';
import ProviderSidebar from "../../components/ui/Provider/ProviderSidebar";
import { FaStar, FaRegStar, FaThumbsUp, FaThumbsDown, FaReply } from 'react-icons/fa';
import { MdFilterList } from 'react-icons/md';
import ProviderHeader from '../../components/ui/Provider/ProviderHeader';


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

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            index < rating ? (
                <FaStar key={index} className="text-yellow-400" />
            ) : (
                <FaRegStar key={index} className="text-gray-300" />
            )
        ));
    };

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

    const getAverageRating = () => {
        const total = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
        return (total / feedbacks.length).toFixed(1);
    };

    const getRatingDistribution = () => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        feedbacks.forEach(feedback => {
            distribution[feedback.rating]++;
        });
        return distribution;
    };

    const ratingDistribution = getRatingDistribution();

    return (
        <div className="flex h-screen bg-gray-50">
            <ProviderSidebar />
            <div className="flex-1 p-6 overflow-y-auto">
               <ProviderHeader
                    title="Welcome Back Chef!"
                    subtitle="  Here's what's happening with your tiffin service today."
                />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-orange-600">{getAverageRating()}</p>
                            <div className="flex justify-center gap-1 my-2">
                                {renderStars(Math.round(getAverageRating()))}
                            </div>
                            <p className="text-sm text-gray-600">Average Rating</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{feedbacks.length}</p>
                            <p className="text-sm text-gray-600">Total Reviews</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{feedbacks.filter(f => f.rating >= 4).length}</p>
                            <p className="text-sm text-gray-600">Positive Reviews</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-600">{feedbacks.filter(f => !f.replied).length}</p>
                            <p className="text-sm text-gray-600">Pending Replies</p>
                        </div>
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Rating Distribution</h3>
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map(rating => (
                            <div key={rating} className="flex items-center gap-3">
                                <span className="text-sm font-medium w-8">{rating} ★</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-orange-500 h-2 rounded-full" 
                                        style={{ width: `${(ratingDistribution[rating] / feedbacks.length) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm text-gray-600 w-8">{ratingDistribution[rating]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <MdFilterList className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Filter Reviews:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'all'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            All ({feedbacks.length})
                        </button>
                        <button
                            onClick={() => setFilter('high')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'high'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            High Rating (4-5 ★)
                        </button>
                        <button
                            onClick={() => setFilter('low')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'low'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Low Rating (1-3 ★)
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'pending'
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Pending Reply
                        </button>
                        <button
                            onClick={() => setFilter('replied')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'replied'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Replied
                        </button>
                    </div>
                </div>

                {/* Feedback Cards */}
                <div className="space-y-4">
                    {filteredFeedbacks.map((feedback) => (
                        <div key={feedback.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            {/* Feedback Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                                        {feedback.avatar}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{feedback.customer}</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1">
                                                {renderStars(feedback.rating)}
                                            </div>
                                            <span className={`font-semibold ${getRatingColor(feedback.rating)}`}>
                                                {feedback.rating}.0
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right text-sm text-gray-500">
                                    <p>{feedback.date}</p>
                                    <p>{feedback.time}</p>
                                </div>
                            </div>

                            {/* Order Info */}
                            <div className="bg-gray-50 p-3 rounded-lg mb-4">
                                <p className="text-sm text-gray-600">
                                    Order #{feedback.orderId} - {feedback.item}
                                </p>
                            </div>

                            {/* Comment */}
                            <p className="text-gray-700 mb-4">{feedback.comment}</p>

                            {/* Helpful Count */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <FaThumbsUp className="text-green-500" />
                                    <span>{feedback.helpful} found this helpful</span>
                                </div>
                            </div>

                            {/* Reply Section */}
                            {feedback.replied && feedback.reply && (
                                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FaReply className="text-blue-500" />
                                        <span className="font-medium text-blue-800">Your Reply:</span>
                                    </div>
                                    <p className="text-blue-700">{feedback.reply}</p>
                                </div>
                            )}

                            {/* Reply Form */}
                            {replyingTo === feedback.id && (
                                <div className="border-t pt-4">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Write your reply..."
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                        rows={3}
                                    />
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={() => handleReply(feedback.id)}
                                            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                                        >
                                            Send Reply
                                        </button>
                                        <button
                                            onClick={() => setReplyingTo(null)}
                                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            {!feedback.replied && replyingTo !== feedback.id && (
                                <div className="border-t pt-4">
                                    <button
                                        onClick={() => setReplyingTo(feedback.id)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                    >
                                        <FaReply />
                                        Reply to Customer
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

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