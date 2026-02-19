import React, { useState, useEffect } from 'react';
import { FaUsers, FaPause, FaClock, FaRupeeSign } from 'react-icons/fa';
import ProviderApi from '../../../../services/ProviderApi';

const ProviderStatsCards = () => {
    const [stats, setStats] = useState({
        totalActive: 0,
        paused: 0,
        expiringThisWeek: 0,
        totalRevenue: 0,
        avgRating: 0,
        pendingApps: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch from wallet API for accurate revenue
            const [subscriptionRes, walletRes, feedbackRes] = await Promise.all([
                ProviderApi.get('/provider-subscription/stats'),
                ProviderApi.get('/provider-wallet/summary'),
                ProviderApi.get('/provider/feedback/categorized').catch(() => ({ data: { success: false } }))
            ]);
            
            const subscriptionStats = subscriptionRes.data?.stats || {};
            const walletData = walletRes.data?.data || {};
            
            // Calculate average rating from feedback
            let avgRating = 0;
            let pendingApps = 0;
            
            if (feedbackRes.data.success && feedbackRes.data.data) {
                const { positive, neutral, negative } = feedbackRes.data.data;
                const totalReviews = (positive?.count || 0) + (neutral?.count || 0) + (negative?.count || 0);
                
                if (totalReviews > 0) {
                    const totalRating = 
                        (positive?.reviews || []).reduce((sum, r) => sum + (r.rating || 0), 0) +
                        (neutral?.reviews || []).reduce((sum, r) => sum + (r.rating || 0), 0) +
                        (negative?.reviews || []).reduce((sum, r) => sum + (r.rating || 0), 0);
                    avgRating = (totalRating / totalReviews).toFixed(1);
                }
            }
            
            // Pending apps = paused subscriptions
            pendingApps = subscriptionStats.paused || 0;
            
            setStats({
                totalActive: subscriptionStats.totalActive || 0,
                paused: subscriptionStats.paused || 0,
                expiringThisWeek: subscriptionStats.expiringThisWeek || 0,
                totalRevenue: walletData.totalEarnings || 0,
                avgRating: avgRating || 0,
                pendingApps: pendingApps
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const cards = [
        {
            title: 'Active Subscribers',
            value: stats.totalActive,
            icon: <FaUsers />,
            color: 'bg-green-100 text-green-600',
            borderColor: 'border-green-200'
        },
        {
            title: 'Avg Rating',
            value: stats.avgRating > 0 ? `${stats.avgRating} ★` : 'N/A',
            icon: <FaUsers />,
            color: 'bg-blue-100 text-blue-600',
            borderColor: 'border-blue-200'
        },
        {
            title: 'Pending Apps',
            value: stats.pendingApps,
            icon: <FaClock />,
            color: 'bg-orange-100 text-orange-600',
            borderColor: 'border-orange-200',
            subtext: 'Paused Subs'
        },
        {
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: <FaRupeeSign />,
            color: 'bg-purple-100 text-purple-600',
            borderColor: 'border-purple-200'
        }
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse h-32 border border-gray-100"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border ${card.borderColor}`}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">{card.title}</p>
                            <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
                            {card.subtext && (
                                <p className="text-xs text-red-500 font-medium mt-1">{card.subtext}</p>
                            )}
                        </div>
                        <div className={`p-3 rounded-lg ${card.color} text-xl`}>
                            {card.icon}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProviderStatsCards;
