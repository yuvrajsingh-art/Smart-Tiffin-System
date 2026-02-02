import React, { useState } from 'react';

const TodaysMenu = () => {
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: 'Lunch Special',
      price: 80,
      description: 'A balanced nutritious afternoon meal',
      item_name: {
        item1: 'Roti',
        item2: 'Paneer Sabji',
        item3: 'Dal Fry',
        item4: 'Steamed Rice',
      },
      cal: '740 kcal',
      type: 'Pure Veg',
      image: '/assets/panner.png',
      available: true,
    },
    {
      id: 2,
      name: 'Dinner Special',
      price: 70,
      description: 'Light yet fulfilling evening meal',
      item_name: {
        item1: 'Tawa Roti',
        item2: 'Mix Veg Sabji',
        item3: 'Dal Tadka',
        item4: 'Jeera Rice',
      },
      cal: '740 kcal',
      type: 'Pure Veg',
      image: '/assets/mixveg.png',
      available: true,
    },
  ]);

  const toggleAvailability = (id) => {
    setMenuItems(menuItems.map(item =>
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  const deleteItem = (id) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Menu Items */}
        <div className="flex flex-col gap-6 ">
          {menuItems.map((item) => (
            <div
              key={item.id}
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
                      ${item.available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {item.available ? 'Available' : 'Unavailable'}
                  </span>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleAvailability(item.id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition
                        ${item.available
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                    >
                      {item.available ? 'Disable' : 'Enable'}
                    </button>

                    <button
                      onClick={() => deleteItem(item.id)}
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
