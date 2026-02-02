import React from 'react';

function ProviderOrdersTable() {
    const orders = [
        { id: '#001', customer: 'John Doe', items: 'Veg Thali, Dal Rice', amount: '₹150', status: 'Delivered', time: '12:30 PM' },
        { id: '#002', customer: 'Jane Smith', items: 'Chicken Curry, Roti', amount: '₹200', status: 'Preparing', time: '1:15 PM' },
        { id: '#003', customer: 'Mike Johnson', items: 'Paneer Masala', amount: '₹180', status: 'Out for Delivery', time: '1:45 PM' },
        { id: '#004', customer: 'Sarah Wilson', items: 'Fish Curry, Rice', amount: '₹220', status: 'Confirmed', time: '2:00 PM' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Preparing': return 'bg-yellow-100 text-yellow-800';
            case 'Out for Delivery': return 'bg-blue-100 text-blue-800';
            case 'Confirmed': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-gradient-to-r from-[#fffbf0] to-[#fff9eb] rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            </div>

            <div className="overflow-x-auto ">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUSTOMER NAME</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MEAL TYPE</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DELIVERY SLOT</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{order.items}</td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.time}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProviderOrdersTable;