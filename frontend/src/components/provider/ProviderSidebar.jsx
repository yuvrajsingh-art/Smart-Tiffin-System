import { useState } from "react";
import Logo from "../Logo.jsx";
import { MdDashboard, MdOutlineRestaurantMenu } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import { CiDeliveryTruck } from "react-icons/ci";
import { MdFeedback } from "react-icons/md";
import { SiSimpleanalytics } from "react-icons/si";
import { FaUser } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";

function ProviderSidebar() {

  const [active, setActive] = useState("dashboard");

  const menu = [
    { id: "dashboard", icon: <MdDashboard />, label: "Dashboard" },
    { id: "menu", icon: <MdOutlineRestaurantMenu />, label: "Manage Daily Menu" },
    { id: "customers", icon: <FaUserGroup />, label: "Active Customers" },
    { id: "delivery", icon: <CiDeliveryTruck />, label: "Delivery Status" },
    { id: "feedback", icon: <MdFeedback />, label: "Customer Feedback" },
    { id: "analytics", icon: <SiSimpleanalytics />, label: "Analytics" },
  ];

  return (
   <div className="w-64 h-screen shadow-md p-4 bg-[#fffdfa]">
  <Logo />

  <div className="flex flex-col justify-between mt-7 h-[calc(100vh-88px)]">
    <div  >
      {menu.map((item) => (
        <button
          key={item.id}
          onClick={() => setActive(item.id)}
          className={`flex items-center gap-2 text-xl px-4 py-2 ms-1 w-full text-start rounded-md
            ${active === item.id ? "text-red-600 bg-red-50" : "text-gray-700 hover:bg-blue-50/60"}
          `}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </div>

    <div>
      <button
        onClick={() => setActive("profile")}
        className={`flex items-center gap-2 text-xl px-4 py-2 ms-1 w-full text-start rounded-md
          ${active === "profile" ? "text-red-600 bg-red-50" : "text-gray-700 hover:bg-blue-50/60"}
        `}
      >
        <FaUser />
        Profile
      </button>

      <button
        onClick={() => setActive("logout")}
        className={`flex items-center gap-2 text-xl px-4 py-2 ms-1 w-full text-start rounded-md
          ${active === "logout" ? "text-red-600 bg-red-50" : "text-red-600 hover:bg-red-50"}
        `}
      >
        <IoIosLogOut />
        Logout
      </button>
    </div>
  </div>
</div>

  );
}

export default ProviderSidebar;
