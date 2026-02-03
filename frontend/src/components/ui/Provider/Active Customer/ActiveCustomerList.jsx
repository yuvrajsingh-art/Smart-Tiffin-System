import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaCalendarAlt, FaShoppingBag } from 'react-icons/fa';

const ActiveCustomerList = ({ searchTerm = '', filterStatus = 'all' }) => {
  const [customers] = useState([
    {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul.sharma@email.com',
      phone: '+91 9876543210',
      plan: 'Premium',
      status: 'active',
      joinDate: '2024-01-15',
      lastOrder: '2024-01-25',
      totalOrders: 45,
      avatar: 'RS',
      address: 'Sector 15, Noida'
    },
    {
      id: 2,
      name: 'Priya Singh',
      email: 'priya.singh@email.com',
      phone: '+91 9876543211',
      plan: 'Basic',
      status: 'active',
      joinDate: '2024-01-20',
      lastOrder: '2024-01-25',
      totalOrders: 32,
      avatar: 'PS',
      address: 'Sector 22, Gurgaon'
    },
    {
      id: 3,
      name: 'Amit Kumar',
      email: 'amit.kumar@email.com',
      phone: '+91 9876543212',
      plan: 'Premium',
      status: 'paused',
      joinDate: '2024-01-10',
      lastOrder: '2024-01-23',
      totalOrders: 67,
      avatar: 'AK',
      address: 'Connaught Place, Delhi'
    },
    {
      id: 4,
      name: 'Sneha Patel',
      email: 'sneha.patel@email.com',
      phone: '+91 9876543213',
      plan: 'Basic',
      status: 'active',
      joinDate: '2024-01-22',
      lastOrder: '2024-01-25',
      totalOrders: 18,
      avatar: 'SP',
      address: 'Bandra West, Mumbai'
    },
    {
      id: 5,
      name: 'Vikash Gupta',
      email: 'vikash.gupta@email.com',
      phone: '+91 9876543214',
      plan: 'Premium',
      status: 'expired',
      joinDate: '2023-12-05',
      lastOrder: '2024-01-15',
      totalOrders: 89,
      avatar: 'VG',
      address: 'Koramangala, Bangalore'
    },
    {
      id: 6,
      name: 'Anita Sharma',
      email: 'anita.sharma@email.com',
      phone: '+91 9876543215',
      plan: 'Basic',
      status: 'active',
      joinDate: '2024-01-18',
      lastOrder: '2024-01-25',
      totalOrders: 28,
      avatar: 'AS',
      address: 'Satellite, Ahmedabad'
    }
  ]);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan) => {
    return plan === 'Premium' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{customers.filter(c => c.status === 'active').length}</p>
            <p className="text-sm text-gray-600">Active</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{customers.filter(c => c.status === 'paused').length}</p>
            <p className="text-sm text-gray-600">Paused</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{customers.filter(c => c.status === 'expired').length}</p>
            <p className="text-sm text-gray-600">Expired</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{customers.length}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
        </div>
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            {/* Customer Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {customer.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{customer.name}</h3>
                    <p className="text-sm text-gray-500">{customer.address}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPlanColor(customer.plan)}`}>
                    {customer.plan}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-gray-400 text-sm" />
                  <span className="text-sm text-gray-600">{customer.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-gray-400 text-sm" />
                  <span className="text-sm text-gray-600">{customer.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-gray-400 text-sm" />
                  <span className="text-sm text-gray-600">Joined: {formatDate(customer.joinDate)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaShoppingBag className="text-gray-400 text-sm" />
                  <span className="text-sm text-gray-600">Last Order: {formatDate(customer.lastOrder)}</span>
                </div>
              </div>

              {/* Order Stats */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Orders:</span>
                  <span className="text-lg font-bold text-orange-600">{customer.totalOrders}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-orange-500 text-white py-2 px-3 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium">
                  View Profile
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                  Contact
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCustomers.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Customers Found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default ActiveCustomerList;