import React from 'react';

function FeaturesSection() {
    return (
        <section className="max-w-7xl mx-auto w-full px-6 py-10" id="features">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div className="max-w-xl">
                    <h2 className="text-3xl lg:text-4xl font-black text-secondary mb-4">Why Choose Smart Tiffin?</h2>
                    <p className="text-secondary/60 text-lg">Modern features built for the traditional service you love.</p>
                </div>
                <button className="text-primary font-bold hover:text-primary-dark flex items-center gap-1 group text-lg">
                    See all features <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Feature 1 */}
                <div className="glass-panel p-8 rounded-xl hover:shadow-lg transition-all group border-none">
                    <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform text-primary">
                        <span className="material-symbols-outlined text-[28px]">calendar_month</span>
                    </div>
                    <h3 className="text-lg font-bold text-secondary mb-2">Online Subscriptions</h3>
                    <p className="text-sm text-secondary/60 leading-relaxed">Manage your meal plans easily. Pause or resume with a single tap.</p>
                </div>
                {/* Feature 2 */}
                <div className="glass-panel p-8 rounded-xl hover:shadow-lg transition-all group border-none">
                    <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform text-primary">
                        <span className="material-symbols-outlined text-[28px]">restaurant_menu</span>
                    </div>
                    <h3 className="text-lg font-bold text-secondary mb-2">Interactive Menu</h3>
                    <p className="text-sm text-secondary/60 leading-relaxed">Vote for tomorrow's menu items. Your taste buds, your choice.</p>
                </div>
                {/* Feature 3 */}
                <div className="glass-panel p-8 rounded-xl hover:shadow-lg transition-all group border-none">
                    <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform text-primary">
                        <span className="material-symbols-outlined text-[28px]">qr_code_scanner</span>
                    </div>
                    <h3 className="text-lg font-bold text-secondary mb-2">Instant QR Auth</h3>
                    <p className="text-sm text-secondary/60 leading-relaxed">Quick and secure meal redemption. Scan and eat in seconds.</p>
                </div>
                {/* Feature 4 */}
                <div className="glass-panel p-8 rounded-xl hover:shadow-lg transition-all group border-none">
                    <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform text-primary">
                        <span className="material-symbols-outlined text-[28px]">monitoring</span>
                    </div>
                    <h3 className="text-lg font-bold text-secondary mb-2">Rich Analytics</h3>
                    <p className="text-sm text-secondary/60 leading-relaxed">Track your monthly spending and nutritional intake effortlessly.</p>
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection;
