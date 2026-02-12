import React, { useState, useEffect } from 'react';
import { FaUsers, FaPause, FaClock, FaRupeeSign } from 'react-icons/fa';
import ProviderApi from '../../../../services/ProviderApi';

const ProviderStatsCards = () => {
    const [stats, setStats] = useState({
        totalActive: 0,
        paused: 0,
        expiringThisWeek: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch from wallet API for accurate revenue
            const [subscriptionRes, walletRes] = await Promise.all([
                ProviderApi.get('/provider-subscription/stats'),
                ProviderApi.get('/provider-wallet/summary')
            ]);
            
            const subscriptionStats = subscriptionRes.data?.stats || {};
            const walletData = walletRes.data?.data || {};
            
            setStats({
                totalActive: subscriptionStats.totalActive || 0,
                paused: subscriptionStats.paused || 0,
                expiringThisWeek: subscriptionStats.expiringThisWeek || 0,
                totalRevenue: walletData.totalEarnings || 0
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
            title: 'Paused',
            value: stats.paused,
            icon: <FaPause />,
            color: 'bg-yellow-100 text-yellow-600',
            borderColor: 'border-yellow-200'
        },
        {
            title: 'Expiring Soon',
            value: stats.expiringThisWeek,
            icon: <FaClock />,
            color: 'bg-red-100 text-red-600',
            borderColor: 'border-red-200',
            subtext: 'This Week'
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
