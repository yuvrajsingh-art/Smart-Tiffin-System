import ProviderSidebar from '../../components/provider/ProviderSidebar';
import ProviderHeader from '../../components/provider/Dashboard/ProviderHeader';
import ProviderStatsCard from '../../components/provider/Dashboard/ProviderStatsCard';
import ProviderOrdersTable from '../../components/provider/Dashboard/ProviderOrdersTable';
import { FaUtensils, FaUsers, FaTruck, FaRupeeSign } from 'react-icons/fa';

function ProviderDashboard() {
    return (
        <div className="flex h-screen bg-gray-50">
            <ProviderSidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <ProviderHeader />

                <main className="flex-1 overflow-y-auto p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <ProviderStatsCard
                            title="Total Orders"
                            value="156"
                            icon={<FaUtensils className="text-xl" />}
                            trend="up"
                            trendValue="+12% from last week"
                            color="blue"
                        />
                        <ProviderStatsCard
                            title="Active Customers"
                            value="89"
                            icon={<FaUsers className="text-xl" />}
                            trend="up"
                            trendValue="+5% from last week"
                            color="green"
                        />
                        <ProviderStatsCard
                            title="Deliveries Today"
                            value="23"
                            icon={<FaTruck className="text-xl" />}
                            trend="down"
                            trendValue="-3% from yesterday"
                            color="yellow"
                        />
                        <ProviderStatsCard
                            title="Revenue Today"
                            value="₹4,250"
                            icon={<FaRupeeSign className="text-xl" />}
                            trend="up"
                            trendValue="+8% from yesterday"
                            color="red"
                        />
                    </div>

                    {/* Orders Table */}
                    <ProviderOrdersTable />
                </main>
            </div>
        </div>
    );
}
export default ProviderDashboard