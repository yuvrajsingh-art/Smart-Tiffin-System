import React, { useState, useEffect } from 'react';
import { getTodayMenu } from '../../../../services/ProviderService';
import ProviderApi from '../../../../services/ProviderApi';
import { FaChevronLeft, FaChevronRight, FaEdit, FaTimes, FaPlus, FaLeaf } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const WeeklyPlan = () => {
  const [weeklyMenu, setWeeklyMenu] = useState({});
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [editingDay, setEditingDay] = useState(null);
  const [editingMeal, setEditingMeal] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    items: [{ name: '', color: 'green' }],
    calories: '',
    menuLabel: '',
    type: 'Veg',
    category: 'Thali'
  });

  // Get week dates
  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset + (weekOffset * 7));

    return days.map((_, idx) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + idx);
      return date;
    });
  };

  const weekDates = getWeekDates();
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];
  const today = new Date();
  const todayDayIndex = days.findIndex((_, i) =>
    weekDates[i].toDateString() === today.toDateString()
  );

  const formatWeekRange = () => {
    const startStr = weekStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const endStr = weekEnd.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    return `${startStr} - ${endStr}`;
  };

  useEffect(() => {
    fetchWeeklyMenu();
  }, [weekOffset]);

  const fetchWeeklyMenu = async () => {
    setLoading(true);
    try {
      const response = await ProviderApi.get('/provider-menus');
      if (response.data?.data) {
        const menuByDay = {};

        fullDays.forEach(day => {
          menuByDay[day] = { lunch: null, dinner: null };
        });

        response.data.data.forEach(menu => {
          if (menu.availableDays?.length > 0) {
            menu.availableDays.forEach(day => {
              if (menuByDay[day]) {
                menuByDay[day][menu.mealType] = {
                  id: menu._id,
                  name: menu.name,
                  price: menu.price,
                  description: menu.description,
                  image: menu.image,
                  items: menu.items || [],
                  calories: menu.calories,
                  menuLabel: menu.menuLabel,
                  type: menu.type,
                  category: menu.category,
                  isHoliday: menu.isHoliday
                };
              }
            });
          }
        });

        setWeeklyMenu(menuByDay);
      }
    } catch (error) {
      console.error('Error fetching weekly menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (dayIndex, mealType) => {
    const day = fullDays[dayIndex];
    const existing = weeklyMenu[day]?.[mealType];
    const selectedDate = weekDates[dayIndex];

    // Check if it's a past date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(selectedDate);
    dateToCheck.setHours(0, 0, 0, 0);

    const past = dateToCheck < today;
    setIsViewOnly(past);

    setEditingDay(day);
    setEditingMeal(mealType);
    setEditingItem(existing);

    if (!existing && past) {
      toast.error("Cannot add menu to past dates");
      return;
    }

    if (existing) {
      setFormData({
        name: existing.name || '',
        price: existing.price || '',
        description: existing.description || '',
        image: existing.image || '',
        items: existing.items?.length ? existing.items : [{ name: '', color: 'green' }],
        calories: existing.calories || '',
        menuLabel: existing.menuLabel || '',
        type: existing.type || 'Veg',
        category: existing.category || 'Thali'
      });
    } else {
      if (past) {
        toast.error("Cannot add menu to past dates");
        return;
      }
      setFormData({
        name: day === 'Sunday' ? 'Sunday Special Feast' : (mealType === 'lunch' ? 'Lunch Special' : 'Dinner Special'),
        price: '',
        description: day === 'Sunday' ? 'A grand feast for a relaxing Sunday' : (mealType === 'lunch' ? 'A balanced nutritious afternoon meal' : 'Light yet fulfilling evening meal'),
        image: '',
        items: [{ name: '', color: 'green' }],
        calories: '',
        menuLabel: day === 'Sunday' ? 'SUNDAY SPECIAL' : (mealType === 'lunch' ? 'STANDARD LUNCH' : 'PREMIUM DINNER'),
        type: 'Veg',
        category: 'Thali'
      });
    }
    setShowEditModal(true);
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', color: 'green' }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      toast.error('Please fill required fields');
      return;
    }

    const validItems = formData.items.filter(i => i.name.trim());

    try {
      const menuData = {
        name: formData.name,
        price: parseInt(formData.price),
        description: formData.description,
        image: formData.image,
        items: validItems,
        calories: parseInt(formData.calories) || 0,
        menuLabel: formData.menuLabel,
        type: formData.type,
        category: formData.category,
        mealType: editingMeal,
        availableDays: [editingDay],
        menuDate: weekDates[fullDays.indexOf(editingDay)],
        isPublished: true
      };

      if (editingItem?.id) {
        await ProviderApi.put(`/provider-menus/${editingItem.id}`, menuData);
        toast.success('Menu updated!');
      } else {
        await ProviderApi.post('/provider-menus', menuData);
        toast.success('Menu created!');
      }

      fetchWeeklyMenu();
      setShowEditModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setWeekOffset(prev => prev - 1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FaChevronLeft className="text-gray-400" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Week {Math.ceil((weekStart.getDate()) / 7)}: {formatWeekRange()}</h2>
              <p className="text-xs text-orange-500 font-medium uppercase">
                {weekOffset === 0 ? 'Current Week' : weekOffset > 0 ? 'Upcoming' : 'Past'}
              </p>
            </div>
            <button
              onClick={() => setWeekOffset(prev => prev + 1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <FaChevronRight className="text-gray-400" />
            </button>
          </div>

          <div className="flex gap-2">

            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 flex items-center gap-2">
              <FaEdit size={12} /> Edit Week
            </button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {days.map((day, idx) => {
            const isToday = idx === todayDayIndex;
            const isSunday = idx === 6;

            return (
              <div
                key={day}
                className={`text-center py-3 rounded-xl ${isToday ? 'bg-orange-500 text-white' : 'bg-white border border-gray-100'
                  }`}
              >
                <p className={`text-xs font-bold uppercase ${isToday ? 'text-white/80' : isSunday ? 'text-orange-500' : 'text-gray-400'}`}>
                  {day}
                </p>
                <p className={`text-xl font-bold ${isToday ? 'text-white' : 'text-gray-800'}`}>
                  {weekDates[idx].getDate()}
                </p>
              </div>
            );
          })}
        </div>

        {/* Lunch Row */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {fullDays.map((day, idx) => {
            const menu = weeklyMenu[day]?.lunch;
            const isToday = idx === todayDayIndex;
            const isSunday = idx === 6;

            return (
              <div
                key={`lunch-${day}`}
                onClick={() => openEditModal(idx, 'lunch')}
                className={`p-3 rounded-xl cursor-pointer transition-all hover:shadow-md min-h-[100px] ${isToday ? 'bg-orange-50 border-2 border-orange-200' :
                  isSunday ? 'bg-gray-50' : 'bg-white border border-gray-100'
                  }`}
              >
                <p className={`text-[10px] font-bold uppercase mb-1 ${isToday ? 'text-orange-500' : 'text-gray-400'
                  }`}>
                  Lunch
                </p>
                {menu ? (
                  <>
                    <p className="text-sm font-bold text-gray-800 leading-tight">{menu.name}</p>
                    <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">
                      {menu.items?.map(i => i.name).join(', ') || menu.description}
                    </p>
                    {(isToday || isSunday) && (
                      <span className={`inline-block mt-2 text-[9px] px-2 py-0.5 rounded font-medium ${isSunday ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600'
                        }`}>
                        {isSunday ? 'Sunday Special' : 'Special Menu Today'}
                      </span>
                    )}
                  </>
                ) : (
                  <div className="mt-2">
                    <p className="text-xs text-gray-300 flex items-center gap-1">
                      <FaPlus size={8} /> {isSunday ? 'Add Special' : 'Add'}
                    </p>
                    {isSunday && <p className="text-[9px] text-orange-400 font-medium mt-1">SPECIAL DAY</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Dinner Row */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {fullDays.map((day, idx) => {
            const menu = weeklyMenu[day]?.dinner;
            const isToday = idx === todayDayIndex;
            const isSunday = idx === 6;

            return (
              <div
                key={`dinner-${day}`}
                onClick={() => openEditModal(idx, 'dinner')}
                className={`p-3 rounded-xl cursor-pointer transition-all hover:shadow-md min-h-[100px] ${isToday ? 'bg-orange-50 border-2 border-orange-200' :
                  isSunday ? 'bg-gray-50' : 'bg-white border border-gray-100'
                  }`}
              >
                <p className={`text-[10px] font-bold uppercase mb-1 ${isToday ? 'text-orange-500' : 'text-gray-400'
                  }`}>
                  Dinner
                </p>
                {menu ? (
                  <>
                    <p className="text-sm font-bold text-gray-800 leading-tight">{menu.name}</p>
                    <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">
                      {menu.items?.map(i => i.name).join(', ') || menu.description}
                    </p>
                    {(isToday || isSunday) && (
                      <span className={`inline-block mt-2 text-[9px] px-2 py-0.5 rounded font-medium ${isSunday ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600'
                        }`}>
                        {isSunday ? 'Sunday Special' : 'Special Menu Today'}
                      </span>
                    )}
                  </>
                ) : (
                  <div className="mt-2">
                    <p className="text-xs text-gray-300 flex items-center gap-1">
                      <FaPlus size={8} /> {isSunday ? 'Add Special' : 'Add'}
                    </p>
                    {isSunday && <p className="text-[9px] text-orange-400 font-medium mt-1">SPECIAL DAY</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Weekly Nutritional Balance */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-orange-500 text-lg">📊</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Weekly Nutritional Balance</h3>
              <p className="text-sm text-gray-400">Average weekly targets: 2100 kcal / day</p>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Proteins</p>
              <p className="font-bold text-gray-800">High (22%)</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Carbs</p>
              <p className="font-bold text-gray-800">Moderate (55%)</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Fats</p>
              <p className="font-bold text-gray-800">Balanced (23%)</p>
            </div>
          </div>
        </div>

      </div>

      {/* Edit Modal - Same as TodaysMenu */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl my-8">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-lg font-bold text-gray-800">
                {isViewOnly ? 'View' : (editingItem ? 'Edit' : 'Add')} {editingMeal === 'lunch' ? 'Lunch' : 'Dinner'} - {editingDay}
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Menu Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                    disabled={isViewOnly}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                    disabled={isViewOnly}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg"
                  placeholder="A balanced nutritious meal..."
                  disabled={isViewOnly}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg"
                  placeholder="https://..."
                  disabled={isViewOnly}
                />
              </div>

              {/* Menu Items */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase">Menu Items</label>
                  {!isViewOnly && (
                    <button
                      type="button"
                      onClick={addItem}
                      className="text-xs text-orange-500 font-medium flex items-center gap-1"
                    >
                      <FaPlus size={10} /> Add Item
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {formData.items.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(idx, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        placeholder={`Item ${idx + 1} (e.g. Roti (4))`}
                        disabled={isViewOnly}
                      />
                      <select
                        value={item.color}
                        onChange={(e) => updateItem(idx, 'color', e.target.value)}
                        className="px-2 py-2 border border-gray-200 rounded-lg text-sm"
                        disabled={isViewOnly}
                      >
                        <option value="green">🟢</option>
                        <option value="orange">🟠</option>
                        <option value="yellow">🟡</option>
                        <option value="blue">🔵</option>
                        <option value="purple">🟣</option>
                      </select>
                      {formData.items.length > 1 && !isViewOnly && (
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="text-red-400 hover:text-red-600 px-2"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Calories</label>
                  <input
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg"
                    placeholder="740"
                    disabled={isViewOnly}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg"
                    disabled={isViewOnly}
                  >
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Egg">Egg</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Label</label>
                  <input
                    type="text"
                    value={formData.menuLabel}
                    onChange={(e) => setFormData({ ...formData, menuLabel: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg"
                    placeholder="STANDARD LUNCH"
                    disabled={isViewOnly}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                {!isViewOnly && (
                  <button
                    type="submit"
                    className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition"
                  >
                    Save Menu
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className={`flex-1 py-3 rounded-xl font-bold transition ${isViewOnly ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {isViewOnly ? 'Close' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyPlan;