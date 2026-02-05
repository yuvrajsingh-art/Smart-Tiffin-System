import { FaMapMarkedAlt } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";

function ProviderDeliveryCards({filteredDeliveries ,getStatusColor ,getStatusIcon ,getStatusText}) {
    return(
        <>
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
                                                <FaMapMarkedAlt className="text-xs mt-1" />
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

        </>
    )
}
export default ProviderDeliveryCards;