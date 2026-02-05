function FilterTabs({filter, deliveries, setFilter, statusCounts}) {
    return (
        <>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        All Orders ({deliveries.length})
                    </button>
                    <button
                        onClick={() => setFilter('preparing')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'preparing'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Preparing ({statusCounts.preparing})
                    </button>
                    <button
                        onClick={() => setFilter('ready_for_pickup')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'ready_for_pickup'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Ready ({statusCounts.ready_for_pickup})
                    </button>
                    <button
                        onClick={() => setFilter('out_for_delivery')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'out_for_delivery'
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Out for Delivery ({statusCounts.out_for_delivery})
                    </button>
                    <button
                        onClick={() => setFilter('delivered')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'delivered'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Delivered ({statusCounts.delivered})
                    </button>
                </div>
            </div>
        </>
    )
}
export default FilterTabs;