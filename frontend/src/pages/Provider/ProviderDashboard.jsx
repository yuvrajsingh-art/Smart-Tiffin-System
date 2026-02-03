import { useState } from 'react';
import ProviderSidebar from '../../components/ui/Provider/ProviderSidebar';
import ProviderHeader from '../../components/ui/Provider/ProviderHeader';
import { FaUtensils, FaEye, FaPhone } from 'react-icons/fa';
import { IoTime } from 'react-icons/io5';
import ProviderStatsCards from '../../components/ui/Provider/Dashboard/ProviderStateCards';
import ProviderRecentOrders from '../../components/ui/Provider/Dashboard/ProviderRecentOrders';

const ProviderDashboard = () => {

    return (
        <div className="flex h-screen bg-gray-50">
            <ProviderSidebar />
            <div className="flex-1 flex flex-col">
                <ProviderHeader
                    title="Welcome Back Chef!"
                    subtitle=" Here's what's happening with your tiffin service today."
                />
                <div className="flex-1 p-6 overflow-y-auto">

                    {/* Stats Cards */}
                    <ProviderStatsCards />
                    <div>
                        <ProviderRecentOrders />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProviderDashboard;