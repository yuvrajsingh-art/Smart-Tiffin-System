import { useState, useEffect } from 'react';
import ProviderApi from '../../services/ProviderApi';
import ProviderSidebar from '../../components/ui/Provider/ProviderSidebar';
import ProviderHeader from '../../components/ui/Provider/ProviderHeader';

function Analytics() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState({
        revenue: { total: 0, thisMonth: 0, lastMonth: 0 },
        orders: { total: 0, today: 0, thisWeek: 0, thisMonth: 0 },
        customers: { total: 0, active: 0, new: 0 },
        subscriptions: { active: 0, paused: 0, cancelled: 0 }
    });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const generateTestOrders = async () => {
        try {
            const res = await ProviderApi.post('/provider-subscription/generate-test-orders');
            if (res.data.success) {
                alert(`Generated ${res.data.data.ordersCreated} test orders!`);
                fetchAnalytics(); // Refresh data
            }
        } catch (error) {
            console.error('Error generating test orders:', error);
            alert('Failed to generate test orders');
        }
    };

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const [dashboardRes, subsRes, ordersRes] = await Promise.all([
                ProviderApi.get('/provider-deshbord/dashboard'),
                ProviderApi.get('/provider-subscription'),
                ProviderApi.get('/provider-orders/today')
            ]);

            console.log('Dashboard Response:', dashboardRes.data);
            console.log('Subscriptions Response:', subsRes.data);
            console.log('Orders Response:', ordersRes.data);

            const stats = dashboardRes.data?.data || {};
            const subs = subsRes.data?.data || [];
            const subsStats = subsRes.data?.stats || {};
            const orders = ordersRes.data?.data || {};

            console.log('Stats:', stats);
            console.log('Subscription Stats:', subsStats);
            console.log('Business Health:', stats.businessHealth);
            console.log('Live Operations:', stats.liveOperations);

            const todayOrders = (orders.lunch?.length || 0) + (orders.dinner?.length || 0);

            const analyticsData = {
                revenue: {
                    total: stats.businessHealth?.totalRevenue || 0,
                    thisMonth: stats.businessHealth?.thisMonthRevenue || 0,
                    lastMonth: stats.businessHealth?.lastMonthRevenue || 0
                },
                orders: {
                    total: stats.liveOperations?.totalOrdersAllTime || 0,
                    today: todayOrders,
                    thisWeek: stats.liveOperations?.totalOrdersThisWeek || 0,
                    thisMonth: stats.liveOperations?.totalOrdersThisMonth || 0
                },
                customers: {
                    total: stats.businessHealth?.totalCustomers || 0,
                    active: subsStats.active || stats.businessHealth?.activeSubscribers || 0,
                    new: 0
                },
                subscriptions: {
                    active: subsStats.active || stats.businessHealth?.activeSubscribers || 0,
                    paused: subsStats.paused || stats.businessHealth?.pausedSubscribers || 0,
                    cancelled: subsStats.cancelled || 0
                }
            };

            console.log('Final Analytics Data:', analyticsData);
            setAnalytics(analyticsData);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon, title, value, change, color = 'orange' }) => (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
                <div className={`size-12 rounded-xl bg-${color}-50 flex items-center justify-center text-${color}-600`}>
                    <span className="material-symbols-outlined text-2xl">{icon}</span>
                </div>
                {change && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${change > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {change > 0 ? '+' : ''}{change}%
                    </span>
                )}
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
            <p className="text-3xl font-black text-gray-800">{value}</p>
        </div>
    );

    if (loading) {
        return (
            <div className="flex h-screen bg-[#FFFBF5]">
                <ProviderSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#FFFBF5]">
            <ProviderSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-auto">
                <ProviderHeader 
                    title="Analytics" 
                    subtitle="Track your business performance"
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                
                <div className="p-6 space-y-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Test Button */}
                        {analytics.orders.total === 0 && (
                            <div className="mb-6 bg-orange-50 border border-orange-200 rounded-2xl p-4">
                                <p className="text-sm font-bold text-orange-800 mb-2">⚠️ No orders found in database</p>
                                <button 
                                    onClick={generateTestOrders}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600"
                                >
                                    Generate Test Orders
                                </button>
                            </div>
                        )}
                        {/* Revenue Stats */}
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Revenue Overview</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <StatCard 
                                    icon="account_balance_wallet" 
                                    title="Total Revenue" 
                                    value={`₹${analytics.revenue.total.toLocaleString()}`}
                                    color="green"
                                />
                                <StatCard 
                                    icon="trending_up" 
                                    title="This Month" 
                                    value={`₹${analytics.revenue.thisMonth.toLocaleString()}`}
                                    change={analytics.revenue.lastMonth ? Math.round(((analytics.revenue.thisMonth - analytics.revenue.lastMonth) / analytics.revenue.lastMonth) * 100) : 0}
                                    color="blue"
                                />
                                <StatCard 
                                    icon="history" 
                                    title="Last Month" 
                                    value={`₹${analytics.revenue.lastMonth.toLocaleString()}`}
                                    color="purple"
                                />
                            </div>
                        </div>

                        {/* Orders Stats */}
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Orders Analytics</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <StatCard 
                                    icon="shopping_bag" 
                                    title="Total Orders" 
                                    value={analytics.orders.total}
                                    color="orange"
                                />
                                <StatCard 
                                    icon="today" 
                                    title="Today" 
                                    value={analytics.orders.today}
                                    color="blue"
                                />
                                <StatCard 
                                    icon="date_range" 
                                    title="This Week" 
                                    value={analytics.orders.thisWeek}
                                    color="green"
                                />
                                <StatCard 
                                    icon="calendar_month" 
                                    title="This Month" 
                                    value={analytics.orders.thisMonth}
                                    color="purple"
                                />
                            </div>
                        </div>

                        {/* Customers & Subscriptions */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 mb-4">Customer Stats</h2>
                                <div className="grid grid-cols-1 gap-4">
                                    <StatCard 
                                        icon="group" 
                                        title="Total Customers" 
                                        value={analytics.customers.total}
                                        color="blue"
                                    />
                                    <StatCard 
                                        icon="person_check" 
                                        title="Active Customers" 
                                        value={analytics.customers.active}
                                        color="green"
                                    />
                                    <StatCard 
                                        icon="person_add" 
                                        title="New This Month" 
                                        value={analytics.customers.new}
                                        color="orange"
                                    />
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-gray-800 mb-4">Subscription Stats</h2>
                                <div className="grid grid-cols-1 gap-4">
                                    <StatCard 
                                        icon="card_membership" 
                                        title="Active Subscriptions" 
                                        value={analytics.subscriptions.active}
                                        color="green"
                                    />
                                    <StatCard 
                                        icon="pause_circle" 
                                        title="Paused" 
                                        value={analytics.subscriptions.paused}
                                        color="yellow"
                                    />
                                    <StatCard 
                                        icon="cancel" 
                                        title="Cancelled" 
                                        value={analytics.subscriptions.cancelled}
                                        color="red"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Performance Summary */}
                        <div className="bg-white rounded-2xl p-6 border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Performance Summary</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Average Order Value</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        ₹{analytics.orders.total > 0 ? Math.round(analytics.revenue.total / analytics.orders.total) : 0}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Customer Retention Rate</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {analytics.customers.total > 0 ? Math.round((analytics.customers.active / analytics.customers.total) * 100) : 0}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Analytics;
