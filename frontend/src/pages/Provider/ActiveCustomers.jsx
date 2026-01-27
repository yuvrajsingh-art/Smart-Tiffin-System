import ProviderSidebar from "../../components/ui/Provider/ProviderSidebar";
import ProviderHeader from "../../components/ui/Provider/Dashboard/ProviderHeader";
import ProviderStatsCard from "../../components/ui/Provider/Dashboard/ProviderStatsCard";
import ProviderOrdersTable from "../../components/ui/Provider/Dashboard/ProviderOrdersTable";
import { FaUtensils, FaUsers, FaTruck, FaRupeeSign } from 'react-icons/fa';

function ActiveCustomer() {
    return (
        <div className="flex h-screen bg-gray-50">
            <ProviderSidebar />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <ProviderHeader />
               
            </div>
        </div>
    );
}
export default ActiveCustomer