import React, { useState } from 'react';
import ProviderSidebar from '../../components/ui/Provider/ProviderSidebar';
import ProviderHeader from '../../components/ui/Provider/ProviderHeader';
import ActiveCustomerList from '../../components/ui/Provider/Active Customer/ActiveCustomerList';
import AddCustomerForm from '../../components/ui/Provider/Active Customer/AddCustomerForm';
import { FaSearch, FaFilter, FaPlus } from 'react-icons/fa';

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
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers by name, phone, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <FaFilter className="text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="all">All Customers</option>
                    <option value="active">Active Subscriptions</option>
                    <option value="paused">Paused Subscriptions</option>
                    <option value="expired">Expired Subscriptions</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 font-medium"
                >
                  <FaPlus />
                  Add Customer
                </button>
              </div>
            </div>
          </div>

          {/* Customer List */}
          <ActiveCustomerList searchTerm={searchTerm} filterStatus={filterStatus} />
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