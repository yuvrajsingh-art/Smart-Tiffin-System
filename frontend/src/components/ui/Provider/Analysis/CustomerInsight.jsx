function CustomerInsight() {
    const customerInsights = [
        { type: 'New Customers', count: 23, percentage: 34, color: 'text-green-600' },
        { type: 'Returning Customers', count: 44, percentage: 66, color: 'text-blue-600' }
    ];
    return(
        
        <>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Insights</h3>
                        <div className="space-y-4">
                            {customerInsights.map((insight, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-800">{insight.type}</p>
                                        <p className={`text-2xl font-bold ${insight.color}`}>{insight.count}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center">
                                            <span className={`text-sm font-bold ${insight.color}`}>{insight.percentage}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
        </>
    )
}
export default CustomerInsight;