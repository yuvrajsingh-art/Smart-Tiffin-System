import React, { useState, useEffect } from 'react';
import { FaUsers, FaRupeeSign, FaUtensils, FaStar } from 'react-icons/fa';
import { MdTrendingUp } from 'react-icons/md';
import ProviderApi from '../../../../services/ProviderApi';

const ProviderStatsCards = () => {
    const [stats, setStats] = useState({
        totalCustomers: 0,
        todayOrders: 0,
        monthlyRevenue: 0,
        avgRating: 0,
        activeSubscriptions: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await ProviderApi.get('/provider-deshbord/dashboard');
            if (response.data) {
                setStats({
                    totalCustomers: response.data.totalCustomers || 0,
                    todayOrders: response.data.todayOrders || 0,
                    monthlyRevenue: response.data.monthlyRevenue || 0,
                    avgRating: response.data.avgRating || 0,
                    activeSubscriptions: response.data.activeSubscriptions || 0
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            // Fallback to dummy data if API fails
            setStats({
                totalCustomers: 156,
                todayOrders: 89,
                monthlyRevenue: 45600,
                avgRating: 4.6,
                activeSubscriptions: 134
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                        <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium">Total Customers</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalCustomers}</p>
                        <div className="flex items-center mt-2">
                            <MdTrendingUp className="text-green-500 mr-1" />
                            <span className="text-green-500 text-sm font-medium">+12%</span>
                        </div>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                        <FaUsers className="text-blue-600 text-xl" />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium">Today's Orders</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{stats.todayOrders}</p>
                        <div className="flex items-center mt-2">
                            <MdTrendingUp className="text-green-500 mr-1" />
                            <span className="text-green-500 text-sm font-medium">+8%</span>
                        </div>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-full">
                        <FaUtensils className="text-orange-600 text-xl" />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium">Monthly Revenue</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">
                            ₹{stats.monthlyRevenue.toLocaleString()}
                        </p>
                        <div className="flex items-center mt-2">
                            <MdTrendingUp className="text-green-500 mr-1" />
                            <span className="text-green-500 text-sm font-medium">+15%</span>
                        </div>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                        <FaRupeeSign className="text-green-600 text-xl" />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium">Average Rating</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{stats.avgRating}</p>
                        <div className="flex items-center mt-2">
                            <MdTrendingUp className="text-green-500 mr-1" />
                            <span className="text-green-500 text-sm font-medium">+0.2</span>
                        </div>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full">
                        <FaStar className="text-yellow-600 text-xl" />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProviderStatsCards;
