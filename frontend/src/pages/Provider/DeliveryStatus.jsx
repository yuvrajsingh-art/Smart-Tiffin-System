import { useState } from 'react';
import ProviderSidebar from "../../components/ui/Provider/ProviderSidebar";
import { FaMapMarkerAlt, FaClock, FaPhone, FaCheck, FaTruck, FaUtensils } from 'react-icons/fa';
import ProviderHeader from '../../components/ui/Provider/ProviderHeader';
import StatusCard from '../../components/ui/Provider/DelieveryStatus.jsx/StatusCard';
import FilterTabs from '../../components/ui/Provider/DelieveryStatus.jsx/FilterTabs';
import ProviderDeliveryCards from '../../components/ui/Provider/DelieveryStatus.jsx/ProviderDeliveryCards';


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
                <StatusCard statusCounts={statusCounts} />


                {/* Filter Tabs */}
                <FilterTabs
                    filter={filter}
                    deliveries={deliveries}
                    setFilter={setFilter}
                    statusCounts={statusCounts}
                />

                {/* Delivery Cards */}
                <ProviderDeliveryCards 
                getStatusIcon={getStatusIcon} 
                getStatusText={getStatusText}
                filteredDeliveries={filteredDeliveries}
                 getStatusColor={getStatusColor}
                />
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