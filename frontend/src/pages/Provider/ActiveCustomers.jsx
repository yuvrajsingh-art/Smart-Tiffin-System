import React from 'react';
import ActiveCustomerList from '../../components/ui/Provider/Active Customer/ActiveCustomerList';
import ProviderSidebar from '../../components/ui/Provider/ProviderSidebar';
import ProviderHeader from '../../components/ui/Provider/Dashboard/ProviderHeader';

const ActiveCustomers = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <ProviderSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ProviderHeader />
        <div className="flex-1 overflow-y-auto">
          <ActiveCustomerList />
        </div>
      </div>
    </div>
  );
};

export default ActiveCustomers;