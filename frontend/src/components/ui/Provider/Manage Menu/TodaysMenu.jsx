import React, { useState } from 'react';

const TodaysMenu = () => {
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Dal Rice', price: 80, category: 'Main Course', available: true },
    { id: 2, name: 'Roti Sabzi', price: 70, category: 'Main Course', available: true },
    { id: 3, name: 'Rajma Chawal', price: 90, category: 'Main Course', available: false },
    { id: 4, name: 'Curd Rice', price: 60, category: 'Light Meal', available: true },
  ]);

  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Main Course' });

  const handleAddItem = () => {
    if (newItem.name && newItem.price) {
      setMenuItems([...menuItems, {
        id: Date.now(),
        name: newItem.name,
        price: parseInt(newItem.price),
        category: newItem.category,
        available: true
      }]);
      setNewItem({ name: '', price: '', category: 'Main Course' });
    }
  };

  const toggleAvailability = (id) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  const deleteItem = (id) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Today's Menu</h2>
        <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
      </div>

      {/* Add New Item Form */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">Add New Item</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Item Name"
            value={newItem.name}
            onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={(e) => setNewItem({...newItem, price: e.target.value})}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <select
            value={newItem.category}
            onChange={(e) => setNewItem({...newItem, category: e.target.value})}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="Main Course">Main Course</option>
            <option value="Light Meal">Light Meal</option>
            <option value="Snacks">Snacks</option>
            <option value="Dessert">Dessert</option>
          </select>
          <button
            onClick={handleAddItem}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
          >
            Add Item
          </button>
        </div>
      </div>

      {/* Menu Items List */}
      <div className="space-y-3">
        {menuItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h4 className="font-semibold text-gray-800">{item.name}</h4>
                <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">{item.category}</span>
                <span className={`text-sm px-2 py-1 rounded-full ${item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {item.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <p className="text-orange-600 font-semibold mt-1">₹{item.price}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleAvailability(item.id)}
                className={`px-3 py-1 rounded-md text-sm ${item.available ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
              >
                {item.available ? 'Mark Unavailable' : 'Mark Available'}
              </button>
              <button
                onClick={() => deleteItem(item.id)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {menuItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No menu items added yet. Add your first item above!</p>
        </div>
      )}
    </div>
  );
};

export default TodaysMenu;