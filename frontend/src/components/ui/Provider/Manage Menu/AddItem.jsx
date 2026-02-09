import React from 'react';

const AddItem = ({ selectedDay, newItem, setNewItem, handleAddItem, onCancel }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Add Item to {selectedDay}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Item 1 Name"
          value={newItem.item1}
          onChange={(e) => setNewItem({...newItem, item1: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="text"
          placeholder="Item 2 Name"
          value={newItem.item2}
          onChange={(e) => setNewItem({...newItem, item2: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="text"
          placeholder="Item 3 Name"
          value={newItem.item3}
          onChange={(e) => setNewItem({...newItem, item3: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="text"
          placeholder="Item 4 Name"
          value={newItem.item4}
          onChange={(e) => setNewItem({...newItem, item4: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="number"
          placeholder="Calories"
          value={newItem.calories}
          onChange={(e) => setNewItem({...newItem, calories: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newItem.image}
          onChange={(e) => setNewItem({...newItem, image: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="number"
          placeholder="Price (₹)"
          value={newItem.price}
          onChange={(e) => setNewItem({...newItem, price: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <select
          value={newItem.mealType}
          onChange={(e) => setNewItem({...newItem, mealType: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
        </select>
        <select
          value={newItem.type}
          onChange={(e) => setNewItem({...newItem, type: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
          <option value="Egg">Egg</option>
        </select>
        <select
          value={newItem.category}
          onChange={(e) => setNewItem({...newItem, category: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="Thali">Thali</option>
          <option value="Bowl">Bowl</option>
          <option value="Combo">Combo</option>
        </select>
        <input
          type="text"
          placeholder="Description (optional)"
          value={newItem.description}
          onChange={(e) => setNewItem({...newItem, description: e.target.value})}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleAddItem}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          Add Item
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddItem;
