import React, { useState } from 'react';
import { FaBell, FaUser, FaChevronDown } from 'react-icons/fa';

const ProviderHeader = ({ title, subtitle }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, message: "New order from Rahul Sharma", time: "2 min ago", unread: true },
    { id: 2, message: "Payment received ₹450", time: "5 min ago", unread: true },
    { id: 3, message: "Customer feedback received", time: "10 min ago", unread: false }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Title Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-600 mt-1">{subtitle}</p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <FaBell className="text-xl" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                        notification.unread ? 'bg-blue-50' : ''
                      }`}
                    >
                      <p className="text-sm text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-gray-200">
                  <button className="text-sm text-orange-600 hover:text-orange-700">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            >
              <div className="bg-orange-100 p-2 rounded-full">
                <FaUser className="text-orange-600" />
              </div>
              <FaChevronDown className="text-sm" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <FaUser className="text-orange-600 text-lg" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Rajesh Kumar</p>
                      <p className="text-sm text-gray-600">Tasty Tiffin Service</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    View Profile
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    Settings
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    Help & Support
                  </button>
                  <hr className="my-2" />
                  <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </div>
  );
};

export default ProviderHeader;