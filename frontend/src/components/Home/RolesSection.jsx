import React from 'react';

function RolesSection() {
    return (
        <section className="max-w-7xl mx-auto w-full px-4 md:px-8" id="roles">
            <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 tracking-tight mb-3">Built for Everyone</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <span className="material-symbols-outlined text-8xl">school</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#111716] mb-1">Student</h3>
                    <p className="text-gray-500 mb-6 text-sm">The hungry learner</p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm text-[#111716]/80">
                            <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                            <span>View daily menus & nutritional info</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-[#111716]/80">
                            <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                            <span>Easy QR code authentication</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-[#111716]/80">
                            <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                            <span>Cancel meals to save credits</span>
                        </li>
                    </ul>
                </div>
                <div className="glass-panel p-6 rounded-3xl relative overflow-hidden ring-1 ring-primary/20 bg-white/60">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <span className="material-symbols-outlined text-8xl">store</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#111716] mb-1">Mess Owner</h3>
                    <p className="text-gray-500 mb-6 text-sm">The provider</p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm text-[#111716]/80">
                            <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                            <span>Manage daily menu offerings</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-[#111716]/80">
                            <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                            <span>Track active subscribers</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-[#111716]/80">
                            <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                            <span>View daily requirement stats</span>
                        </li>
                    </ul>
                </div>
                <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <span className="material-symbols-outlined text-8xl">admin_panel_settings</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#111716] mb-1">Admin</h3>
                    <p className="text-gray-500 mb-6 text-sm">The overseer</p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm text-[#111716]/80">
                            <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                            <span>Manage all users and roles</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-[#111716]/80">
                            <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">check_circle</span>
                            <span>System-wide analytics</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-[#111716]/80">
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
