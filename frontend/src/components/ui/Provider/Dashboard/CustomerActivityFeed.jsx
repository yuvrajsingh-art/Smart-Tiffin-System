import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaUserMinus, FaStar, FaExclamationTriangle, FaUtensils, FaUserFriends, FaBan } from 'react-icons/fa';
import ProviderApi from '../../../../services/ProviderApi';

const CustomerActivityFeed = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivities();
        
        // Auto-refresh every 2 minutes
        const interval = setInterval(() => {
            fetchActivities();
        }, 120000);
        
        return () => clearInterval(interval);
    }, []);

    const fetchActivities = async () => {
        try {
            const response = await ProviderApi.get('/provider/activities');
            if (response.data?.success) {
                const fetchedActivities = response.data.data || [];
                
                // Debug: Check cancelled order timestamps
                const cancelledActivities = fetchedActivities.filter(a => a.type === 'order_cancelled');
                if (cancelledActivities.length > 0) {
                    console.log('🔴 Cancelled Activities:', cancelledActivities.map(a => ({
                        customer: a.customer,
                        message: a.message,
                        time: a.time,
                        timeAgo: getTimeAgo(a.time)
                    })));
                }
                
                setActivities(fetchedActivities);
            }
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
                return <FaBan className="text-red-600" />;
            case 'feedback':
                return <FaStar className="text-yellow-600" />;
            case 'complaint':
                return <FaExclamationTriangle className="text-orange-600" />;
            case 'order':
                return <FaUtensils className="text-blue-600" />;
            case 'guest':
                return <FaUserFriends className="text-purple-600" />;
            default:
                return <FaUserPlus className="text-gray-600" />;
        }
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
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
