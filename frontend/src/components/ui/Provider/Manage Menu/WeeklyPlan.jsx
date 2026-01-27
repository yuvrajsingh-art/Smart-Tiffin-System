import React, { useState } from 'react';

const WeeklyPlan = () => {
  const [weeklyMenu, setWeeklyMenu] = useState({
    Monday: [
      { id: 1, name: 'Dal Rice', price: 80, time: 'Lunch' },
      { id: 2, name: 'Roti Sabzi', price: 70, time: 'Dinner' }
    ],
    Tuesday: [
      { id: 3, name: 'Rajma Chawal', price: 90, time: 'Lunch' },
      { id: 4, name: 'Curd Rice', price: 60, time: 'Dinner' }
    ],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  });

  const [selectedDay, setSelectedDay] = useState('Monday');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', time: 'Lunch' });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleAddItem = () => {
    if (newItem.name && newItem.price) {
      setWeeklyMenu(prev => ({
        ...prev,
        [selectedDay]: [...prev[selectedDay], {
          id: Date.now(),
          name: newItem.name,
          price: parseInt(newItem.price),
          time: newItem.time
        }]
      }));
      setNewItem({ name: '', price: '', time: 'Lunch' });
      setShowAddForm(false);
    }
  };

  const deleteItem = (day, itemId) => {
    setWeeklyMenu(prev => ({
      ...prev,
      [day]: prev[day].filter(item => item.id !== itemId)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Weekly Menu Plan</h1>
              <p className="text-gray-600 mt-1">Plan your menu for the entire week</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Add to {selectedDay}
            </button>
          </div>
        </div>

        {/* Day Selector */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {days.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedDay === day
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Add Item Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Add Item to {selectedDay}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Item Name"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
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
                value={newItem.time}
                onChange={(e) => setNewItem({...newItem, time: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Breakfast">Breakfast</option>
              </select>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAddItem}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Add Item
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Weekly Menu Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {days.map(day => (
            <div key={day} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className={`p-4 text-center font-semibold ${
                selectedDay === day ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-800'
              }`}>
                {day}
              </div>
              <div className="p-4 space-y-3 min-h-[200px]">
                {weeklyMenu[day].map(item => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
                      <button
                        onClick={() => deleteItem(day, item.id)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        ×
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-600 font-semibold text-sm">₹{item.price}</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
                {weeklyMenu[day].length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <div className="text-2xl mb-2">📝</div>
                    <p className="text-xs">No items planned</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyPlan;