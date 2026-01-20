import React from 'react';

function StatsSection() {
    const stats = [
        { label: "Active Students", value: "2,000+", icon: "groups" },
        { label: "Mess Partners", value: "50+", icon: "store" },
        { label: "Meals Served", value: "150k+", icon: "restaurant" },
        { label: "Cities", value: "5+", icon: "location_city" },
    ];

    return (
        <section className="max-w-7xl mx-auto w-full px-4 md:px-8 py-12">
            <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-gray-200/50">
                {stats.map((stat, index) => (
                    <div key={index} className="flex flex-col items-center text-center gap-2 group">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600">{stat.value}</h3>
                        <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default StatsSection;
