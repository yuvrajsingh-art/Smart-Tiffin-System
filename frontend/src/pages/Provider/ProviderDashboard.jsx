import React from 'react';
import ProviderSidebar from '../../components/provider/ProviderSidebar';

const ProviderDashboard = () => {
    return (
        <div className="flex h-screen bg-gray-50 bg-gradient-to-r from-[#fffbf0] to-[#fff9eb] ">
            <ProviderSidebar />
            <div className="flex-1 flex items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-400 uppercase tracking-widest">Provider Dashboard</h1>
            </div>
        </div>
    );
};

export default ProviderDashboard;