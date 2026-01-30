import React, { useState } from 'react';

const ActiveCustomerList = () => {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul.sharma@email.com',
      phone: '+91 9876543210',
      plan: 'Premium',
      status: 'Active',
      joinDate: '2024-01-15',
      lastOrder: '2024-01-25',
      totalOrders: 45,
      avatar: 'RS'
    },
    {
      id: 2,
      name: 'Priya Singh',
      email: 'priya.singh@email.com',
      phone: '+91 9876543211',
      plan: 'Basic',
      status: 'Active',
      joinDate: '2024-01-20',
      lastOrder: '2024-01-25',
      totalOrders: 32,
      avatar: 'PS'
    },
    {
      id: 3,
      name: 'Amit Kumar',
      email: 'amit.kumar@email.com',
      phone: '+91 9876543212',
      plan: 'Premium',
      status: 'Paused',
      joinDate: '2024-01-10',
      lastOrder: '2024-01-23',
      totalOrders: 67,
      avatar: 'AK'
    },
    {
      id: 4,
      name: 'Sneha Patel',
      email: 'sneha.patel@email.com',
      phone: '+91 9876543213',
      plan: 'Basic',
      status: 'Active',
      joinDate: '2024-01-22',
      lastOrder: '2024-01-25',
      totalOrders: 18,
      avatar: 'SP'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Paused': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan) => {
    return plan === 'Premium' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Active Customers</h1>
              <p className="text-gray-600 mt-1">Manage your customer subscriptions</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Active</p>
              <p className="text-2xl font-bold text-green-600">{customers.filter(c => c.status === 'Active').length}</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Customer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
              {/* Customer Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {customer.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{customer.name}</h3>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                    {customer.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(customer.plan)}`}>
                    {customer.plan}
                  </span>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Phone:</span>
                  <span className="text-sm font-medium">{customer.phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Join Date:</span>
                  <span className="text-sm font-medium">{customer.joinDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Order:</span>
                  <span className="text-sm font-medium">{customer.lastOrder}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Orders:</span>
                  <span className="text-sm font-bold text-orange-600">{customer.totalOrders}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button className="flex-1 bg-orange-500 text-white py-2 px-3 rounded-md hover:bg-orange-600 transition-colors text-sm">
                  View Details
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-md hover:bg-gray-200 transition-colors text-sm">
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCustomers.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Customers Found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveCustomerList;