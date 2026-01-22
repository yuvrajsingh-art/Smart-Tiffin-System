import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

/**
 * Helper component for Sidebar Links
 * Renders an icon and label with active state styling.
 */
const SidebarItem = ({ icon, label, to, active }) => (
    <Link
        to={to}
        className={`
            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
            ${active
                ? 'bg-primary/10 text-primary font-bold'
                : 'text-gray-500 hover:bg-white/50 hover:text-gray-900 border border-transparent hover:border-white/50'
            }
        `}
    >
        <span className={`material-symbols-outlined text-[20px] ${active ? 'fill-1' : ''}`}>{icon}</span>
        <span className="text-sm">{label}</span>
    </Link>
);

/**
 * DashboardLayout Component
 * Serves as the shell for all dashboard pages.
 * Includes:
 * 1. Fixed Background (Blobs)
 * 2. Left Sidebar (Navigation)
 * 3. Top Header (User Profile & Mobile Menu)
 * 4. Main Content Area (<Outlet />) where pages are rendered
 */
const DashboardLayout = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { icon: 'dashboard', label: 'Overview', to: '/customer/dashboard' },
        { icon: 'restaurant_menu', label: 'Weekly Menu', to: '/customer/menu' },
        { icon: 'history', label: 'Order History', to: '/customer/track' },
        { icon: 'account_balance_wallet', label: 'Billing/Wallet', to: '/customer/wallet' },
        { icon: 'pause_circle', label: 'Pause Plan', to: '/customer/pause' },
        { icon: 'rate_review', label: 'Feedback', to: '/customer/feedback' },
        { icon: 'person', label: 'Profile', to: '/customer/profile' },
    ];

    return (
        <div className="font-display min-h-screen relative overflow-hidden bg-[#F8FAFC]">
            {/* Background Blobs (Fixed) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="blob w-[500px] h-[500px] bg-orange-200/20 -top-[10%] -left-[10%] mix-blend-multiply opacity-50 blur-[100px]"></div>
                <div className="blob w-[500px] h-[500px] bg-rose-200/20 top-1/4 right-0 mix-blend-multiply opacity-50 blur-[90px]"></div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Sidebar */}
            <div className={`fixed top-0 left-0 bottom-0 w-64 bg-white/80 backdrop-blur-xl border-r border-white/50 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-primary to-orange-400 rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-lg">lunch_dining</span>
                        </div>
                        <span className="font-bold text-gray-900 text-lg tracking-tight">Smart<span className="text-primary">Tiffin</span></span>
                    </div>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <nav className="px-4 space-y-1">
                    {navItems.map((item) => (
                        <div key={item.to} onClick={() => setIsMobileMenuOpen(false)}> {/* Close menu on navigate */}
                            <SidebarItem
                                {...item}
                                active={location.pathname === item.to}
                            />
                        </div>
                    ))}
                </nav>

                <div className="absolute bottom-6 left-0 right-0 px-6">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-white/50">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">Rahul Sharma</p>
                            <Link to="/login" className="text-xs text-red-500 font-bold hover:underline">Log Out</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex h-screen relative z-10">
                {/* Sidebar (Desktop) */}
                <aside className="hidden lg:flex flex-col w-64 h-full p-6 border-r border-white/40 bg-white/30 backdrop-blur-2xl">
                    {/* Logo */}
                    <div className="flex items-center gap-2 px-2 mb-10">
                        <div className="w-8 h-8 bg-gradient-to-tr from-primary to-orange-400 rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-lg">lunch_dining</span>
                        </div>
                        <span className="font-bold text-gray-900 text-lg tracking-tight">Smart<span className="text-primary">Tiffin</span></span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => (
                            <SidebarItem
                                key={item.to}
                                {...item}
                                active={location.pathname === item.to}
                            />
                        ))}
                    </nav>

                    {/* User Snippet */}
                    <div className="pt-6 border-t border-white/40">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/40 border border-white/50 backdrop-blur-sm">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">Rahul Sharma</p>
                                <p className="text-xs text-gray-500 truncate">Student Plan</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col h-full overflow-hidden">
                    {/* Topbar */}
                    <header className="h-16 flex items-center justify-between px-6 lg:px-8 border-b border-white/40 bg-white/20 backdrop-blur-md">
                        <h1 className="text-lg font-bold text-gray-800">Dashboard</h1>

                        <div className="flex items-center gap-4">
                            <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-white/50 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">notifications</span>
                            </button>
                            <button className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-gray-500 bg-white/50" onClick={() => setIsMobileMenuOpen(true)}>
                                <span className="material-symbols-outlined">menu</span>
                            </button>
                        </div>
                    </header>

                    {/* Scrollable Page Content */}
                    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
