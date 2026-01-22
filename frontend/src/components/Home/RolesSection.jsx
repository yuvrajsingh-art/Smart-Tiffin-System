import React from 'react';

function RolesSection() {
    return (
        <section className="max-w-7xl mx-auto w-full px-6" id="roles">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-[#2D241E] tracking-tight mb-6">Designed For Every User</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="glass-panel p-10 rounded-[3rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-500">
                        <span className="material-symbols-outlined text-[120px] text-primary">school</span>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-3xl font-black text-[#2D241E] mb-2">Student</h3>
                        <p className="text-primary font-bold mb-8 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-primary"></span> The Hungry Learner
                        </p>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4 text-base text-[#2D241E]">
                                <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                                <span className="font-semibold">Manage wallet & meal credits</span>
                            </li>
                            <li className="flex items-start gap-4 text-base text-[#2D241E]">
                                <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                                <span className="font-semibold">One-tap meal cancellation</span>
                            </li>
                            <li className="flex items-start gap-4 text-base text-[#2D241E]">
                                <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                                <span className="font-semibold">Live menu & nutrition labels</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="glass-panel p-10 rounded-[3rem] relative overflow-hidden border-primary/40 shadow-xl group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-500">
                        <span className="material-symbols-outlined text-[120px] text-primary">storefront</span>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-3xl font-black text-[#2D241E] mb-2">Mess Owner</h3>
                        <p className="text-primary font-bold mb-8 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-primary"></span> The Food Provider
                        </p>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4 text-base text-[#2D241E]">
                                <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                                <span className="font-semibold">Automated daily count report</span>
                            </li>
                            <li className="flex items-start gap-4 text-base text-[#2D241E]">
                                <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                                <span className="font-semibold">Inventory & cost management</span>
                            </li>
                            <li className="flex items-start gap-4 text-base text-[#2D241E]">
                                <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                                <span className="font-semibold">Subscription renewal alerts</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="glass-panel p-10 rounded-[3rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-500">
                        <span className="material-symbols-outlined text-[120px] text-primary">admin_panel_settings</span>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-3xl font-black text-[#2D241E] mb-2">Admin</h3>
                        <p className="text-primary font-bold mb-8 flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-primary"></span> The Orchestrator
                        </p>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4 text-base text-[#2D241E]">
                                <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                                <span className="font-semibold">Comprehensive system logs</span>
                            </li>
                            <li className="flex items-start gap-4 text-base text-[#2D241E]">
                                <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                                <span className="font-semibold">User role & access control</span>
                            </li>
                            <li className="flex items-start gap-4 text-base text-[#2D241E]">
                                <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                                <span className="font-semibold">System-wide performance metrics</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RolesSection;
