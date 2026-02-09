import { FaRupeeSign, FaArrowUp, FaCalendarDay, FaCalendarWeek } from 'react-icons/fa';

function RevenueStats({ revenueData, timeRange }) {
    const stats = [
        {
            label: 'Today Revenue',
            value: `₹${revenueData.todayRevenue.toLocaleString()}`,
            icon: <FaCalendarDay />,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            label: timeRange === 'week' ? 'Week Revenue' : 'Month Revenue',
            value: `₹${(timeRange === 'week' ? revenueData.weekRevenue : revenueData.monthRevenue).toLocaleString()}`,
            icon: <FaCalendarWeek />,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            label: 'Total Revenue',
            value: `₹${revenueData.totalRevenue.toLocaleString()}`,
            icon: <FaRupeeSign />,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        },
        {
            label: 'Growth',
            value: `+${revenueData.growth}%`,
            icon: <FaArrowUp />,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                            <span className={`text-xl ${stat.color}`}>{stat.icon}</span>
                        </div>
                    </div>
                    <p className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
            ))}
        </div>
    );
}

export default RevenueStats;
