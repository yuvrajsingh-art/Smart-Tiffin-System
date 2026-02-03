import React, { useState } from 'react';
import ProviderSidebar from "../../components/ui/Provider/ProviderSidebar";
import { FaRupeeSign, FaUsers, FaUtensils, FaCalendarAlt } from 'react-icons/fa';
import { MdDeliveryDining, MdRestaurant, MdTrendingDown, MdTrendingUp } from 'react-icons/md';
import ProviderHeader from '../../components/ui/Provider/ProviderHeader';

function ProviderAnalysis() {
    const [timeRange, setTimeRange] = useState('week');
    
    // Sample data - in real app, this would come from API
    const analyticsData = {
        week: {
            revenue: 15600,
            orders: 89,
            customers: 67,
            avgOrderValue: 175,
            growth: {
                revenue: 12.5,
                orders: 8.3,
                customers: 15.2
            },
            dailyStats: [
                { day: 'Mon', orders: 12, revenue: 2100 },
                { day: 'Tue', orders: 15, revenue: 2650 },
                { day: 'Wed', orders: 18, revenue: 3200 },
                { day: 'Thu', orders: 14, revenue: 2450 },
                { day: 'Fri', orders: 16, revenue: 2800 },
                { day: 'Sat', orders: 8, revenue: 1400 },
                { day: 'Sun', orders: 6, revenue: 1000 }
            ]
        },
        month: {
            revenue: 68400,
            orders: 387,
            customers: 234,
            avgOrderValue: 177,
            growth: {
                revenue: 18.7,
                orders: 22.1,
                customers: 28.5
            }
        }
    };

    const currentData = analyticsData[timeRange];
    
    const topItems = [
        { name: 'Lunch Special', orders: 156, revenue: 12480, percentage: 35 },
        { name: 'Dinner Special', orders: 134, revenue: 9380, percentage: 30 },
        { name: 'Breakfast Combo', orders: 89, revenue: 6230, percentage: 20 },
        { name: 'Snack Box', orders: 67, revenue: 3350, percentage: 15 }
    ];

    const customerInsights = [
        { type: 'New Customers', count: 23, percentage: 34, color: 'text-green-600' },
        { type: 'Returning Customers', count: 44, percentage: 66, color: 'text-blue-600' }
    ];

    const deliveryStats = [
        { status: 'On Time', count: 78, percentage: 88, color: 'bg-green-500' },
        { status: 'Delayed', count: 8, percentage: 9, color: 'bg-yellow-500' },
        { status: 'Cancelled', count: 3, percentage: 3, color: 'bg-red-500' }
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            <ProviderSidebar />
            <div className="flex-1 p-6 overflow-y-auto">
                {/* Header */} <ProviderHeader />
                <div className="flex justify-between items-center mb-6">
                   
                    <div className="flex gap-2">
                        <button
                            onClick={() => setTimeRange('week')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                timeRange === 'week'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            This Week
                        </button>
                        <button
                            onClick={() => setTimeRange('month')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                timeRange === 'month'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            This Month
                        </button>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">₹{currentData.revenue.toLocaleString()}</p>
                                <div className="flex items-center mt-2">
                                    <MdTrendingUp className="text-green-500 mr-1" />
                                    <span className="text-green-500 text-sm font-medium">+{currentData.growth.revenue}%</span>
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
                                <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{currentData.orders}</p>
                                <div className="flex items-center mt-2">
                                    <MdTrendingUp className="text-green-500 mr-1" />
                                    <span className="text-green-500 text-sm font-medium">+{currentData.growth.orders}%</span>
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
                                <p className="text-gray-600 text-sm font-medium">Active Customers</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{currentData.customers}</p>
                                <div className="flex items-center mt-2">
                                    <MdTrendingUp className="text-green-500 mr-1" />
                                    <span className="text-green-500 text-sm font-medium">+{currentData.growth.customers}%</span>
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
                                <p className="text-gray-600 text-sm font-medium">Avg Order Value</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">₹{currentData.avgOrderValue}</p>
                                <div className="flex items-center mt-2">
                                    <MdTrendingUp className="text-green-500 mr-1" />
                                    <span className="text-green-500 text-sm font-medium">+5.2%</span>
                                </div>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-full">
                                <FaCalendarAlt className="text-purple-600 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Daily Performance Chart */}
                    {timeRange === 'week' && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Performance</h3>
                            <div className="space-y-3">
                                {currentData.dailyStats.map((day, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium text-gray-700 w-12">{day.day}</span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                                                <div 
                                                    className="bg-orange-500 h-2 rounded-full" 
                                                    style={{ width: `${(day.orders / 20) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-800">{day.orders} orders</p>
                                            <p className="text-sm text-gray-600">₹{day.revenue}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Top Selling Items */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Items</h3>
                        <div className="space-y-4">
                            {topItems.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-orange-100 p-2 rounded-full">
                                            <MdRestaurant className="text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{item.name}</p>
                                            <p className="text-sm text-gray-600">{item.orders} orders</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-800">₹{item.revenue}</p>
                                        <p className="text-sm text-gray-600">{item.percentage}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Customer & Delivery Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Customer Insights */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Insights</h3>
                        <div className="space-y-4">
                            {customerInsights.map((insight, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-800">{insight.type}</p>
                                        <p className={`text-2xl font-bold ${insight.color}`}>{insight.count}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center">
                                            <span className={`text-sm font-bold ${insight.color}`}>{insight.percentage}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Performance */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Performance</h3>
                        <div className="space-y-4">
                            {deliveryStats.map((stat, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full ${stat.color}`}></div>
                                        <span className="font-medium text-gray-700">{stat.status}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full ${stat.color}`} 
                                                style={{ width: `${stat.percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-600 w-12">{stat.count}</span>
                                        <span className="text-sm text-gray-500 w-8">{stat.percentage}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <MdDeliveryDining className="text-green-600" />
                                <span className="text-sm font-medium text-green-800">Average delivery time: 28 minutes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProviderAnalysis;