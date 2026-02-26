import { useState, useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import ProviderSidebar from "../../components/ui/Provider/ProviderSidebar";
import ProviderHeader from '../../components/ui/Provider/ProviderHeader';
import { FaCheck, FaTruck, FaUtensils, FaClock } from 'react-icons/fa';
import StatusCard from '../../components/ui/Provider/DelieveryStatus.jsx/StatusCard';
import FilterTabs from '../../components/ui/Provider/DelieveryStatus.jsx/FilterTabs';
import ProviderDeliveryCards from '../../components/ui/Provider/DelieveryStatus.jsx/ProviderDeliveryCards';
import ProviderApi from '../../services/ProviderApi';

function DeliveryStatus() {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { socket } = useSocket();
 
    useEffect(() => {
        fetchDeliveries();
        
        // Auto-refresh every 30 seconds to update statuses based on time
        const interval = setInterval(() => {
            fetchDeliveries();
        }, 30000);
        
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('orderStatusUpdate', (data) => {
                console.log('Socket: Order status updated', data);
                fetchDeliveries();
            });
            return () => socket.off('orderStatusUpdate');
        }
    }, [socket]);

    const calculateDeliveryStatus = (mealType, deliveryTime) => {
        const now = new Date();
        const [hours, minutes] = deliveryTime.split(':').map(Number);
        
        const deliveryDateTime = new Date();
        deliveryDateTime.setHours(hours, minutes, 0, 0);
        
        const readyForPickupTime = new Date(deliveryDateTime.getTime() - 70 * 60000); // 1hr 10min before
        const outForDeliveryTime = new Date(deliveryDateTime.getTime() - 30 * 60000); // 30min before
        const deliveredTime = new Date(deliveryDateTime.getTime() - 15 * 60000); // 15min before
        
        if (now >= deliveredTime) return 'delivered';
        if (now >= outForDeliveryTime) return 'out_for_delivery';
        if (now >= readyForPickupTime) return 'ready_for_pickup';
        return 'preparing';
    };

    const fetchDeliveries = async () => {
        try {
            const response = await ProviderApi.get('/provider-orders/today');
            console.log('Orders Response:', response.data);
            
            if (response.data && response.data.data) {
                const data = response.data.data;
                console.log('Just In:', data.justIn);
                console.log('Preparing:', data.preparing);
                console.log('Ready:', data.ready);
                console.log('Dispatched:', data.dispatched);
                console.log('Delivered:', data.delivered);
                
                const allOrders = [
                    ...(data.justIn || []),
                    ...(data.preparing || []),
                    ...(data.ready || []),
                    ...(data.dispatched || []),
                    ...(data.delivered || [])
                ];
                
                console.log('All Orders:', allOrders);
                
                const formattedDeliveries = allOrders.map(order => {
                    const mealType = (order.mealType || 'lunch').toLowerCase();
                    const deliveryTime = order.deliveryTime || (mealType === 'lunch' ? '11:00' : '19:00');
                    
                    // Check if order should be shown based on current time
                    const now = new Date();
                    const currentHour = now.getHours();
                    
                    // Only show lunch orders between 9 AM - 12 PM
                    // Only show dinner orders between 5 PM - 8 PM
                    let shouldShow = true;
                    if (mealType === 'lunch' && (currentHour < 9 || currentHour >= 12)) {
                        shouldShow = false;
                    } else if (mealType === 'dinner' && (currentHour < 17 || currentHour >= 20)) {
                        shouldShow = false;
                    }
                    
                    // Use database status directly
                    let orderStatus = (order.status || 'confirmed').toLowerCase();
                    
                    // Skip cancelled orders
                    if (orderStatus === 'cancelled') {
                        return null;
                    }
                    
                    // Don't show orders outside their time window unless delivered
                    if (!shouldShow && orderStatus !== 'delivered') {
                        return null;
                    }
                    
                    // Map backend status to frontend display status
                    const statusMap = {
                        'confirmed': 'preparing',
                        'cooking': 'preparing',
                        'prepared': 'ready_for_pickup',
                        'out_for_delivery': 'out_for_delivery',
                        'delivered': 'delivered'
                    };
                    
                    orderStatus = statusMap[orderStatus] || 'preparing';
                    
                    // Extract customer details
                    const customer = order.customer || {};
                    const phone = customer.mobile || customer.phone || 'N/A';
                    
                    // Extract address
                    let address = 'N/A';
                    if (order.deliveryAddress) {
                        const addr = order.deliveryAddress;
                        if (typeof addr === 'string') {
                            address = addr;
                        } else {
                            address = [addr.street, addr.city, addr.pincode]
                                .filter(Boolean)
                                .join(', ') || 'N/A';
                        }
                    }
                    
                    return {
                        id: order._id,
                        orderId: order.orderNumber || `ORD-${order._id.slice(-6)}`,
                        customer: customer.fullName || customer.name || 'N/A',
                        phone: phone,
                        address: address,
                        items: order.menuItems?.map(i => i.name) || [mealType],
                        status: orderStatus,
                        mealType,
                        deliveryTime,
                        orderTime: new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                        estimatedDelivery: deliveryTime,
                        rider: order.deliveryPartner?.name || null,
                        riderPhone: order.deliveryPartner?.phone || null,
                        amount: order.amount || 0,
                        orderType: order.orderType
                    };
                }).filter(Boolean);
                
                setDeliveries(formattedDeliveries);
            }
        } catch (error) {
            console.error('Error fetching deliveries:', error);
            setDeliveries([]);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, action) => {
        try {
            let status = '';
            let note = '';
            switch (action) {
                case 'mark_ready': 
                    status = 'prepared';
                    note = 'Order marked as ready for pickup';
                    break;
                case 'mark_dispatched': 
                    status = 'out_for_delivery';
                    note = 'Order dispatched for delivery';
                    break;
                case 'mark_delivered': 
                    status = 'delivered';
                    note = 'Order delivered successfully';
                    break;
                default: return;
            }

            await ProviderApi.put(`/provider-track/${orderId}/status`, { status, note });
            fetchDeliveries(); // Refresh list
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

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
        <div className="flex h-screen bg-[#FFFBF5]">
            <ProviderSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-1 flex flex-col">
                <ProviderHeader
                    title="Delivery Status"
                    subtitle="Track and manage all your delivery orders"
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <div className="flex-1 p-6 overflow-y-auto">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                        </div>
                    ) : (
                        <>
                            <StatusCard statusCounts={statusCounts} />
                            <FilterTabs
                                filter={filter}
                                deliveries={deliveries}
                                setFilter={setFilter}
                                statusCounts={statusCounts}
                            />
                            <ProviderDeliveryCards
                                getStatusIcon={getStatusIcon}
                                getStatusText={getStatusText}
                                filteredDeliveries={filteredDeliveries}
                                getStatusColor={getStatusColor}
                                onUpdateStatus={updateOrderStatus}
                            />
                            {filteredDeliveries.length === 0 && (
                                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                                    <div className="text-6xl mb-4">🚚</div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Deliveries Found</h3>
                                    <p className="text-gray-600">No orders match the selected filter</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DeliveryStatus;