import React from 'react';
import ProviderSidebar from '../../components/provider/ProviderSidebar';

const OrderManagement = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            <ProviderSidebar />
            <div className="flex-1 flex items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-400 uppercase tracking-widest">Order Management</h1>
            </div>
        </div>
    );
};

export default OrderManagement;
