import React, { useEffect, useState } from 'react';
import { getTodayMenu, deleteMenuItem, toggleMenuAvailability } from '../../../../services/ProviderService';
import ProviderApi from '../../../../services/ProviderApi';
import { FaEdit, FaTimes, FaPlus, FaCalendar, FaLeaf, FaHistory } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const TodaysMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null); // 'lunch' or 'dinner'
  const [editingItem, setEditingItem] = useState(null);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });

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

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await getTodayMenu();
      if (res.data?.data) {
        setMenuItems(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching menu", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await ProviderApi.get('/provider-menus/history');
      if (res.data?.data) {
        setHistoryData(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching history", err);
      toast.error("Failed to load history");
    } finally {
      setHistoryLoading(false);
    }
  };

  const openHistory = () => {
    setShowHistoryModal(true);
    fetchHistory();
  };

  const lunchMenu = menuItems.find(m => m.mealType === 'lunch');
  const dinnerMenu = menuItems.find(m => m.mealType === 'dinner');

  const openEditModal = (mealType, existingMenu = null) => {
    setEditingMeal(mealType);
    setEditingItem(existingMenu);

    if (existingMenu) {
      setFormData({
        name: existingMenu.name || '',
        price: existingMenu.price || '',
        description: existingMenu.description || '',
        image: existingMenu.image || '',
        items: existingMenu.items?.length ? existingMenu.items : [{ name: '', color: 'green' }],
        calories: existingMenu.calories || '',
        menuLabel: existingMenu.menuLabel || '',
        type: existingMenu.type || 'Veg',
        category: existingMenu.category || 'Thali'
      });
    } else {
      const isSunday = dayName === 'Sunday';
      setFormData({
        name: isSunday ? 'Sunday Special Feast' : (mealType === 'lunch' ? 'Lunch Special' : 'Dinner Special'),
        price: '',
        description: isSunday ? 'A grand feast for a relaxing Sunday' : (mealType === 'lunch' ? 'A balanced nutritious afternoon meal' : 'Light yet fulfilling evening meal'),
        image: '',
        items: [{ name: '', color: 'green' }],
        calories: '',
        menuLabel: isSunday ? 'SUNDAY SPECIAL' : (mealType === 'lunch' ? 'STANDARD LUNCH' : 'PREMIUM DINNER'),
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

  const handleSubmit = async (e) => {
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
        availableDays: [dayName],
        menuDate: new Date(),
        isPublished: true
      };

      if (editingItem?._id) {
        await ProviderApi.put(`/provider-menus/${editingItem._id}`, menuData);
        toast.success('Menu updated!');
      } else {
        await ProviderApi.post('/provider-menus', menuData);
        toast.success('Menu created!');
      }

      fetchMenu();
      setShowEditModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save menu');
    }
  };

  const getItemColor = (color) => {
    const colors = {
      green: 'bg-green-500',
      orange: 'bg-orange-500',
      yellow: 'bg-yellow-500',
      blue: 'bg-blue-500',
      purple: 'bg-purple-500'
    };
    return colors[color] || colors.green;
  };

  const MealCard = ({ menu, mealType }) => {
    const hasMenu = !!menu;
    const isSunday = dayName === 'Sunday';
    const label = menu?.menuLabel || (isSunday ? 'SUNDAY SPECIAL' : (mealType === 'lunch' ? 'STANDARD LUNCH' : 'PREMIUM DINNER'));

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-96 h-64 md:h-auto relative overflow-hidden bg-gray-100">
            {hasMenu && menu.image ? (
              <img
                src={menu.image}
                alt={menu.name}
                className="w-[400px] h-[300px] object-cover "
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
                <span className="text-6xl">🍱</span>
              </div>
            )}
            {/* Label Badge */}
            <div className={`absolute top-4 left-4 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-lg ${mealType === 'lunch' ? 'bg-orange-500' : 'bg-indigo-600'
              }`}>
              {label}
            </div>

            {/* Approval Status Badge */}
            {hasMenu && (
              <div className={`absolute bottom-4 left-4 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 ${menu.approvalStatus === 'Approved' ? 'bg-green-500 text-white' :
                menu.approvalStatus === 'Rejected' ? 'bg-red-500 text-white' :
                  'bg-amber-400 text-white'
                }`}>
                <span className="material-symbols-outlined text-xs">
                  {menu.approvalStatus === 'Approved' ? 'verified' :
                    menu.approvalStatus === 'Rejected' ? 'error' : 'schedule'}
                </span>
                {menu.approvalStatus || 'Pending'}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 relative">
            {/* Rejection Remarks */}
            {hasMenu && menu.approvalStatus === 'Rejected' && menu.adminRemarks && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex gap-3 items-start animate-pulse">
                <span className="material-symbols-outlined text-red-500">info</span>
                <div>
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Rejection Reason</p>
                  <p className="text-sm text-red-700 font-medium">{menu.adminRemarks}</p>
                </div>
              </div>
            )}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {menu?.name || `${mealType === 'lunch' ? 'Lunch' : 'Dinner'} Special`}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {menu?.description || 'No description set'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-800">₹{menu?.price || '--'}</span>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Per Tiffin</p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex flex-wrap gap-3 my-4">
              {menu?.items?.length > 0 ? (
                menu.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getItemColor(item.color)}`}></span>
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm italic">No items added yet</p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Cals</p>
                  <p className="text-sm font-bold text-gray-700">{menu?.calories || 0} kcal</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Type</p>
                  <p className={`text-sm font-bold flex items-center gap-1 ${menu?.type === 'Veg' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    <FaLeaf size={10} />
                    {menu?.type === 'Veg' ? 'Pure Veg' : menu?.type || 'Veg'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => openEditModal(mealType, menu)}
                className={`px-6 py-2.5 rounded-xl font-medium transition flex items-center gap-2 shadow-sm ${hasMenu
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
              >
                {hasMenu ? <FaEdit size={14} /> : <FaPlus size={14} />}
                {hasMenu ? 'Edit Menu' : 'Add Menu'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffbf5] p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FaCalendar className="text-gray-400" />
            <span className="text-gray-800 font-medium">{dateStr}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={openHistory}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2"
            >
              <FaHistory size={12} />
              History
            </button>
          </div>
        </div>

        {/* Meal Cards */}
        <MealCard menu={lunchMenu} mealType="lunch" />
        <MealCard menu={dinnerMenu} mealType="dinner" />

      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl my-8">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-lg font-bold text-gray-800">
                {editingItem ? 'Edit' : 'Create'} {editingMeal === 'lunch' ? 'Lunch' : 'Dinner'} Menu
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">

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
                />
              </div>

              {/* Menu Items */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase">Menu Items</label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-xs text-orange-500 font-medium flex items-center gap-1"
                  >
                    <FaPlus size={10} /> Add Item
                  </button>
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
                      />
                      <select
                        value={item.color}
                        onChange={(e) => updateItem(idx, 'color', e.target.value)}
                        className="px-2 py-2 border border-gray-200 rounded-lg text-sm"
                      >
                        <option value="green">🟢</option>
                        <option value="orange">🟠</option>
                        <option value="yellow">🟡</option>
                        <option value="blue">🔵</option>
                        <option value="purple">🟣</option>
                      </select>
                      {formData.items.length > 1 && (
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
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg"
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
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition"
                >
                  Save Menu
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FaHistory className="text-orange-500" />
                Menu History
              </h3>
              <button onClick={() => setShowHistoryModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-5 max-h-[60vh] overflow-y-auto">
              {historyLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : historyData.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <FaHistory size={40} className="mx-auto mb-3 opacity-50" />
                  <p>No menu history found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {historyData.map((day, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-3">
                        {new Date(day.date).toLocaleDateString('en-IN', {
                          weekday: 'long', day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {/* Lunch */}
                        <div className="bg-white rounded-lg p-3 border border-gray-100">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-yellow-500">🌞</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Lunch</span>
                          </div>
                          {day.lunch ? (
                            <>
                              <p className="font-bold text-gray-800">{day.lunch.name}</p>
                              <p className="text-xs text-gray-400">
                                {day.lunch.items?.map(i => i.name).join(', ') || day.lunch.description || ''}
                              </p>
                            </>
                          ) : (
                            <p className="text-gray-300 text-sm italic">No menu</p>
                          )}
                        </div>
                        {/* Dinner */}
                        <div className="bg-white rounded-lg p-3 border border-gray-100">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-indigo-500">🌙</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Dinner</span>
                          </div>
                          {day.dinner ? (
                            <>
                              <p className="font-bold text-gray-800">{day.dinner.name}</p>
                              <p className="text-xs text-gray-400">
                                {day.dinner.items?.map(i => i.name).join(', ') || day.dinner.description || ''}
                              </p>
                            </>
                          ) : (
                            <p className="text-gray-300 text-sm italic">No menu</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodaysMenu;
