import { FaCheck, FaClock, FaUtensils } from "react-icons/fa6"
import { MdDeliveryDining } from "react-icons/md"

const StatusCard = ({ statusCounts }) => {

    return(
        <>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Preparing</p>
                                <p className="text-2xl font-bold text-yellow-600">{statusCounts.preparing}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <FaUtensils className="text-yellow-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Ready for Pickup</p>
                                <p className="text-2xl font-bold text-blue-600">{statusCounts.ready_for_pickup}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <FaClock className="text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Out for Delivery</p>
                                <p className="text-2xl font-bold text-orange-600">{statusCounts.out_for_delivery}</p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-full">
                                <MdDeliveryDining className="text-orange-600 text-xl" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Delivered</p>
                                <p className="text-2xl font-bold text-green-600">{statusCounts.delivered}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <FaCheck className="text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>
        </>
    )
}
export default StatusCard