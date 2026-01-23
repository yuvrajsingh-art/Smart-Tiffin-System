import React from 'react';

function FeaturesSection() {
    return (
        <section className="max-w-6xl mx-auto w-full px-6" id="features">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                <div className="max-w-xl">
                    <h2 className="text-3xl md:text-4xl font-black text-[#2D241E] tracking-tight mb-4">Smart Features</h2>
                    <p className="text-lg text-[#5C4D42] font-medium">Everything you need to run a high-performance digital mess business.</p>
                </div>
                <div className="h-1 w-24 bg-primary rounded-full mb-2"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-panel p-6 rounded-3xl hover:-translate-y-2 transition-all duration-500 group">
                    <div className="w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20 group-hover:bg-primary">
                        <span className="material-symbols-outlined text-2xl">subscriptions</span>
                    </div>
                    <h3 className="text-lg font-black text-[#2D241E] mb-2">Online Subscriptions</h3>
                    <p className="text-[#5C4D42] text-xs leading-relaxed">Flexible meal plans with integrated secure payment gateways.</p>
                </div>
                <div className="glass-panel p-6 rounded-3xl hover:-translate-y-2 transition-all duration-500 group">
                    <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-amber-500/20">
                        <span className="material-symbols-outlined text-2xl">restaurant_menu</span>
                    </div>
                    <h3 className="text-lg font-black text-[#2D241E] mb-2">Interactive Menu</h3>
                    <p className="text-[#5C4D42] text-xs leading-relaxed">Dynamic menu updates with student feedback and rating systems.</p>
                </div>
                <div className="glass-panel p-6 rounded-3xl hover:-translate-y-2 transition-all duration-500 group">
                    <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
                    </div>
                    <h3 className="text-lg font-black text-[#2D241E] mb-2">Instant Auth</h3>
                    <p className="text-[#5C4D42] text-xs leading-relaxed">Lightning-fast QR scan for meal verification at the counter.</p>
                </div>
                <div className="glass-panel p-6 rounded-3xl hover:-translate-y-2 transition-all duration-500 group">
                    <div className="w-12 h-12 bg-orange-600 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-orange-600/20">
                        <span className="material-symbols-outlined text-2xl">analytics</span>
                    </div>
                    <h3 className="text-lg font-black text-[#2D241E] mb-2">Rich Analytics</h3>
                    <p className="text-[#5C4D42] text-xs leading-relaxed">Deep insights into consumption patterns and revenue growth.</p>
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection;
