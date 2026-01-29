import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../Logo.jsx";
import { MdDashboard, MdOutlineRestaurantMenu } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import { CiDeliveryTruck } from "react-icons/ci";
import { MdFeedback } from "react-icons/md";
import { SiSimpleanalytics } from "react-icons/si";
import { FaUser } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";

function ProviderSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("dashboard");

  useEffect(() => {
    // Sync active state with current URL
    const path = location.pathname.split("/").pop();
    if (path) setActive(path);
  }, [location]);

  const menu = [
    { id: "dashboard", icon: <MdDashboard />, label: "Dashboard", path: "/provider/dashboard" },
    { id: "menu", icon: <MdOutlineRestaurantMenu />, label: "Manage Daily Menu", path: "/provider/menu" },
    { id: "orders", icon: <CiDeliveryTruck />, label: "Order Management", path: "/provider/orders" },
    // { id: "feedback", icon: <MdFeedback />, label: "Customer Feedback" }, // Future Scope
    // { id: "analytics", icon: <SiSimpleanalytics />, label: "Analytics" }, // Future Scope
  ];

  const handleNavigation = (path, id) => {
    setActive(id);
    navigate(path);
  };

  return (
    <div className="w-64 h-screen shadow-md p-4 bg-[#fffdfa] flex flex-col">
      <Logo />

      <div className="flex flex-col justify-between mt-7 flex-1">
        <div className="space-y-1">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path, item.id)}
              className={`flex items-center gap-2 text-sm font-bold px-4 py-3 w-full text-start rounded-xl transition-all
              ${active === item.id
                  ? "text-white bg-[#2D241E] shadow-lg"
                  : "text-gray-500 hover:bg-orange-50 hover:text-orange-600"}
            `}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-1">
          <button
            onClick={() => handleNavigation("/provider/profile", "profile")}
            className={`flex items-center gap-2 text-sm font-bold px-4 py-3 w-full text-start rounded-xl transition-all
            ${active === "profile"
                ? "text-white bg-[#2D241E] shadow-lg"
                : "text-gray-500 hover:bg-orange-50 hover:text-orange-600"}
          `}
          >
            <FaUser className="text-lg" />
            Profile
          </button>

          <button
            onClick={() => navigate("/login")}
            className={`flex items-center gap-2 text-sm font-bold px-4 py-3 w-full text-start rounded-xl transition-all text-red-500 hover:bg-red-50`}
          >
            <IoIosLogOut className="text-lg" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProviderSidebar;
