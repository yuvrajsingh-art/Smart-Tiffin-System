import React from 'react';
import { Link } from 'react-router-dom';

function PricingSection() {
    return (
        <section className="py-16" id="pricing">
            <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-black text-secondary">Simple, Transparent Pricing</h2>
                <p className="text-secondary/60 mt-2">Choose the plan that fits your role.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Student Plan */}
                <div className="glass-panel p-8 rounded-2xl flex flex-col gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-secondary">Student</h3>
                        <p className="text-sm text-secondary/60 mt-1">For hungry learners</p>
                    </div>
                    <div className="text-4xl font-black text-secondary">Free</div>
                    <ul className="flex flex-col gap-3 text-sm text-secondary/80">
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-500 text-sm">check</span> Browse Menus</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-500 text-sm">check</span> Track Expenses</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-500 text-sm">check</span> Rate Meals</li>
                    </ul>
                    <Link to="/role-selection" className="mt-4 w-full py-3 rounded-full border border-secondary/20 font-bold hover:bg-secondary hover:text-white transition-colors flex items-center justify-center">Join Free</Link>
                </div>
                {/* Mess Partner Plan (Premium) */}
                <div className="glass-panel-dark p-8 rounded-2xl flex flex-col gap-6 transform md:scale-110 shadow-2xl relative z-10">
                    <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">POPULAR</div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Mess Partner</h3>
                        <p className="text-sm text-gray-400 mt-1">For growing kitchens</p>
                    </div>
                    <div className="text-4xl font-black text-white">₹499<span className="text-lg font-normal text-gray-500">/mo</span></div>
                    <ul className="flex flex-col gap-3 text-sm text-gray-300">
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check</span> Unlimited Users</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check</span> QR Code Scanner</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check</span> Payment Gateway</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check</span> Weekly Analytics</li>
                    </ul>
                    <Link to="/role-selection" className="mt-4 w-full py-3 rounded-full bg-primary text-white font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 flex items-center justify-center">Get Started</Link>
                </div>
                {/* Enterprise Plan */}
                <div className="glass-panel p-8 rounded-2xl flex flex-col gap-6">
                    <div>
                        <h3 className="text-xl font-bold text-secondary">Enterprise</h3>
                        <p className="text-sm text-secondary/60 mt-1">For multi-chain services</p>
                    </div>
                    <div className="text-4xl font-black text-secondary">Custom</div>
                    <ul className="flex flex-col gap-3 text-sm text-secondary/80">
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-500 text-sm">check</span> Multiple Locations</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-500 text-sm">check</span> Custom Branding</li>
                        <li className="flex items-center gap-2"><span className="material-symbols-outlined text-green-500 text-sm">check</span> Dedicated Support</li>
                    </ul>
                    <Link to="/role-selection" className="mt-4 w-full py-3 rounded-full border border-secondary/20 font-bold hover:bg-secondary hover:text-white transition-colors flex items-center justify-center">Contact Sales</Link>
                </div>
            </div>
        </section>
    )
}

export default PricingSection;
