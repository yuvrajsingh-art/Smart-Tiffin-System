import React, { useEffect, useState } from 'react';
import { deleteMenuItem, getTodayMenu, toggleMenuAvailability } from '../../../../services/ProviderService';
 console.log("TodaysMenu component loaded");

const TodaysMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  true,

  useEffect(() => {
  const today = new Date().toLocaleString("en-US", { weekday: "short" });

  getTodayMenu()
    .then((res) => {
            console.log("RAW DATA FROM API 👉", res.data.data);

      const filteredMenu = res.data.data.filter(item => {
        const isToday =
          item.availableDays?.includes(today);

        const isLunchOrDinner =
          item.mealType === "lunch" || item.mealType === "dinner";

        return isToday && isLunchOrDinner;
      });

      setMenuItems(filteredMenu);
    })
    .catch((err) => {
      console.error("Error fetching menu", err);
    });
}, []);


   
const toggleAvailability = (id) => {
  toggleMenuAvailability(id)
    .then(() => {
      setMenuItems((prev) =>
        prev.map(item =>
          item._id === id
            ? { ...item, isAvailable: !item.isAvailable }
            : item
        )
      );
    })
    .catch(() => alert("Failed to update availability"));
};

  
const deleteItem = (id) => {
  deleteMenuItem(id)
    .then(() => {
      setMenuItems(menuItems.filter(item => item._id !== id));
    })
    .catch(() => alert("Delete failed"));
};
const todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);

const todayEnd = new Date();
todayEnd.setHours(23, 59, 59, 999);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Menu Items */}
        <div className="flex flex-col gap-6 ">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="flex bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
            >
              {/* Image */}
              <div className="w-80 h-60 bg-gray-100 shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex flex-col justify-between p-4 flex-1">
                <div>
                  {/* Title + Price */}
                  <div className="flex justify-between items-start mt-5">
                    <h3 className="font-semibold text-gray-800 text-xl">
                      {item.name}
                    </h3>
                    <span className="text-xl font-bold text-orange-600">
                      ₹{item.price}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mt-1">
                    {item.description}
                  </p>

                  {/* Items as buttons */}
                  <div className="flex flex-wrap gap-2 mt-7">
                    {Object.values(item.item_name).map((food, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs rounded-full bg-blue-50  border  border-none"
                      >
                        {food}
                      </span>
                    ))}
                  </div>

                  {/* Calories & Type */}
                  <div className="flex gap-4 mt-3 text-sm text-gray-600 mt-7">
                    <span className="flex items-center gap-1">
                      cal: <span className=" ">{item.cal}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      type: <span className="  text-green-600">{item.type}</span>
                    </span>
                  </div>
                </div>

                {/* Bottom actions */}
                <div className="flex justify-between items-center mt-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                      ${item.isAvailable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAvailability(item._id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition
                        ${item.isAvailable
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                    >
                      {item.isAvailable ? 'Disable' : 'Enable'}
                    </button>

                    <button
                      onClick={() => deleteItem(item._id)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-xs font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default TodaysMenu;
