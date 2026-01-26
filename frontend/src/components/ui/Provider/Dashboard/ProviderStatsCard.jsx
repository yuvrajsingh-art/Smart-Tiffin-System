import React from 'react';

function ProviderStatsCard({ title, value, icon, trend, trendValue, color = "blue" }) {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        red: "bg-red-50 text-red-600",
        yellow: "bg-yellow-50 text-yellow-600"
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    {trend && (
                        <p className={`text-sm mt-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {trend === 'up' ? '↗' : '↘'} {trendValue}
                        </p>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

export default ProviderStatsCard;