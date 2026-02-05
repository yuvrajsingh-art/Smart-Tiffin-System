import { useState } from 'react';
import ProviderSidebar from "../../components/ui/Provider/ProviderSidebar";
import { MdDeliveryDining, MdRestaurant, } from 'react-icons/md';
import ProviderHeader from '../../components/ui/Provider/ProviderHeader';
import AnalysisCards from '../../components/ui/Provider/Analysis/AnalysisCards';
import DailyPerformanceAnalysis from '../../components/ui/Provider/Analysis/DailyPerformanceAnalysis';
import TopSellingAnalysis from '../../components/ui/Provider/Analysis/TopSellingAnalysis';
import CustomerInsight from '../../components/ui/Provider/Analysis/CustomerInsight';
import DeliveryPerformance from '../../components/ui/Provider/Analysis/DeliveryPerformace';

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
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeRange === 'week'
                                ? 'bg-orange-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            This Week
                        </button>
                        <button
                            onClick={() => setTimeRange('month')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeRange === 'month'
                                ? 'bg-orange-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            This Month
                        </button>
                    </div>
                </div>

                {/* Key Metrics */}
                <AnalysisCards
                    analyticsData={analyticsData}
                    timeRange={timeRange}
                />
                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Daily Performance Chart */}
                    <DailyPerformanceAnalysis
                        timeRange={timeRange}
                        currentData={currentData} />

                    {/* Top Selling Items */}
                    <TopSellingAnalysis
                        topItems={topItems} />
                </div>

                {/* Customer & Delivery Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Customer Insights */}
                    <CustomerInsight />

                    {/* Delivery Performance */}
                   <DeliveryPerformance
                   deliveryStats={deliveryStats}/>
                </div>
            </div>
        </div>
    );
}

export default ProviderAnalysis;