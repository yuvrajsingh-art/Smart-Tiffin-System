import React, { useState } from 'react';
import ProviderSidebar from '../../components/ui/Provider/ProviderSidebar';
import ProviderHeader from '../../components/ui/Provider/ProviderHeader';
import ActiveCustomerList from '../../components/ui/Provider/Active Customer/ActiveCustomerList';
import AddCustomerForm from '../../components/ui/Provider/Active Customer/AddCustomerForm';
 import FilterCustomer from '../../components/ui/Provider/Active Customer/FilterCustomer';

const ActiveCustomers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddCustomer = (customerData) => {
    console.log('New customer:', customerData);
    // Add customer logic here
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ProviderSidebar />
      <div className="flex-1 flex flex-col">
        <ProviderHeader 
          title="Active Customers" 
          subtitle="Manage your active customer subscriptions and orders" 
        />
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Search and Filter */}
          <FilterCustomer searchTerm={searchTerm} 
          filterStatus={filterStatus}
          setSearchTerm={setSearchTerm}
          setFilterStatus={setFilterStatus}
          setShowAddForm={setShowAddForm}/>

          {/* Customer List */}
          <ActiveCustomerList 
          searchTerm={searchTerm} 
          filterStatus={filterStatus}
           />
        </div>
      </div>

      {/* Add Customer Form Modal */}
      <AddCustomerForm 
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddCustomer}
      />
    </div>
  );
};

export default ActiveCustomers;

                
