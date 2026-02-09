import React, { useState, useEffect } from 'react';
import { getTodayMenu } from '../../../../services/ProviderService';
import ProviderApi from '../../../../services/ProviderApi';
import AddItem from './AddItem';

const WeeklyPlan = () => {
  const [weeklyMenu, setWeeklyMenu] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ 
    item1: '',
    item2: '',
    item3: '',
    item4: '',
    calories: '',
    image: '',
    price: '', 
    mealType: 'lunch',
    category: 'Thali',
    type: 'Veg',
    description: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchWeeklyMenu();
  }, []);

  const fetchWeeklyMenu = async () => {
    try {
      const response = await getTodayMenu();
      console.log('Fetch Weekly Menu Response:', response.data);
      if (response.data && response.data.data) {
        const menuByDay = {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
          Sunday: []
        };

        response.data.data.forEach(menu => {
          console.log('Processing menu:', menu.name, 'availableDays:', menu.availableDays);
          if (menu.availableDays && menu.availableDays.length > 0) {
            menu.availableDays.forEach(day => {
              if (menuByDay[day]) {
                menuByDay[day].push({
                  id: menu._id,
                  name: menu.name,
                  price: menu.price,
                  time: menu.mealType === 'lunch' ? 'Lunch' : 'Dinner',
                  image: menu.image,
                  category: menu.category,
                  type: menu.type
                });
              }
            });
          }
        });

        console.log('Final menuByDay:', menuByDay);
        setWeeklyMenu(menuByDay);
      }
    } catch (error) {
      console.error('Error fetching weekly menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (newItem.item1 && newItem.price) {
      try {
        const menuData = {
          name: `${newItem.item1}, ${newItem.item2}, ${newItem.item3}, ${newItem.item4}`.replace(/, ,/g, ',').replace(/,\s*$/, ''),
          items: [newItem.item1, newItem.item2, newItem.item3, newItem.item4].filter(Boolean),
          calories: parseInt(newItem.calories) || 0,
          image: newItem.image,
          price: parseInt(newItem.price),
          mealType: newItem.mealType,
          category: newItem.category,
          type: newItem.type,
          description: newItem.description,
          availableDays: [selectedDay],
          isPublished: true,
          isAvailable: true
        };

        console.log('Sending menu data:', menuData);
        const response = await ProviderApi.post('/provider-menus', menuData);
        console.log('Response:', response.data);
        
        await fetchWeeklyMenu();
        
        setNewItem({ item1: '', item2: '', item3: '', item4: '', calories: '', image: '', price: '', mealType: 'lunch', category: 'Thali', type: 'Veg', description: '' });
        setShowAddForm(false);
        alert('Menu item added successfully!');
      } catch (error) {
        console.error('Error adding menu item:', error.response?.data || error.message);
        alert('Failed to add menu item: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const deleteItem = async (itemId) => {
    try {
      await ProviderApi.delete(`/provider-menus/${itemId}`);
      await fetchWeeklyMenu();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
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
          <AddItem
            selectedDay={selectedDay}
            newItem={newItem}
            setNewItem={setNewItem}
            handleAddItem={handleAddItem}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        ) : (
          /* Weekly Menu Grid */
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
                          onClick={() => deleteItem(item.id)}
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
                      <div className="mt-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {item.type}
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
        )}
      </div>
    </div>
  );
};

export default WeeklyPlan;