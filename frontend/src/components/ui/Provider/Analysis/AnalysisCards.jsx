import { FaCalendarAlt } from "react-icons/fa";
import { FaRupeeSign, FaUsers, FaUtensils } from "react-icons/fa6";
import { MdTrendingUp } from "react-icons/md";

function AnalysisCards({analyticsData ,timeRange}) {
    const currentData = analyticsData[timeRange];

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">₹{currentData.revenue.toLocaleString()}</p>
                            <div className="flex items-center mt-2">
                                <MdTrendingUp className="text-green-500 mr-1" />
                                <span className="text-green-500 text-sm font-medium">+{currentData.growth.revenue}%</span>
                            </div>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <FaRupeeSign className="text-green-600 text-xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{currentData.orders}</p>
                            <div className="flex items-center mt-2">
                                <MdTrendingUp className="text-green-500 mr-1" />
                                <span className="text-green-500 text-sm font-medium">+{currentData.growth.orders}%</span>
                            </div>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-full">
                            <FaUtensils className="text-orange-600 text-xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Active Customers</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">{currentData.customers}</p>
                            <div className="flex items-center mt-2">
                                <MdTrendingUp className="text-green-500 mr-1" />
                                <span className="text-green-500 text-sm font-medium">+{currentData.growth.customers}%</span>
                            </div>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <FaUsers className="text-blue-600 text-xl" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Avg Order Value</p>
                            <p className="text-2xl font-bold text-gray-800 mt-1">₹{currentData.avgOrderValue}</p>
                            <div className="flex items-center mt-2">
                                <MdTrendingUp className="text-green-500 mr-1" />
                                <span className="text-green-500 text-sm font-medium">+5.2%</span>
                            </div>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <FaCalendarAlt className="text-purple-600 text-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AnalysisCards;