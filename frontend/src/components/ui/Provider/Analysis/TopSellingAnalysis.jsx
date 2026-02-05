import { MdRestaurant } from "react-icons/md";

function TopSellingAnalysis({topItems}) {
    return (
        <>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Items</h3>
                <div className="space-y-4">
                    {topItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-orange-100 p-2 rounded-full">
                                    <MdRestaurant className="text-orange-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-600">{item.orders} orders</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-gray-800">₹{item.revenue}</p>
                                <p className="text-sm text-gray-600">{item.percentage}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
export default TopSellingAnalysis;