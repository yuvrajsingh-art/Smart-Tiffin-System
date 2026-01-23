import React from 'react';

function StatsSection() {
    const stats = [
        { label: "Active Students", value: "2,000+", icon: "groups" },
        { label: "Mess Partners", value: "50+", icon: "store" },
        { label: "Meals Served", value: "150k+", icon: "restaurant" },
        { label: "Cities", value: "5+", icon: "location_city" },
    ];

    return (
        <section className="max-w-6xl mx-auto w-full px-4 md:px-6 py-8">
            <div className="glass-panel p-6 md:p-8 rounded-[2rem] grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-x-0 md:divide-x divide-gray-200/50">
                {stats.map((stat, index) => (
                    <div key={index} className="flex flex-col items-center text-center gap-1.5 group">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-1 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600">{stat.value}</h3>
                        <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default StatsSection;
