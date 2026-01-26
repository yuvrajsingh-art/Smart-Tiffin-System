import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const SidebarItem = ({ icon, label, to, active }) => (
    <Link
        to={to}
        className={`
            flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 group
            ${active
                ? 'bg-[#2D241E] text-white shadow-lg shadow-[#2D241E]/20 ring-1 ring-white/10'
                : 'text-[#5C4D42] font-medium hover:bg-[#2D241E]/5 hover:text-[#2D241E]'
            }
        `}
    >
        <span className={`material-symbols-outlined text-[20px] ${active ? 'text-orange-400' : 'text-[#5C4D42] group-hover:text-[#2D241E] transition-colors'}`}>{icon}</span>
        <span className="text-sm tracking-wide">{label}</span>
        {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>}
    </Link>
);

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // Admin Navigation Items
    const navItems = [
        { icon: 'dashboard', label: 'Dashboard', to: '/admin/dashboard' },
        { icon: 'group', label: 'Customers', to: '/admin/customers' },
        { icon: 'soup_kitchen', label: 'Kitchen & Menus', to: '/admin/providers' },
        { icon: 'restaurant_menu', label: 'Meal Plans', to: '/admin/plans' },
        { icon: 'local_shipping', label: 'Orders & Delivery', to: '/admin/orders' },
        { icon: 'payments', label: 'Finance & Billing', to: '/admin/finance' },
        { icon: 'bar_chart', label: 'Reports', to: '/admin/reports' },
        { icon: 'settings', label: 'Settings', to: '/admin/settings' },
    ];

    const handleLogout = () => {
        // Implement admin logout logic
        navigate('/');
    };

    return (
        <div className="font-display bg-[#F5F2EB] text-[#2D241E] h-screen overflow-hidden selection:bg-orange-500/20 selection:text-orange-900 flex relative">

            {/* Background Texture/Blobs - More subtle and professional for Admin */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-200/20 to-orange-100/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#2D241E]/5 to-transparent rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3"></div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-[#2D241E]/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`fixed lg:static top-0 left-0 bottom-0 w-72 bg-white/50 backdrop-blur-xl border-r border-[#2D241E]/5 z-50 flex flex-col transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Logo Area */}
                <div className="h-24 flex items-center px-8 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-[#2D241E] rounded-xl flex items-center justify-center text-orange-400 shadow-xl shadow-orange-900/10">
                            <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
                        </div>
                        <div>
                            <span className="block text-lg font-black tracking-tight text-[#2D241E] leading-none">Smart Tiffin</span>
                            <span className="text-[10px] font-bold tracking-widest uppercase text-[#5C4D42]/70 mt-1">Admin Portal</span>
                        </div>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <SidebarItem key={item.to} {...item} active={location.pathname === item.to} />
                    ))}
                </nav>

                {/* User/Logout Area */}
                <div className="p-4 border-t border-[#2D241E]/5 bg-white/20 space-y-2">
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-600/80 font-medium hover:bg-red-50 hover:text-red-600 transition-all hover:shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        <span className="text-sm">Sign Out</span>
                    </button>
                    <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#2D241E]/5 border border-[#2D241E]/5">
                        <img alt="Admin" className="size-8 rounded-full border border-white shadow-sm object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=AdminBoss" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#2D241E] truncate">Administrator</p>
                            <p className="text-[10px] text-[#5C4D42] truncate">admin@smarttiffin.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full relative z-10 overflow-hidden">
                {/* Header */}
                <header className="h-24 flex items-center justify-between px-6 lg:px-10 flex-shrink-0">
                    <div className="flex items-center gap-4 lg:hidden">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="size-10 rounded-full bg-white/60 flex items-center justify-center text-[#2D241E]">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>

                    <div className="hidden lg:block">
                        <h1 className="text-2xl font-black text-[#2D241E] tracking-tight">Overview</h1>
                        <p className="text-sm text-[#5C4D42] font-medium mt-0.5">Welcome back to the command center.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="h-10 px-4 rounded-full bg-white/60 backdrop-blur-md border border-white/40 flex items-center gap-2 text-[#5C4D42] hover:bg-white hover:shadow-md transition-all text-sm font-semibold">
                            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                            <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </button>
                        <button className="size-10 rounded-full bg-white/60 backdrop-blur-md border border-white/40 flex items-center justify-center text-[#5C4D42] hover:bg-white hover:text-orange-600 hover:shadow-md transition-all relative">
                            <span className="material-symbols-outlined text-[20px]">notifications</span>
                            <span className="absolute top-2.5 right-2.5 size-2 bg-orange-500 rounded-full ring-2 ring-white"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar">
                    <Outlet />
                </div>
            </main>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2D241E]/80 backdrop-blur-md animate-[fadeIn_0.3s]" onClick={() => setShowLogoutModal(false)}></div>
                    <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl animate-[scaleIn_0.3s] relative z-10 text-center">
                        <div className="size-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                            <span className="material-symbols-outlined text-3xl">logout</span>
                        </div>
                        <h3 className="text-xl font-bold text-[#2D241E] mb-2">Sign out of Admin?</h3>
                        <p className="text-[#5C4D42] text-sm mb-8">
                            You will need to login again to access the dashboard.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 py-3.5 bg-gray-100 text-[#5C4D42] rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 py-3.5 bg-red-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AdminLayout;
