import { MdDeliveryDining } from "react-icons/md";

function DeliveryPerformance({deliveryStats}) {
    return(
        <>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Performance</h3>
                        <div className="space-y-4">
                            {deliveryStats.map((stat, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full ${stat.color}`}></div>
                                        <span className="font-medium text-gray-700">{stat.status}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${stat.color}`}
                                                style={{ width: `${stat.percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-600 w-12">{stat.count}</span>
                                        <span className="text-sm text-gray-500 w-8">{stat.percentage}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <MdDeliveryDining className="text-green-600" />
                                <span className="text-sm font-medium text-green-800">Average delivery time: 28 minutes</span>
                            </div>
                        </div>
                    </div></>
    )
}
export default DeliveryPerformance;