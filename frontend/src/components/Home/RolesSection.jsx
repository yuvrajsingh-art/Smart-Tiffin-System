import React from 'react';

function RolesSection() {
    return (
        <section className="max-w-7xl mx-auto w-full" id="roles">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#111716] tracking-tight mb-4">Built for Everyone</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <span className="material-symbols-outlined text-8xl">school</span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#111716] mb-2">Student</h3>
                    <p className="text-gray-500 mb-6 text-sm">The hungry learner</p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm text-[#111716]">
                            <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                            <span>View daily menus & nutritional info</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-[#111716]">
                            <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                            <span>Easy QR code authentication</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-[#111716]">
                            <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                            <span>Cancel meals to save credits</span>
                        </li>
                    </ul>
                </div>
                <div className="glass-panel p-8 rounded-3xl relative overflow-hidden ring-1 ring-primary/40 bg-white/40">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <span className="material-symbols-outlined text-8xl">store</span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#111716] mb-2">Mess Owner</h3>
                    <p className="text-gray-500 mb-6 text-sm">The provider</p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm text-[#111716]">
                            <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                            <span>Manage daily menu offerings</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-[#111716]">
                            <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                            <span>Track active subscribers</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-[#111716]">
                            <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                            <span>View daily requirement stats</span>
                        </li>
                    </ul>
                </div>
                <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <span className="material-symbols-outlined text-8xl">admin_panel_settings</span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#111716] mb-2">Admin</h3>
                    <p className="text-gray-500 mb-6 text-sm">The overseer</p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm text-[#111716]">
                            <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                            <span>Manage all users and roles</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-[#111716]">
                            <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                            <span>System-wide analytics</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-[#111716]">
                            <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                            <span>Resolve disputes & support</span>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default RolesSection
