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
    }, []);

    const fetchDeliveries = async () => {
        try {
            const response = await ProviderApi.get('/provider-kds/kds-1');
            console.log('KDS Response:', response.data);
            if (response.data && response.data.data) {
                const allOrders = [
                    ...response.data.data.justIn.map(o => ({ ...o, status: 'preparing' })),
                    ...response.data.data.preparing.map(o => ({ ...o, status: 'preparing' })),
                    ...response.data.data.ready.map(o => ({ ...o, status: 'ready_for_pickup' })),
                    ...response.data.data.dispatched.map(o => ({ ...o, status: 'out_for_delivery' }))
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
                setDeliveries(formattedDeliveries);
            }
        } catch (error) {
            console.error('Error fetching deliveries:', error);
            setDeliveries([]);
        } finally {
            setLoading(false);
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