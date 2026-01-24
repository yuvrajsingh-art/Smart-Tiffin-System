import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon, label, to, active }) => (
    <Link
        to={to}
        className={`
            flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
            ${active
                ? 'bg-orange-100/60 text-primary font-bold shadow-sm ring-1 ring-primary/10'
                : 'text-[#5C4D42] font-semibold hover:bg-white/60 hover:text-primary hover:shadow-sm'
            }
        `}
    >
        <span className={`material-symbols-outlined ${active ? '' : 'text-[#5C4D42] group-hover:text-primary transition-colors'}`}>{icon}</span>
        <span>{label}</span>
    </Link>
);

const DashboardLayout = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Updated Nav Items list
    const navItems = [
        { icon: 'dashboard', label: 'Dashboard', to: '/customer/dashboard' },
        { icon: 'search', label: 'Find Mess', to: '/customer/find-mess' }, // New Discovery Link
        { icon: 'restaurant_menu', label: "Today's Menu", to: '/customer/menu' },
        { icon: 'local_shipping', label: 'Track Order', to: '/customer/track' },
        { icon: 'pause_circle', label: 'Pause Subscription', to: '/customer/pause' },
        { icon: 'history', label: 'History', to: '/customer/history' }, // Added History
        { icon: 'thumb_up', label: 'Feedback', to: '/customer/feedback' },
    ];

    return (
        <div className="font-display bg-[#FFFBF5] text-[#2D241E] h-screen overflow-hidden selection:bg-primary/20 selection:text-primary flex relative">

            {/* Background Blobs (Premium Warm Theme) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="blob w-[600px] h-[600px] bg-orange-200/30 -top-20 -right-20"></div>
                <div className="blob w-[500px] h-[500px] bg-amber-100/40 bottom-0 left-0"></div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Sidebar (Slide-in) */}
            <div className={`fixed top-0 left-0 bottom-0 w-72 bg-white/90 backdrop-blur-2xl border-r border-orange-100 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logic same as desktop but simpler structure for mobile if needed, or re-use styling */}
                <div className="h-24 flex items-center gap-3 px-8 border-b border-orange-100/50">
                    <div className="size-10 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-[24px]">lunch_dining</span>
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-[#2D241E]">Smart Tiffin</span>
                </div>
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <div key={item.to} onClick={() => setIsMobileMenuOpen(false)}>
                            <SidebarItem {...item} active={location.pathname === item.to} />
                        </div>
                    ))}
                </nav>
            </div>


            {/* Desktop Sidebar (Glass) */}
            <aside className="hidden lg:flex w-72 h-full glass-sidebar flex-col flex-shrink-0 z-50 relative transition-all duration-300">
                <div className="h-24 flex items-center gap-3 px-8 flex-shrink-0">
                    <div className="size-10 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-[24px]">lunch_dining</span>
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-[#2D241E]">Smart Tiffin</span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <SidebarItem key={item.to} {...item} active={location.pathname === item.to} />
                    ))}
                    <div className="my-4 h-px bg-orange-100 w-full"></div>
                </nav>

                <div className="p-4 border-t border-orange-100/50 space-y-2 bg-white/30">
                    <Link to="/customer/profile" className="flex items-center gap-4 px-4 py-3 rounded-2xl text-[#5C4D42] font-semibold hover:bg-white/80 hover:text-primary transition-all group">
                        <span className="material-symbols-outlined">person</span>
                        Profile
                    </Link>
                    <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-red-500 font-semibold hover:bg-red-50 hover:text-red-600 transition-all">
                        <span className="material-symbols-outlined">logout</span>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full relative z-10 overflow-hidden">
                {/* Glass Header */}
                <header className="h-24 glass-header px-8 flex items-center justify-between flex-shrink-0 z-40">
                    <div className="flex items-center gap-4 lg:hidden">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="size-10 rounded-full bg-white/60 flex items-center justify-center text-[#5C4D42]">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>

                    <div className="hidden md:block">
                        <h1 className="text-2xl font-black text-[#2D241E] tracking-tight">Welcome back, Rohan!</h1>
                        <p className="text-sm font-medium text-[#5C4D42] flex items-center gap-2 mt-1">
                            <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
                            <span>{new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="size-12 rounded-full bg-white/60 hover:bg-white hover:shadow-md transition-all flex items-center justify-center text-[#5C4D42] relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-3 right-3 size-2 bg-primary rounded-full ring-2 ring-white"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-orange-200/50">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-[#2D241E]">Rohan Das</p>
                                <p className="text-xs text-primary font-bold uppercase tracking-wider">Premium Plan</p>
                            </div>
                            <img alt="Profile" className="size-12 rounded-full border-2 border-white shadow-sm object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
