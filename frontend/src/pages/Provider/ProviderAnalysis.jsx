import { useState, useEffect } from 'react';
import ProviderSidebar from "../../components/ui/Provider/ProviderSidebar";
import ProviderHeader from '../../components/ui/Provider/ProviderHeader';
import AnalysisCards from '../../components/ui/Provider/Analysis/AnalysisCards';
import DailyPerformanceAnalysis from '../../components/ui/Provider/Analysis/DailyPerformanceAnalysis';
import TopSellingAnalysis from '../../components/ui/Provider/Analysis/TopSellingAnalysis';
import CustomerInsight from '../../components/ui/Provider/Analysis/CustomerInsight';
import DeliveryPerformance from '../../components/ui/Provider/Analysis/DeliveryPerformace';
import ProviderApi from '../../services/ProviderApi';

function ProviderAnalysis() {
    const [timeRange, setTimeRange] = useState('week');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [analyticsData, setAnalyticsData] = useState({
        week: { revenue: 0, orders: 0, customers: 0, avgOrderValue: 0, growth: { revenue: 0, orders: 0, customers: 0 }, dailyStats: [] },
        month: { revenue: 0, orders: 0, customers: 0, avgOrderValue: 0, growth: { revenue: 0, orders: 0, customers: 0 } }
    });
    const [topItems, setTopItems] = useState([]);
    const [deliveryStats, setDeliveryStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const [dashboardRes, subscriptionsRes, walletRes, transactionsRes] = await Promise.all([
                ProviderApi.get('/provider-deshbord/dashboard'),
                ProviderApi.get('/provider-subscription'),
                ProviderApi.get('/provider-wallet/summary'),
                ProviderApi.get('/provider-wallet/transactions?limit=100')
            ]);
            
            console.log('Dashboard Response:', dashboardRes.data);
            console.log('Subscriptions Response:', subscriptionsRes.data);
            console.log('Wallet Response:', walletRes.data);
            
            let todayRevenue = 0;
            let totalRevenue = 0;
            let weekRevenue = 0;
            let activeSubscribers = 0;
            let totalOrders = 0;
            
            // Get revenue from wallet API (most accurate)
            if (walletRes.data && walletRes.data.data) {
                totalRevenue = walletRes.data.data.totalEarnings || 0;
            }
            
            // Calculate week revenue from transactions (same logic as MyRevenue)
            if (transactionsRes.data && transactionsRes.data.data) {
                const transactions = transactionsRes.data.data;
                const today = new Date();
                const weekStart = new Date(today);
                weekStart.setDate(today.getDate() - today.getDay() + 1);
                
                transactions.forEach(txn => {
                    const txnDate = new Date(txn.date || txn.createdAt);
                    if (txnDate >= weekStart && txnDate <= today) {
                        if (txn.status === 'Success' || txn.status === 'Completed') {
                            weekRevenue += Math.abs(txn.amount);
                        }
                    }
                });
                
                console.log('Week Revenue Calculated:', weekRevenue);
            }
            
            // Get data from dashboard API
            if (dashboardRes.data && dashboardRes.data.data) {
                const data = dashboardRes.data.data;
                console.log('Business Health:', data.businessHealth);
                console.log('Live Operations:', data.liveOperations);
                
                todayRevenue = data.businessHealth?.todayRevenue || 0;
                activeSubscribers = data.businessHealth?.activeSubscribers || 0;
                totalOrders = data.liveOperations?.totalOrdersToday || data.liveOperations?.ordersToPrep || 0;
            }
            
            // Fallback: Count active subscriptions from subscription API
            if (subscriptionsRes.data && subscriptionsRes.data.data) {
                const activeCount = subscriptionsRes.data.data.filter(sub => 
                    sub.status === 'active' || sub.status === 'approved'
                ).length;
                console.log('Active subscriptions from API:', activeCount);
                if (activeCount > 0) {
                    activeSubscribers = activeCount;
                }
            }
            
            console.log('Final Parsed Values:', { todayRevenue, totalRevenue, weekRevenue, activeSubscribers, totalOrders });
            
            // Calculate average order value
            const avgOrderValue = totalOrders > 0 ? Math.round(todayRevenue / totalOrders) : 0;
            
            setAnalyticsData({
                week: {
                    revenue: weekRevenue,
                    orders: totalOrders * 7,
                    customers: activeSubscribers,
                    avgOrderValue: avgOrderValue,
                    growth: { revenue: 12.5, orders: 8.3, customers: 15.2 },
                    dailyStats: []
                },
                month: {
                    revenue: totalRevenue,
                    orders: totalOrders * 30,
                    customers: activeSubscribers,
                    avgOrderValue: avgOrderValue,
                    growth: { revenue: 18.7, orders: 22.1, customers: 28.5 }
                }
            });

            // Fetch top items from menu
            const menuRes = await ProviderApi.get('/provider-menus/today');
            if (menuRes.data && menuRes.data.data) {
                const lunchDinner = menuRes.data.data.filter(m => m.mealType === 'lunch' || m.mealType === 'dinner');
                const formatted = lunchDinner.slice(0, 2).map((item, idx) => ({
                    name: item.name,
                    orders: 100 - (idx * 20),
                    revenue: item.price * (100 - (idx * 20)),
                    percentage: 50 - (idx * 20)
                }));
                setTopItems(formatted);
            }

            setDeliveryStats([
                { status: 'On Time', count: 78, percentage: 88, color: 'bg-green-500' },
                { status: 'Delayed', count: 8, percentage: 9, color: 'bg-yellow-500' },
                { status: 'Cancelled', count: 3, percentage: 3, color: 'bg-red-500' }
            ]);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#FFFBF5]">
            <ProviderSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col">
                <ProviderHeader
                    title="Analytics"
                    subtitle="Track your business performance and insights"
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <div className="flex-1 p-6 overflow-y-auto">
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

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                        </div>
                    ) : (
                        <>
                            <AnalysisCards analyticsData={analyticsData} timeRange={timeRange} />
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                <DailyPerformanceAnalysis timeRange={timeRange} currentData={analyticsData[timeRange]} />
                                <TopSellingAnalysis topItems={topItems} />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <CustomerInsight />
                                <DeliveryPerformance deliveryStats={deliveryStats} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProviderAnalysis;