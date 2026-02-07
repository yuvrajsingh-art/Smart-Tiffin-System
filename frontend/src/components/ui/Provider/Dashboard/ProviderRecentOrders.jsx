import { useState, useEffect } from "react";
import { FaEye, FaPhone, FaUtensils } from "react-icons/fa6";
import { IoTime } from "react-icons/io5";
import ProviderApi from "../../../../services/ProviderApi";

function ProviderRecentOrders() {
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentOrders();
    }, []);

    const fetchRecentOrders = async () => {
        try {
            const response = await ProviderApi.get('/provider-kds/kds-1');
            if (response.data && response.data.data) {
                const allOrders = [
                    ...response.data.data.justIn,
                    ...response.data.data.preparing,
                    ...response.data.data.ready,
                    ...response.data.data.dispatched
                ];
                const formattedOrders = allOrders.slice(0, 6).map(order => ({
                    id: order._id,
                    customer: order.customerName || 'N/A',
                    phone: 'N/A',
                    item: order.items?.map(i => i.name).join(', ') || 'N/A',
                    quantity: order.quantity || 1,
                    time: new Date(order.orderTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                    status: order.status === 'confirmed' ? 'Confirmed' : order.status === 'cooking' ? 'Preparing' : order.status === 'prepared' ? 'Ready' : 'Out for Delivery',
                    amount: order.amount || 0,
                    orderDate: 'Today'
                }));
                setRecentOrders(formattedOrders);
            }
        } catch (error) {
            console.error('Error fetching recent orders:', error);
            // Fallback to dummy data
            setRecentOrders([
                { id: 1, customer: 'Rahul Sharma', phone: '+91 9876543210', item: 'Lunch Special', quantity: 2, time: '12:30 PM', status: 'Delivered', amount: 160, orderDate: 'Today' },
                { id: 2, customer: 'Priya Singh', phone: '+91 9876543211', item: 'Dinner Special', quantity: 1, time: '7:45 PM', status: 'Preparing', amount: 70, orderDate: 'Today' },
                { id: 3, customer: 'Amit Kumar', phone: '+91 9876543212', item: 'Lunch Special', quantity: 1, time: '1:15 PM', status: 'Out for Delivery', amount: 80, orderDate: 'Today' },
                { id: 4, customer: 'Sneha Patel', phone: '+91 9876543213', item: 'Dinner Special', quantity: 3, time: '8:00 PM', status: 'Delivered', amount: 210, orderDate: 'Yesterday' },
                { id: 5, customer: 'Vikash Yadav', phone: '+91 9876543214', item: 'Breakfast Special', quantity: 1, time: '8:30 AM', status: 'Confirmed', amount: 50, orderDate: 'Today' },
                { id: 6, customer: 'Anita Sharma', phone: '+91 9876543215', item: 'Lunch Special', quantity: 2, time: '12:45 PM', status: 'Cancelled', amount: 160, orderDate: 'Today' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Preparing': return 'bg-yellow-100 text-yellow-800';
            case 'Out for Delivery': return 'bg-blue-100 text-blue-800';
            case 'Confirmed': return 'bg-purple-100 text-purple-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    return(
        <>
        
                    {/* Recent Orders */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">Recent Orders</h2>
                            <button className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1">
                                <FaEye />
                                View All
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-orange-100 p-2 rounded-full">
                                                    <FaUtensils   className="text-orange-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{order.customer}</p>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <FaPhone className="text-xs" />
                                                        <span>{order.phone}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                                <p className="text-xs text-gray-500 mt-1">{order.orderDate}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{order.item}</p>
                                                    <p className="text-xs text-gray-600">Qty: {order.quantity}</p>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <IoTime className="text-xs" />
                                                    <span>{order.time}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg text-gray-800">₹{order.amount}</p>
                                                <p className="text-xs text-gray-500">₹{order.amount/order.quantity} each</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
        </>
    )
}
export default ProviderRecentOrders;