import { useState } from "react";
import Logo from "../Logo.jsx";
import { MdDashboard, MdOutlineRestaurantMenu } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import { CiDeliveryTruck } from "react-icons/ci";
import { MdFeedback } from "react-icons/md";
import { SiSimpleanalytics } from "react-icons/si";
import { FaUser } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { Link } from "react-router-dom";


function ProviderSidebar() {

  const [active, setActive] = useState("dashboard");

  const menu = [
  { id: "dashboard", icon: <MdDashboard />, label: "Dashboard", path: "/Provider/ProviderDashboard" },
  { id: "menu", icon: <MdOutlineRestaurantMenu />, label: "Manage Daily Menu", path: "/Provider/ManageMenu" },
  { id: "customers", icon: <FaUserGroup />, label: "Active Customers", path: "/Provider/ActiveCustomers" },
  { id: "delivery", icon: <CiDeliveryTruck />, label: "Delivery Status", path: "/Provider/DeliveryStatus" },
  { id: "feedback", icon: <MdFeedback />, label: "Customer Feedback", path: "/Provider/CustomerFeedback" },
  { id: "analytics", icon: <SiSimpleanalytics />, label: "Analytics", path: "/Provider/ProviderAnalysis" },
];


  return (
   <div className="w-64 h-screen shadow-md p-4 bg-[#fffdf9]">
  <Logo />

  <div className="flex flex-col justify-between mt-7 h-[calc(100vh-88px)]">
    <div  >
      {menu.map((item) => (
        <Link
          key={item.id}
           to={item.path} 
          onClick={() => setActive(item.id)}
          className={`flex items-center gap-2 text-xl px-4 py-2 ms-1 w-full text-start rounded-md
            ${active === item.id ? "text-red-600 bg-red-50" : "text-gray-700 hover:bg-blue-50/60"}
          `}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
    </div>

    <div>
      <Link to="/Provider/ProviderProfile"
        onClick={() => setActive("ProviderProfile")}
        className={`flex items-center gap-2 text-xl px-4 py-2 ms-1 w-full text-start rounded-md
          ${active === "ProviderProfile" ? "text-red-600 bg-red-50" : "text-gray-700 hover:bg-blue-50/60"}
        `}
      >
        <FaUser />
        Profile
      </Link>

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
