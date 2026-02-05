function DailyPerformanceAnalysis({timeRange ,currentData}) {
    return (
        <><div>
            {timeRange === 'week' && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Performance</h3>
                    <div className="space-y-3">
                        {currentData.dailyStats.map((day, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="font-medium text-gray-700 w-12">{day.day}</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                                        <div
                                            className="bg-orange-500 h-2 rounded-full"
                                            style={{ width: `${(day.orders / 20) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-800">{day.orders} orders</p>
                                    <p className="text-sm text-gray-600">₹{day.revenue}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
        </>
    )
}
export default DailyPerformanceAnalysis;