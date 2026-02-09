import ProviderStatsCards from '../../components/ui/Provider/Dashboard/ProviderStateCards';
import ProviderRecentOrders from '../../components/ui/Provider/Dashboard/ProviderRecentOrders';
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
                    {/* Stats Cards */}
                    <ProviderStatsCards />
                    
                    {/* Recent Orders */}
                    <ProviderRecentOrders />
                </div>
            </div>
        </div>
    );
}

export default ProviderDashboard;