import React, { useState } from 'react';
import ProviderSidebar from "../../components/ui/Provider/ProviderSidebar";
import { FaMapMarkerAlt, FaClock, FaPhone, FaCheck, FaTruck, FaUtensils } from 'react-icons/fa';
import { MdDeliveryDining } from 'react-icons/md';
import Header from '../../layouts/Header';
import PageHeader from '../../components/common/PageHeader';
import ProviderHeader from '../../components/ui/Provider/ProviderHeader';
import StatusCard from '../../components/ui/Provider/DelieveryStatus.jsx/StatusCard';


function DeliveryStatus() {
    const [deliveries] = useState([
        {
            id: 1,
            orderId: 'ORD001',
            customer: 'Rahul Sharma',
            phone: '+91 9876543210',
            address: 'Sector 15, Noida, UP',
            items: ['Lunch Special', 'Extra Roti'],
            status: 'preparing',
            orderTime: '12:30 PM',
            estimatedDelivery: '1:15 PM',
            rider: null,
            amount: 85
        },
        {
            id: 2,
            orderId: 'ORD002',
            customer: 'Priya Singh',
            phone: '+91 9876543211',
            address: 'Sector 22, Gurgaon, HR',
            items: ['Dinner Special'],
            status: 'out_for_delivery',
            orderTime: '7:45 PM',
            estimatedDelivery: '8:30 PM',
            rider: 'Suresh Kumar',
            riderPhone: '+91 9876543220',
            amount: 70
        },
        {
            id: 3,
            orderId: 'ORD003',
            customer: 'Amit Kumar',
            phone: '+91 9876543212',
            address: 'Connaught Place, Delhi',
            items: ['Lunch Special', 'Curd'],
            status: 'delivered',
            orderTime: '1:15 PM',
            estimatedDelivery: '2:00 PM',
            deliveredTime: '1:55 PM',
            rider: 'Rajesh Yadav',
            riderPhone: '+91 9876543221',
            amount: 90
        },
        {
            id: 4,
            orderId: 'ORD004',
            customer: 'Sneha Patel',
            phone: '+91 9876543213',
            address: 'Bandra West, Mumbai, MH',
            items: ['Dinner Special', 'Extra Dal'],
            status: 'ready_for_pickup',
            orderTime: '8:00 PM',
            estimatedDelivery: '8:45 PM',
            rider: null,
            amount: 80
        }
    ]);

    const [filter, setFilter] = useState('all');

    const filteredDeliveries = deliveries.filter(delivery => {
        if (filter === 'all') return true;
        return delivery.status === filter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'preparing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'ready_for_pickup': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'out_for_delivery': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'preparing': return <FaUtensils />;
            case 'ready_for_pickup': return <FaClock />;
            case 'out_for_delivery': return <FaTruck />;
            case 'delivered': return <FaCheck />;
            default: return <FaClock />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'preparing': return 'Preparing';
            case 'ready_for_pickup': return 'Ready for Pickup';
            case 'out_for_delivery': return 'Out for Delivery';
            case 'delivered': return 'Delivered';
            default: return 'Unknown';
        }
    };

    const getStatusCounts = () => {
        return {
            preparing: deliveries.filter(d => d.status === 'preparing').length,
            ready_for_pickup: deliveries.filter(d => d.status === 'ready_for_pickup').length,
            out_for_delivery: deliveries.filter(d => d.status === 'out_for_delivery').length,
            delivered: deliveries.filter(d => d.status === 'delivered').length
        };
    };

    const statusCounts = getStatusCounts();

    return (
        <div className="flex h-screen bg-gray-50">
            <ProviderSidebar />
            <div className="flex-1 p-6 overflow-y-auto">
                {/* Header */}
                 <ProviderHeader
                    title="Welcome Back Chef!"
                    subtitle="  Here's what's happening with your tiffin service today."
                />

                {/* Status Summary Cards */}
                 {/* Filter Tabs */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'all'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            All Orders ({deliveries.length})
                        </button>
                        <button
                            onClick={() => setFilter('preparing')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'preparing'
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Preparing ({statusCounts.preparing})
                        </button>
                        <button
                            onClick={() => setFilter('ready_for_pickup')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'ready_for_pickup'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Ready ({statusCounts.ready_for_pickup})
                        </button>
                        <button
                            onClick={() => setFilter('out_for_delivery')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'out_for_delivery'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Out for Delivery ({statusCounts.out_for_delivery})
                        </button>
                        <button
                            onClick={() => setFilter('delivered')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                filter === 'delivered'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Delivered ({statusCounts.delivered})
                        </button>
                    </div>
                </div>

                {/* Delivery Cards */}
                <div className="space-y-4">
                    {filteredDeliveries.map((delivery) => (
                        <div key={delivery.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                {/* Order Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(delivery.status)}`}>
                                            {getStatusIcon(delivery.status)}
                                            <span className="font-medium text-sm">{getStatusText(delivery.status)}</span>
                                        </div>
                                        <span className="text-sm text-gray-500">#{delivery.orderId}</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-800 mb-1">{delivery.customer}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                                <FaPhone className="text-xs" />
                                                <span>{delivery.phone}</span>
                                            </div>
                                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                                <FaMapMarkerAlt className="text-xs mt-1" />
                                                <span>{delivery.address}</span>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">Items:</p>
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {delivery.items.map((item, index) => (
                                                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="font-semibold text-orange-600">₹{delivery.amount}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Time & Rider Info */}
                                <div className="lg:w-64 space-y-3">
                                    <div className="text-sm">
                                        <p className="text-gray-600">Order Time: <span className="font-medium">{delivery.orderTime}</span></p>
                                        <p className="text-gray-600">Est. Delivery: <span className="font-medium">{delivery.estimatedDelivery}</span></p>
                                        {delivery.deliveredTime && (
                                            <p className="text-green-600">Delivered: <span className="font-medium">{delivery.deliveredTime}</span></p>
                                        )}
                                    </div>
                                    
                                    {delivery.rider && (
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm font-medium text-gray-800">Rider: {delivery.rider}</p>
                                            {delivery.riderPhone && (
                                                <p className="text-xs text-gray-600">{delivery.riderPhone}</p>
                                            )}
                                        </div>
                                    )}
                                    
                                    {!delivery.rider && delivery.status === 'ready_for_pickup' && (
                                        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                                            Assign Rider
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredDeliveries.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                        <div className="text-6xl mb-4">🚚</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Deliveries Found</h3>
                        <p className="text-gray-600">No orders match the selected filter</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DeliveryStatus;