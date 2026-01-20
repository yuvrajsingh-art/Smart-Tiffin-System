import React from 'react';

function FeaturesSection() {
    return (
        <section className="max-w-7xl mx-auto w-full" id="features">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div className="max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#111716] tracking-tight mb-4">Smart Features</h2>
                    <p className="text-lg text-[#6A717B]">Everything you need to run a modern digital mess.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-panel p-6 rounded-2xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-4">
                        <span className="material-symbols-outlined">subscriptions</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#111716] mb-2">Online Subscription</h3>
                    <p className="text-sm text-gray-500">Seamlessly purchase weekly or monthly meal plans securely online.</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 mb-4">
                        <span className="material-symbols-outlined">restaurant_menu</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#111716] mb-2">Daily Menu</h3>
                    <p className="text-sm text-gray-500">View what's cooking today and tomorrow directly from your dashboard.</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 mb-4">
                        <span className="material-symbols-outlined">location_on</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#111716] mb-2">Order Tracking</h3>
                    <p className="text-sm text-gray-500">Know exactly when your tiffin is dispatched and delivered.</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-4">
                        <span className="material-symbols-outlined">dashboard</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#111716] mb-2">Vendor Dashboard</h3>
                    <p className="text-sm text-gray-500">Comprehensive analytics and user management for mess owners.</p>
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection
