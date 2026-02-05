function StateCards() {
    const stats = [
        { label: 'Total Orders', value: '1,234', color: 'text-blue-600' },
        { label: 'Active Customers', value: '156', color: 'text-green-600' },
        { label: 'Monthly Revenue', value: '₹45,600', color: 'text-orange-600' },
        { label: 'Years in Business', value: '4+', color: 'text-purple-600' }
    ];
    return(
        <>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-center">
                                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
        </>

    )
}
export default StateCards