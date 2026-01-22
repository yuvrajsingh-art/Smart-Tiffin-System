import React from 'react';

function PricingSection() {
    return (
        <section className="max-w-7xl mx-auto w-full px-4 md:px-8" id="pricing">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-[#2D241E] tracking-tight mb-6">Simple, Transparent Pricing</h2>
                <p className="text-base text-gray-500 max-w-2xl mx-auto">No hidden fees. Choose the plan that fits your role.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Student Plan */}
                <div className="glass-panel p-8 rounded-3xl flex flex-col hover:-translate-y-2 transition-transform duration-300">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Student</h3>
                    <div className="text-4xl font-bold text-gray-900 mb-6">Free<span className="text-base text-gray-400 font-normal">/forever</span></div>
                    <p className="text-sm text-gray-500 mb-8">Perfect for students managing their daily meals comfortably.</p>
                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                            Unlimited Mess Browsing
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                            Real-time Menu Updates
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                            Easy QR Check-ins
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                            Meal Cancellation (Save Money)
                        </li>
                    </ul>
                    <button className="w-full py-3 rounded-xl border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 transition-colors">
                        Get Started
                    </button>
                </div>

                {/* Mess Owner Plan */}
                <div className="relative p-8 rounded-3xl flex flex-col bg-[#111716] text-white shadow-xl scale-105 z-10">
                    <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">POPULAR</div>
                    <h3 className="text-lg font-bold text-white mb-2">Mess Partner</h3>
                    <div className="text-4xl font-bold text-white mb-6">₹499<span className="text-base text-gray-400 font-normal">/month</span></div>
                    <p className="text-sm text-gray-400 mb-8">All-in-one digital toolkit to grow your tiffin business.</p>
                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                            <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                            Manager Dashboard
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                            <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                            Automated Billing & Reports
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                            <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                            Subscriber Management
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-300">
                            <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                            Priority Support
                        </li>
                    </ul>
                    <button className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-primary/20">
                        Join as Partner
                    </button>
                </div>

                {/* Enterprise Plan */}
                <div className="glass-panel p-8 rounded-3xl flex flex-col hover:-translate-y-2 transition-transform duration-300">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Enterprise</h3>
                    <div className="text-4xl font-bold text-gray-900 mb-6">Custom</div>
                    <p className="text-sm text-gray-500 mb-8">For large institutions, hostels, and universities.</p>
                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                            Everything in Mess Partner
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                            Multiple Branch Management
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                            API Access
                        </li>
                        <li className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="material-symbols-outlined text-primary text-[20px]">check</span>
                            Dedicated Account Manager
                        </li>
                    </ul>
                    <button className="w-full py-3 rounded-xl border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 transition-colors">
                        Contact Sales
                    </button>
                </div>
            </div>
        </section>
    );
}

export default PricingSection;
