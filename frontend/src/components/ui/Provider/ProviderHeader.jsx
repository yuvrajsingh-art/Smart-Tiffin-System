import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/UserContext';
import ProviderApi from '../../../services/ProviderApi';

const ProviderHeader = ({ title, subtitle }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await ProviderApi.get('/notifications');
      if (response.data && response.data.data) {
        setNotifications(response.data.data.slice(0, 5)); // Latest 5
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback dummy data
      setNotifications([
        { _id: 1, message: "New subscription from customer", createdAt: new Date(), read: false },
        { _id: 2, message: "Payment received ₹450", createdAt: new Date(), read: false },
        { _id: 3, message: "Customer feedback received", createdAt: new Date(), read: true }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <header className="h-20 glass-header px-8 flex items-center justify-between flex-shrink-0 z-20">
      <div>
        <h1 className="text-2xl font-black text-[#2D241E] tracking-tight">
          Welcome back, {user?.name?.split(' ')[0] || user?.businessName?.split(' ')[0] || 'Provider'}!
        </h1>
        <p className="text-sm font-medium text-[#5C4D42] flex items-center gap-2 mt-1">
          <span className="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
          <span>{new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </p>
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="size-12 rounded-full bg-white/60 hover:bg-white hover:shadow-md transition-all flex items-center justify-center text-[#5C4D42] relative group"
          >
            <span className="material-symbols-outlined transition-transform group-hover:scale-110">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-3 right-3 size-2.5 bg-primary rounded-full ring-2 ring-white animate-pulse"></span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-[100]" onClick={() => setShowNotifications(false)}></div>
              <div className="absolute top-[calc(100%+15px)] right-0 w-80 bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/60 z-[101] animate-[scaleIn_0.2s_ease-out] origin-top-right overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-bold text-[#2D241E]">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                        !notification.read ? 'bg-orange-50/30' : ''
                      }`}
                    >
                      <p className="text-sm text-[#2D241E] font-medium">{notification.message}</p>
                      <p className="text-xs text-[#5C4D42] mt-1">{formatTimeAgo(notification.createdAt)}</p>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-gray-400">
                      <span className="material-symbols-outlined text-4xl mb-2">notifications_off</span>
                      <p className="text-sm">No notifications</p>
                    </div>
                  )}
                </div>
                <div className="p-3 text-center border-t border-gray-100">
                  <Link to="/provider/notifications" className="text-sm text-primary hover:text-orange-700 font-bold">
                    View All Notifications
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Section with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-3 pl-6 border-l border-orange-200/50 transition-all ${isProfileOpen ? 'opacity-80' : ''}`}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-[#2D241E]">{user?.name || user?.businessName || 'Provider'}</p>
              <p className="text-xs text-primary font-bold uppercase tracking-wider">Provider</p>
            </div>
            <div className="relative">
              <img
                alt="Profile"
                className="size-12 rounded-full border-2 border-white shadow-sm object-cover"
                src={user?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || user?.businessName || 'Provider'}`}
              />
              <div className="absolute -bottom-1 -right-1 size-5 bg-white rounded-full shadow-md flex items-center justify-center border border-orange-100">
                <span className={`material-symbols-outlined text-[14px] text-primary transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}>expand_more</span>
              </div>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-[100]" onClick={() => setIsProfileOpen(false)}></div>
              <div className="absolute top-[calc(100%+15px)] right-0 w-80 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/60 p-6 z-[101] animate-[scaleIn_0.2s_ease-out] origin-top-right">
                {/* User Info Card */}
                <div className="bg-[#f8f9fa] rounded-3xl p-6 mb-4 flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    <img
                      alt="Profile Large"
                      className="size-20 rounded-full border-4 border-white shadow-md object-cover"
                      src={user?.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || user?.businessName || 'Provider'}`}
                    />
                    <div className="absolute -bottom-1 -right-1 size-7 bg-primary rounded-full border-4 border-[#f8f9fa] flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[14px]">restaurant</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-[#2D241E]">{user?.name || user?.businessName || 'Provider'}</h3>
                  <p className="text-xs font-medium text-gray-500">{user?.email || 'provider@example.com'}</p>
                </div>

                {/* Dropdown Menu Items */}
                <div className="space-y-1">
                  <Link
                    to="/provider/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[#5C4D42] font-bold text-xs hover:bg-[#f8f9fa] hover:text-primary transition-all group"
                  >
                    <span className="material-symbols-outlined text-[18px] text-gray-400 group-hover:text-primary">account_circle</span>
                    Manage Profile
                  </Link>
                  <Link
                    to="/provider/analytics"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[#5C4D42] font-bold text-xs hover:bg-[#f8f9fa] hover:text-primary transition-all group"
                  >
                    <span className="material-symbols-outlined text-[18px] text-gray-400 group-hover:text-primary">analytics</span>
                    Business Analytics
                  </Link>
                  <Link
                    to="/provider/menu"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[#5C4D42] font-bold text-xs hover:bg-[#f8f9fa] hover:text-primary transition-all group"
                  >
                    <span className="material-symbols-outlined text-[18px] text-gray-400 group-hover:text-primary">restaurant_menu</span>
                    Manage Menu
                  </Link>
                  <Link
                    to="/provider/support"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[#5C4D42] font-bold text-xs hover:bg-[#f8f9fa] hover:text-primary transition-all group"
                  >
                    <span className="material-symbols-outlined text-[18px] text-gray-400 group-hover:text-primary">help</span>
                    Help & Support
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default ProviderHeader;