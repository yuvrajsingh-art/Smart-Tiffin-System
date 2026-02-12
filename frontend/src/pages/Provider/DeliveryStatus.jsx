import { useState, useEffect } from 'react';
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
 
    useEffect(() => {
        fetchDeliveries();
        
        // Auto-refresh every minute to update statuses
        const interval = setInterval(() => {
            fetchDeliveries();
        }, 60000);
        
        return () => clearInterval(interval);
    }, []);

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
            const response = await ProviderApi.get('/provider-kds/kds-1');
            console.log('KDS Response:', response.data);
            if (response.data && response.data.data) {
                const allOrders = [
<<<<<<< HEAD
                    ...response.data.data.justIn.map(o => ({ ...o, status: 'preparing' })),
                    ...response.data.data.preparing.map(o => ({ ...o, status: 'preparing' })),
                    ...response.data.data.ready.map(o => ({ ...o, status: 'ready_for_pickup' })),
                    ...response.data.data.dispatched.map(o => ({ ...o, status: 'out_for_delivery' })),
                    ...(!filter || filter === 'all' || filter === 'delivered' ? [] : []) // Don't show delivered in main flow unless filtered, but for now show all
                ];

                const formattedDeliveries = allOrders.map(order => ({
                    id: order._id,
                    orderId: order.orderNo,
                    customer: order.customerName || 'N/A',
                    phone: 'N/A',
                    address: 'N/A',
                    items: order.items?.map(i => i.name) || [],
                    status: order.status,
                    orderTime: new Date(order.orderTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                    estimatedDelivery: 'N/A',
                    rider: null,
                    amount: order.amount || 0
                }));
                // Also fetch delivered orders if needed, for now just keeping active flow
=======
                    ...response.data.data.justIn,
                    ...response.data.data.preparing,
                    ...response.data.data.ready,
                    ...response.data.data.dispatched
                ];
                
                const formattedDeliveries = allOrders.map(order => {
                    const mealType = order.mealType || 'lunch';
                    const deliveryTime = order.deliveryTime || (mealType === 'lunch' ? '11:00' : '19:00');
                    const calculatedStatus = calculateDeliveryStatus(mealType, deliveryTime);
                    
                    // Extract customer details
                    const customer = order.customer || {};
                    const phone = customer.phone || customer.phoneNumber || order.customerPhone || 'N/A';
                    
                    // Extract address
                    let address = 'N/A';
                    if (customer.address) {
                        if (typeof customer.address === 'string') {
                            address = customer.address;
                        } else if (typeof customer.address === 'object') {
                            const addr = customer.address;
                            address = [addr.street, addr.area, addr.city, addr.pincode]
                                .filter(Boolean)
                                .join(', ') || 'N/A';
                        }
                    } else if (order.deliveryAddress) {
                        address = order.deliveryAddress;
                    }
                    
                    return {
                        id: order._id,
                        orderId: order.orderNo,
                        customer: order.customerName || customer.fullName || customer.name || 'N/A',
                        phone: phone,
                        address: address,
                        items: order.items?.map(i => i.name) || [],
                        status: calculatedStatus,
                        mealType,
                        deliveryTime,
                        orderTime: new Date(order.orderTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
                        estimatedDelivery: deliveryTime,
                        rider: order.rider?.name || null,
                        riderPhone: order.rider?.phone || null,
                        amount: order.amount || 0
                    };
                });
>>>>>>> e0e90d30dc25ca4f82a351b90bcb99d93b91d4cd
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
            let endpoint = '';
            switch (action) {
                case 'mark_ready': endpoint = `/provider-kds/order/${orderId}/ready`; break;
                case 'mark_dispatched': endpoint = `/provider-kds/order/${orderId}/dispatched`; break;
                case 'mark_delivered': endpoint = `/provider-kds/order/${orderId}/delivered`; break;
                default: return;
            }

            await ProviderApi.put(endpoint);
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