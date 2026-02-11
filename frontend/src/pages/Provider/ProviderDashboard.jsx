import ProviderStatsCards from '../../components/ui/Provider/Dashboard/ProviderStatsCards';
import ProviderRecentOrders from '../../components/ui/Provider/Dashboard/ProviderRecentOrders';
import QuickActionsPanel from '../../components/ui/Provider/Dashboard/QuickActionsPanel';
import CustomerActivityFeed from '../../components/ui/Provider/Dashboard/CustomerActivityFeed';
import ProviderSidebar from '../../components/ui/Provider/ProviderSidebar';
import ProviderHeader from '../../components/ui/Provider/ProviderHeader';

const ProviderDashboard = () => {
    return (
        <div className="flex h-screen bg-[#FFFBF5]">
            <ProviderSidebar />
            <div className="flex-1 flex flex-col">
                <ProviderHeader
                    title="Welcome Back Chef!"
                    subtitle="Here's what's happening with your tiffin service today."
                />
                <div className="flex-1 p-6 overflow-y-auto">
                    {/* Quick Actions Panel */}
                    <QuickActionsPanel />

                    {/* Stats Cards */}
                    <ProviderStatsCards />

                    {/* Recent Orders & Activity Feed */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div className="lg:col-span-2">
                            <ProviderRecentOrders />
                        </div>
                        <div>
                            <CustomerActivityFeed />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProviderDashboard;