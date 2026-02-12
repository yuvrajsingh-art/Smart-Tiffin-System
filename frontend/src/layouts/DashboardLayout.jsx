import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/UserContext';
import Logo from '../components/common/Logo';
const SidebarItem = ({ icon, label, to, active }) => (
    <Link
        to={to}
        className={`
            flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl transition-all duration-300 group
            ${active
                ? 'bg-orange-100/60 text-primary font-semibold shadow-sm ring-1 ring-primary/10'
                : 'text-[#5C4D42] font-medium hover:bg-white/60 hover:text-primary hover:shadow-sm'
            }
        `}
    >
        <span className={`material-symbols-outlined text-[18px] ${active ? '' : 'text-[#5C4D42] group-hover:text-primary transition-colors'}`}>{icon}</span>
        <span className="text-xs font-bold tracking-wide">{label}</span>
    </Link>
);

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Auth & Subscription State
    const { logout, user } = useAuth();
    const { hasActiveSubscription } = useSubscription();
    const isSubscribed = hasActiveSubscription();

    // Nav Items with Access Control
    const navItems = [
        { icon: 'dashboard', label: 'Dashboard', to: '/customer/dashboard', public: true },
        { icon: 'search', label: 'Find Mess', to: '/customer/find-mess', public: true }, // Always visible
        { icon: 'account_balance_wallet', label: 'My Wallet', to: '/customer/wallet', public: true },
        { icon: 'restaurant_menu', label: "Today's Menu", to: '/customer/menu', public: false },
        { icon: 'local_shipping', label: 'Track Order', to: '/customer/track', public: false },
        { icon: 'pause_circle', label: 'Manage Subscription', to: '/customer/manage-subscription', public: false },
        { icon: 'history', label: 'History', to: '/customer/history', public: false },
        { icon: 'thumb_up', label: 'Feedback', to: '/customer/feedback', public: false },
        { icon: 'support_agent', label: 'Support', to: '/customer/support', public: true },
    ];

    const visibleNavItems = navItems.filter(item => item.public || isSubscribed);

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="font-display bg-[#FFFBF5] text-[#2D241E] h-screen overflow-hidden selection:bg-primary/20 selection:text-primary flex relative">

            {/* Background Blobs (Premium Warm Theme) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="blob blob-1 blob-primary -top-20 -right-20"></div>
                <div className="blob blob-2 blob-secondary bottom-0 left-0"></div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Sidebar (Slide-in) */}
            <div className={`fixed top-0 left-0 bottom-0 w-64 bg-white/90 backdrop-blur-2xl border-r border-orange-100 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logic same as desktop but simpler structure for mobile if needed, or re-use styling */}
                <div className="h-20 flex items-center px-6 border-b border-orange-100/50">
                    <Logo size="h-9" iconSize="text-[18px]" />
                </div>
                <nav className="p-3 space-y-1">
                    {visibleNavItems.map((item) => (
                        <div key={item.to} onClick={() => setIsMobileMenuOpen(false)}>
                            <SidebarItem {...item} active={location.pathname === item.to} />
                        </div>
                    ))}
                </nav>
            </div>


            {/* Desktop Sidebar (Glass) */}
            <aside className="hidden lg:flex w-64 h-full glass-sidebar flex-col flex-shrink-0 z-50 relative transition-all duration-300">
                <div className="h-20 flex items-center px-6 flex-shrink-0">
                    <Logo size="h-9" iconSize="text-[18px]" />
                </div>

                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                    {visibleNavItems.map((item) => (
                        <SidebarItem key={item.to} {...item} active={location.pathname === item.to} />
                    ))}
                    <div className="my-4 h-px bg-orange-100 w-full"></div>
                </nav>

                <div className="p-3 border-t border-orange-100/50 space-y-1 bg-white/30">
                    <Link to="/customer/profile" className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-[#5C4D42] font-medium hover:bg-white/80 hover:text-primary transition-all group">
                        <span className="material-symbols-outlined text-[18px]">person</span>
                        <span className="text-xs font-bold tracking-wide">Profile</span>
                    </Link>
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-red-500 font-medium hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        <span className="text-xs font-bold tracking-wide">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full relative z-10 overflow-hidden">
                {/* Glass Header */}
                <header className="h-20 glass-header px-8 flex items-center justify-between flex-shrink-0 z-40">
                    <div className="flex items-center gap-4 lg:hidden">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="size-10 rounded-full bg-white/60 flex items-center justify-center text-[#5C4D42]">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>

                    <div className="hidden md:block">
                        <h1 className="text-2xl font-black text-[#2D241E] tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
                        <p className="text-sm font-medium text-[#5C4D42] flex items-center gap-2 mt-1">
                            <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
                            <span>{new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link to="/customer/notifications" className="size-12 rounded-full bg-white/60 hover:bg-white hover:shadow-md transition-all flex items-center justify-center text-[#5C4D42] relative group">
                            <span className="material-symbols-outlined transition-transform group-hover:scale-110">notifications</span>
                            <span className="absolute top-3 right-3 size-2.5 bg-primary rounded-full ring-2 ring-white animate-pulse"></span>
                        </Link>

                        {/* Profile Section with Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className={`flex items-center gap-3 pl-6 border-l border-orange-200/50 transition-all ${isProfileOpen ? 'opacity-80' : ''}`}
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-[#2D241E]">{user?.name || 'User'}</p>
                                    {isSubscribed ? (
                                        <p className="text-xs text-primary font-bold uppercase tracking-wider">Premium Plan</p>
                                    ) : (
                                        <p className="text-xs text-[#5C4D42] font-bold uppercase tracking-wider">Start Journey</p>
                                    )}
                                </div>
                                <div className="relative">
                                    <img alt="Profile" className="size-12 rounded-full border-2 border-white shadow-sm object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                                    <div className="absolute -bottom-1 -right-1 size-5 bg-white rounded-full shadow-md flex items-center justify-center border border-orange-100">
                                        <span className={`material-symbols-outlined text-[14px] text-primary transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}>expand_more</span>
                                    </div>
                                </div>
                            </button>

                            {/* Google-Style Dropdown Menu */}
                            {isProfileOpen && (
                                <>
                                    <div className="fixed inset-0 z-[100]" onClick={() => setIsProfileOpen(false)}></div>
                                    <div className="absolute top-[calc(100%+15px)] right-0 w-80 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/60 p-6 z-[101] animate-[scaleIn_0.2s_ease-out] origin-top-right">
                                        {/* User Info Card */}
                                        <div className="bg-[#f8f9fa] rounded-3xl p-6 mb-4 flex flex-col items-center text-center">
                                            <div className="relative mb-3">
                                                <img alt="Profile Large" className="size-20 rounded-full border-4 border-white shadow-md object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                                                {isSubscribed && (
                                                    <div className="absolute -bottom-1 -right-1 size-7 bg-primary rounded-full border-4 border-[#f8f9fa] flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-white text-[14px]">star</span>
                                                    </div>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-black text-[#2D241E]">{user?.name || 'User'}</h3>
                                            <p className="text-xs font-medium text-gray-500">{user?.email || 'user@example.com'}</p>
                                        </div>

                                        {/* Dropdown Menu Items */}
                                        <div className="space-y-1">
                                            <Link
                                                to="/customer/profile"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[#5C4D42] font-bold text-xs hover:bg-[#f8f9fa] hover:text-primary transition-all group"
                                            >
                                                <span className="material-symbols-outlined text-[18px] text-gray-400 group-hover:text-primary">account_circle</span>
                                                Manage Profile
                                            </Link>
                                            <Link
                                                to="/customer/wallet"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[#5C4D42] font-bold text-xs hover:bg-[#f8f9fa] hover:text-primary transition-all group"
                                            >
                                                <span className="material-symbols-outlined text-[18px] text-gray-400 group-hover:text-primary">account_balance_wallet</span>
                                                Wallet & Payments
                                            </Link>
                                            <Link
                                                to="/customer/manage-subscription"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[#5C4D42] font-bold text-xs hover:bg-[#f8f9fa] hover:text-primary transition-all group"
                                            >
                                                <span className="material-symbols-outlined text-[18px] text-gray-400 group-hover:text-primary">workspace_premium</span>
                                                My Subscription
                                            </Link>
                                            <Link
                                                to="/customer/support"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[#5C4D42] font-bold text-xs hover:bg-[#f8f9fa] hover:text-primary transition-all group"
                                            >
                                                <span className="material-symbols-outlined text-[18px] text-gray-400 group-hover:text-primary">help</span>
                                                Help & Support
                                            </Link>

                                            <div className="h-px bg-gray-100 my-2"></div>

                                            <button
                                                onClick={() => { setIsProfileOpen(false); setShowLogoutModal(true); }}
                                                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-red-500 font-bold text-xs hover:bg-red-50 transition-all group"
                                            >
                                                <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">logout</span>
                                                Sign out of all accounts
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar">
                    <div className="max-w-5xl mx-auto w-full">
                        <Outlet />
                    </div>
                </div>
            </main>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#2D241E]/90 backdrop-blur-lg animate-[fadeIn_0.3s]" onClick={() => setShowLogoutModal(false)}></div>
                    <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl animate-[scaleIn_0.3s] relative overflow-hidden z-10 text-center border border-white/20">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-100 rounded-full blur-[80px] -translate-y-1/2 pointer-events-none opacity-50"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="size-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
                                <span className="material-symbols-outlined text-4xl font-bold">logout</span>
                            </div>
                            <h3 className="text-2xl font-black text-[#2D241E] mb-2">Logout?</h3>
                            <p className="text-[#5C4D42] text-sm font-medium leading-relaxed mb-8 opacity-80">
                                Are you sure you want to log out of your Smart Tiffin account?
                            </p>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="flex-1 py-4 bg-gray-100 text-[#5C4D42] rounded-[1.5rem] font-bold text-sm hover:bg-gray-200 transition-all font-display"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex-1 py-4 bg-red-500 text-white rounded-[1.5rem] font-bold text-sm shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all font-display"
                                >
                                    Yes, Log out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default DashboardLayout;

