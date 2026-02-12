function RevenueChart({ revenueData, timeRange }) {
    const chartData = revenueData.chartData || [];
    const maxAmount = Math.max(...chartData.map(d => d.amount), 1);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue Trend</h3>
            <div className="h-64 flex items-end justify-between gap-2">
                {chartData.map((data, index) => {
                    const height = (data.amount / maxAmount) * 80 + 10;
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="relative w-full">
                                <div 
                                    className="w-full bg-orange-500 rounded-t-lg transition-all hover:bg-orange-600 cursor-pointer" 
                                    style={{ height: `${height}%`, minHeight: '20px' }}
                                    title={`₹${data.amount}`}
                                >
                                </div>
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    ₹{data.amount}
                                </div>
                            </div>
                            <span className="text-xs text-gray-600 font-medium">{data.label}</span>
                        </div>
                    );
                })}
            </div>
            {chartData.length === 0 && (
                <div className="h-64 flex items-center justify-center text-gray-400">
                    <p>No data available</p>
                </div>
            )}
        </div>
    );
}

export default RevenueChart;
