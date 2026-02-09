function RevenueChart({ revenueData, timeRange }) {
    const chartData = timeRange === 'week' 
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        : ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue Trend</h3>
            <div className="h-64 flex items-end justify-between gap-2">
                {chartData.map((label, index) => {
                    const height = Math.random() * 80 + 20;
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-orange-500 rounded-t-lg transition-all hover:bg-orange-600" 
                                 style={{ height: `${height}%` }}>
                            </div>
                            <span className="text-xs text-gray-600">{label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default RevenueChart;
