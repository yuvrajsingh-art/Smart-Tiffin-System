import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { useAuth } from "../../../context/UserContext";
import Logo from "../../common/Logo";

const SidebarItem = ({ icon, label, path, active }) => (
  <Link
    to={path}
    className={`
      flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl transition-all duration-300 group
      ${active
        ? "bg-orange-100/60 text-primary font-semibold shadow-sm ring-1 ring-primary/10"
        : "text-[#5C4D42] font-medium hover:bg-white/60 hover:text-primary hover:shadow-sm"
      }
    `}
  >
    <span className="material-symbols-outlined text-[18px]">{icon}</span>
    <span className="text-xs font-bold tracking-wide">{label}</span>
  </Link>
);

function ProviderSidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  const menu = [
    { icon: "dashboard", label: "Dashboard", path: "/provider/dashboard" },
    { icon: "restaurant_menu", label: "Manage Daily Menu", path: "/provider/menu" },
    { icon: "loyalty", label: "Subscription Plans", path: "/provider/plans" },
    { icon: "group", label: "Active Customers", path: "/provider/customers" },
    { icon: "local_shipping", label: "Delivery Status", path: "/provider/delivery" },
    { icon: "payment", label: "My Revenue", path: "/provider/revenue" },
    { icon: "feedback", label: "Customer Feedback", path: "/provider/feedback" },
    { icon: "analytics", label: "Analytics", path: "/provider/analytics" }
  ];

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 h-screen fixed md:relative left-0 top-0 flex flex-col flex-shrink-0 transition-transform duration-300 bg-[#fffbf5] backdrop-blur-2xl md:glass-sidebar border-r border-orange-100
        ${isOpen ? "translate-x-0 shadow-2xl z-50" : "-translate-x-full md:translate-x-0 md:z-10"}
      `}>
        {/* Close button for mobile */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-4 right-4 p-2 rounded-xl bg-white/80 hover:bg-white transition-colors"
        >
          <span className="material-symbols-outlined text-xl text-gray-800">
            close
          </span>
        </button>

        <div className="h-20 flex items-center px-6">
          <Logo size="h-9" iconSize="text-[18px]" />
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {menu.map((item) => (
            <div key={item.path} onClick={() => setIsOpen(false)}>
              <SidebarItem
                {...item}
                active={location.pathname === item.path}
              />
            </div>
          ))}
          <div className="my-4 h-px bg-orange-100 w-full"></div>
        </nav>

        <div className="p-3 border-t border-orange-100/50 space-y-1 bg-white/30">
          <div onClick={() => setIsOpen(false)}>
            <Link
              to="/provider/profile"
              className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-[#5C4D42] font-medium hover:bg-white/80 hover:text-primary transition-all group"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
              <span className="text-xs font-bold tracking-wide">Profile</span>
            </Link>
          </div>

          <button
            onClick={() => {
              setIsOpen(false);
              setShowLogoutModal(true);
            }}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-red-500 font-medium hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">
              logout
            </span>
            <span className="text-xs font-bold tracking-wide">Logout</span>
          </button>
        </div>
      </aside>
      {showLogoutModal &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-[#2D241E]/90 backdrop-blur-lg"
              onClick={() => setShowLogoutModal(false)}
            ></div>

            <div className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl relative z-10 text-center">
              <div className="flex flex-col items-center">
                <div className="size-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-4xl">
                    logout
                  </span>
                </div>

                <h3 className="text-2xl font-black mb-2">Logout?</h3>
                <p className="text-sm mb-8 opacity-80">
                  Are you sure you want to log out of your account?
                </p>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 py-4 bg-gray-100 rounded-[1.5rem] font-bold text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-4 bg-red-500 text-white rounded-[1.5rem] font-bold text-sm"
                  >
                    Yes, Log out
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default ProviderSidebar;
