import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaUserMinus, FaStar, FaExclamationTriangle } from 'react-icons/fa';
import ProviderApi from '../../../../services/ProviderApi';

const CustomerActivityFeed = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const [subsResponse, reviewsResponse] = await Promise.all([
                ProviderApi.get('/provider-subscription?limit=5'),
                ProviderApi.get('/provider-reviews?limit=5')
            ]);

            const subscriptions = subsResponse.data?.data || [];
            const reviews = reviewsResponse.data?.data || [];

            const subActivities = subscriptions.map(sub => ({
                id: sub._id,
                type: sub.status === 'approved' ? 'new_subscription' : 'cancelled_subscription',
                customer: sub.customer?.fullName || 'Customer',
                message: sub.status === 'approved' 
                    ? `subscribed to ${sub.planName || 'plan'}` 
                    : `cancelled subscription`,
                time: new Date(sub.createdAt),
                icon: sub.status === 'approved' ? 'new' : 'cancelled'
            }));

            const reviewActivities = reviews.map(review => ({
                id: review._id,
                type: review.rating >= 4 ? 'positive_feedback' : 'negative_feedback',
                customer: review.customer?.fullName || 'Customer',
                message: `rated ${review.rating} stars`,
                time: new Date(review.createdAt),
                icon: review.rating >= 4 ? 'feedback' : 'complaint'
            }));

            const combined = [...subActivities, ...reviewActivities]
                .sort((a, b) => b.time - a.time)
                .slice(0, 8);

            setActivities(combined);
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (icon) => {
        switch (icon) {
            case 'new':
                return <FaUserPlus className="text-green-600" />;
            case 'cancelled':
                return <FaUserMinus className="text-red-600" />;
            case 'feedback':
                return <FaStar className="text-yellow-600" />;
            case 'complaint':
                return <FaExclamationTriangle className="text-orange-600" />;
            default:
                return <FaUserPlus className="text-gray-600" />;
        }
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Customer Activity</h2>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse flex gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800">Customer Activity</h2>
                <span className="text-xs text-gray-500 font-medium">Last 24 hours</span>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
                {activities.length > 0 ? (
                    activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                {getIcon(activity.icon)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-800">
                                    <span className="font-semibold">{activity.customer}</span>
                                    {' '}
                                    <span className="text-gray-600">{activity.message}</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-1">{getTimeAgo(activity.time)}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        <p className="text-sm">No recent activity</p>
                    </div>
                )}
            </div>

            {activities.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="text-sm text-orange-600 hover:text-orange-700 font-medium w-full text-center">
                        View All Activity →
                    </button>
                </div>
            )}
        </div>
    );
};

export default CustomerActivityFeed;
