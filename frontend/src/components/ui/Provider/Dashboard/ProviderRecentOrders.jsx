import { useState, useEffect } from "react";
import { FaEye, FaPhone, FaUtensils } from "react-icons/fa6";
import { IoTime } from "react-icons/io5";
import ProviderApi from "../../../../services/ProviderApi";
import CancelOrderModal from "./CancelOrderModal";
import { toast } from 'react-hot-toast';

function ProviderRecentOrders() {
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    useEffect(() => {
        fetchRecentOrders();
        
        // Auto-refresh every 30 seconds for real-time updates
        const interval = setInterval(() => {
            fetchRecentOrders();
        }, 30000);
        
        return () => clearInterval(interval);
    }, []);

    const calculateDeliveryStatus = (mealType, deliveryTime) => {
        const now = new Date();
        const [hours, minutes] = deliveryTime.split(':').map(Number);
        
        const deliveryDateTime = new Date();
        deliveryDateTime.setHours(hours, minutes, 0, 0);
        
        const readyForPickupTime = new Date(deliveryDateTime.getTime() - 70 * 60000);
        const outForDeliveryTime = new Date(deliveryDateTime.getTime() - 30 * 60000);
        const deliveredTime = new Date(deliveryDateTime.getTime() - 15 * 60000);
        
        if (now >= deliveredTime) return 'Delivered';
        if (now >= outForDeliveryTime) return 'Out for Delivery';
        if (now >= readyForPickupTime) return 'Ready for Pickup';
        return 'Preparing';
    };

    const fetchRecentOrders = async () => {
        try {
            const response = await ProviderApi.get('/provider-orders/today');
            if (response.data && response.data.data) {
                const { lunch, dinner } = response.data.data;
                const allOrders = [...lunch, ...dinner].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                const formattedOrders = allOrders.slice(0, 6).map(order => {
                    const mealType = order.mealType || 'lunch';
                    const deliveryTime = order.deliveryTime || (mealType === 'lunch' ? '11:00' : '19:00');
                    
                    // Use actual database status
                    let displayStatus = 'Preparing';
                    const dbStatus = (order.status || 'confirmed').toLowerCase();
                    
                    if (dbStatus === 'cancelled') {
                        displayStatus = 'Cancelled';
                    } else if (dbStatus === 'delivered') {
                        displayStatus = 'Delivered';
                    } else if (dbStatus === 'out_for_delivery') {
                        displayStatus = 'Out for Delivery';
                    } else if (dbStatus === 'prepared') {
                        displayStatus = 'Ready for Pickup';
                    } else if (dbStatus === 'cooking') {
                        displayStatus = 'Cooking';
                    } else if (dbStatus === 'confirmed') {
                        displayStatus = 'Confirmed';
                    }
                    
                    return {
                        id: order._id,
                        customer: order.customer?.fullName || 'N/A',
                        phone: order.customer?.mobile || 'N/A',
                        item: `${order.mealType} - ${order.quantity || 1} Tiffin(s)`,
                        quantity: order.quantity || 1,
                        time: new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                        status: displayStatus,
                        amount: order.amount || 0,
                        orderDate: 'Today',
                        mealType,
                        deliveryTime,
                        orderType: order.orderType || 'subscription',
                        actualStatus: order.status,
                        cancelledBy: order.cancelledBy
                    };
                });
                setRecentOrders(formattedOrders);
            }
        } catch (error) {
            console.error('Error fetching recent orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = (order) => {
        setSelectedOrder(order);
        setIsCancelModalOpen(true);
    };

    const handleOrderCancelled = () => {
        fetchRecentOrders();
        setIsCancelModalOpen(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Cooking':
            case 'Preparing': return 'bg-yellow-100 text-yellow-800';
            case 'Out for Delivery': return 'bg-blue-100 text-blue-800';
            case 'Ready for Pickup': return 'bg-orange-100 text-orange-800';
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

    return (
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
                                            <FaUtensils className="text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{order.customer}</p>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FaPhone className="text-xs" />
                                                <span>{order.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-2">
                                            {order.orderType === 'guest' && (
                                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                                                    👤 Guest
                                                </span>
                                            )}
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                                            <button
                                                onClick={() => handleCancelOrder(order)}
                                                className="text-xs text-red-500 hover:text-red-700 underline"
                                            >
                                                Cancel
                                            </button>
                                        )}
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
                                        {order.quantity > 0 && (
                                            <p className="text-xs text-gray-500">₹{Math.round(order.amount / order.quantity)} each</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            {selectedOrder && (
                <CancelOrderModal
                    isOpen={isCancelModalOpen}
                    onClose={() => setIsCancelModalOpen(false)}
                    orderId={selectedOrder.id}
                    customerName={selectedOrder.customer}
                    onCancelled={handleOrderCancelled}
                />
            )
            }
        </>
    )
}
export default ProviderRecentOrders;