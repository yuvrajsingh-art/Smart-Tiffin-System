import React, { useEffect, useState } from 'react';
import { deleteMenuItem, getTodayMenu, toggleMenuAvailability } from '../../../../services/ProviderService';
 console.log("TodaysMenu component loaded");

const TodaysMenu = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    getTodayMenu()
      .then((res) => {
        console.log("RAW DATA FROM API 👉", res.data);
        if (res.data && res.data.data) {
          setMenuItems(res.data.data);
        }
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {menuItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No menu items found for today</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className="flex bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                {/* Image */}
                <div className="w-80 h-60 bg-gray-100 shrink-0">
                  <img
                    src={item.image || 'https://via.placeholder.com/300x200?text=No+Image'}
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
                      {item.description || 'No description'}
                    </p>

                    {/* Items */}
                    <div className="flex flex-wrap gap-2 mt-7">
                      {item.mainDish && (
                        <span className="px-3 py-1 text-xs rounded-full bg-blue-50 border">
                          {item.mainDish}
                        </span>
                      )}
                      {item.bread?.name && (
                        <span className="px-3 py-1 text-xs rounded-full bg-blue-50 border">
                          {item.bread.name}
                        </span>
                      )}
                      {item.accompaniments?.name && (
                        <span className="px-3 py-1 text-xs rounded-full bg-blue-50 border">
                          {item.accompaniments.name}
                        </span>
                      )}
                    </div>

                    {/* Category & Type */}
                    <div className="flex gap-4 mt-3 text-sm text-gray-600 mt-7">
                      <span className="flex items-center gap-1">
                        Category: <span className="font-medium">{item.category}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        Type: <span className="text-green-600 font-medium">{item.type}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        Meal: <span className="font-medium">{item.mealType}</span>
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
        )}

      </div>
    </div>
  );
};

export default TodaysMenu;
