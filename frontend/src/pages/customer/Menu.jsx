import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import menuService from '../../services/menuService.js';

const Menu = () => {
    // Current Day Only
    const [selectedDay] = useState(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[new Date().getDay()];
    });

    const [guestCounts, setGuestCounts] = useState({ lunch: 0, dinner: 0 });
    const [pausedMeals, setPausedMeals] = useState({ lunch: false, dinner: false });
    const [menuData, setMenuData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch menu data from backend
    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const result = await menuService.getCustomerMenus();
                if (result.success) {
                    setMenuData(result.data);
                } else {
                    console.error('Failed to fetch menus:', result.error);
                }
            } catch (error) {
                console.error('Error fetching menus:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenus();
    }, []);

    // Preferences State
    const [showPrefModal, setShowPrefModal] = useState(false);
    const [activeMealType, setActiveMealType] = useState(null); // 'lunch' or 'dinner'
    const [preferences, setPreferences] = useState({
        lunch: { spice: 'Medium', note: '', extras: [] },
        dinner: { spice: 'Medium', note: '', extras: [] }
    });

    // Helper to toggle pause
    const togglePause = (type) => {
        if (pausedMeals[type]) {
            // Unpausing
            setPausedMeals(prev => ({ ...prev, [type]: false }));
            // Optional: Show toast
        } else {
            // Pausing
            if (window.confirm(`Are you sure you want to pause ${type} for Today? Money will be refunded.`)) {
                setPausedMeals(prev => ({ ...prev, [type]: true }));
            }
        }
    };

    // Helper to update guest count
    const updateGuestCount = (type, increment) => {
        if (pausedMeals[type]) return; // Can't add guest if paused
        setGuestCounts(prev => ({
            ...prev,
            [type]: Math.max(0, prev[type] + increment)
        }));
    };

    // Open Preference Modal
    const openPreferences = (type) => {
        if (pausedMeals[type]) return;
        setActiveMealType(type);
        setShowPrefModal(true);
    };

    // Save Preferences
    const savePreferences = (newPrefs) => {
        setPreferences(prev => ({
            ...prev,
            [activeMealType]: newPrefs
        }));
        setShowPrefModal(false);
        alert(`Preferences saved for ${activeMealType}! 🌶️`);
    };

    // Default menu data (fallback)
    const defaultMenuData = {
        'Mon': { lunch: { title: 'Paneer Butter Masala', items: '3 Rotis, Jeera Rice, Dal Fry, Salad', cal: 650, img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=200' }, dinner: { title: 'Aloo Gobi Dry', items: '3 Rotis, Dal Tadka, Rice', cal: 500, img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=200' } },
        'Tue': { lunch: { title: 'Veg Kofta Curry', items: '3 Rotis, Steam Rice, Curd', cal: 620, img: 'https://images.unsplash.com/photo-1585937421612-70a008356f36?q=80&w=200' }, dinner: { title: 'Sev Bhaji (Spicy)', items: '2 Bhakri/Rotis, Thecha, Rice', cal: 550, img: 'https://images.unsplash.com/photo-1606491956091-76c9efdd336f?q=80&w=200' } },
        'Wed': { lunch: { title: 'Rajma Chawal Special', items: 'Jeera Rice, Fryums, Pickle', cal: 700, img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=200' }, dinner: { title: 'Mix Veg Handi', items: '3 Rotis, Dal Fry, Rice', cal: 480, img: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=200' } },
        'Thu': { lunch: { title: 'Baingan Bharta', items: '3 Rotis, Varan Bhat, Salad', cal: 580, img: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?q=80&w=200' }, dinner: { title: 'Methi Matar Malai', items: '3 Rotis, Jeera Rice', cal: 520, img: 'https://images.unsplash.com/photo-1626500619556-6bf296fb0bdd?q=80&w=200' } },
        'Fri': { lunch: { title: 'Chole Bhature Treat', items: '2 Bhature, Chole, Onion Salad', cal: 850, img: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=200' }, dinner: { title: 'Soyabean Curry', items: '3 Rotis, Rice, Buttermilk', cal: 500, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=200' } },
        'Sat': { lunch: { title: 'Maharashtrian Thali', items: 'Puran Poli, Katachi Amti, Rice', cal: 900, img: 'https://images.unsplash.com/photo-1606491956689-2ea28d6949de?q=80&w=200' }, dinner: { title: 'Egg Curry / Paneer Bhurji', items: '3 Rotis, Rice', cal: 600, img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=200' } },
        'Sun': { lunch: { title: 'Sunday Special Biryani', items: 'Veg Hyderabadi Biryani, Raita', cal: 750, img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=200' }, dinner: { title: 'Light Khichdi Kadhi', items: 'Roasted Papad, Pickle', cal: 400, img: 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=200' } },
    };

    const currentMenu = (menuData && menuData[selectedDay]) || defaultMenuData[selectedDay] || defaultMenuData['Mon'];

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto pb-20 px-4 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading menu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out] px-4 relative">

            {/* Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="blob blob-1 blob-primary opacity-30 scale-75"></div>
                <div className="blob blob-2 blob-secondary opacity-30 scale-75"></div>
            </div>

            {/* Header */}
            <div className="mb-2 pt-4">
                <Link to="/customer/dashboard" className="text-xs font-bold text-[#5C4D42] hover:text-primary flex items-center gap-1 mb-2 transition-colors">
                    <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Dashboard
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-[#2D241E] leading-tight">Today's Menu</h1>
                    <p className="text-xs font-bold text-[#5C4D42] opacity-60 uppercase tracking-widest">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                </div>
            </div>

            {/* Timeline Layout */}
            <div className="relative mt-8">
                {/* Connecting Line */}
                <div className="absolute left-[2rem] top-4 bottom-12 w-0.5 bg-gray-200 -translate-x-1/2 rounded-full"></div>

                {/* Meals */}
                {['lunch', 'dinner'].map((type) => (
                    <div key={type} className="relative pl-20 mb-8 last:mb-0 group">
                        {/* Time Marker */}
                        <div className="absolute left-0 top-0 w-[4rem] flex flex-col items-center gap-1 z-10 pt-4">
                            <span className="text-[12px] font-black text-[#2D241E] leading-none">{type === 'lunch' ? '12:30' : '08:30'}</span>
                            <span className="text-[9px] font-bold text-gray-400 leading-none">PM</span>

                            <div className={`size-3.5 rounded-full border-[3px] border-[#FFFBF5] shadow-sm mt-1 z-20 ${type === 'lunch' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                        </div>

                        <div className={`glass-card p-5 rounded-[2rem] flex flex-col sm:flex-row gap-5 items-center pr-6 overflow-hidden relative transition-all duration-300 border border-white/60 shadow-sm hover:shadow-md ${pausedMeals[type] ? 'grayscale opacity-80 bg-gray-50/80 shadow-none' : 'hover:bg-white/80'}`}>

                            {/* Paused Overlay */}
                            {pausedMeals[type] && (
                                <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-50/50 backdrop-blur-[1px]">
                                    <span className="bg-[#2D241E] text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-xl flex items-center gap-2 animate-[scaleIn_0.2s] border border-gray-700">
                                        <span className="material-symbols-outlined text-lg">pause_circle</span>
                                        <span>Paused</span>
                                    </span>
                                </div>
                            )}

                            {/* Card Badge */}
                            <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-wider ${type === 'lunch' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                                {type}
                            </div>

                            <div className="size-24 rounded-2xl overflow-hidden shrink-0 shadow-sm relative group-hover:scale-105 transition-transform duration-500">
                                <img src={currentMenu[type].img} className="w-full h-full object-cover" alt={type} />
                            </div>

                            <div className="flex-1 min-w-0 text-center sm:text-left w-full space-y-2">
                                <div>
                                    <h3 className="font-black text-[#2D241E] text-lg leading-tight">{currentMenu[type].title}</h3>
                                    <p className="text-xs text-[#5C4D42] font-medium leading-relaxed line-clamp-2 mt-1 opacity-80">{currentMenu[type].items}</p>

                                    {/* Show Preferences if set */}
                                    {(preferences[type].spice !== 'Medium' || preferences[type].note) && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {preferences[type].spice !== 'Medium' && (
                                                <span className="text-[9px] font-bold bg-white text-orange-600 px-2 py-0.5 rounded border border-orange-100">
                                                    {preferences[type].spice} Spice
                                                </span>
                                            )}
                                            {preferences[type].note && (
                                                <span className="text-[9px] font-bold bg-white text-gray-500 px-2 py-0.5 rounded border border-gray-100 truncate max-w-[150px]">
                                                    "{preferences[type].note}"
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                    <span className="text-[10px] font-bold bg-white text-green-700 px-2.5 py-1 rounded-lg border border-green-100 flex items-center gap-1.5 shadow-sm">
                                        <span className="size-1.5 rounded-full bg-green-500"></span> Veg
                                    </span>
                                    <span className="text-[10px] font-bold bg-white text-gray-500 px-2.5 py-1 rounded-lg border border-gray-100 flex items-center gap-1.5 shadow-sm">
                                        <span className="material-symbols-outlined text-[10px] text-orange-400">local_fire_department</span> {currentMenu[type].cal} cal
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-row sm:flex-col gap-2 relative z-30 justify-center">

                                {/* Guest Counter */}
                                <div className={`flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm h-10 ${pausedMeals[type] ? 'opacity-50 pointer-events-none' : ''}`}>
                                    {guestCounts[type] > 0 ? (
                                        <>
                                            <button onClick={() => updateGuestCount(type, -1)} className="size-10 hover:bg-gray-50 text-gray-500 flex items-center justify-center active:bg-gray-100">
                                                <span className="material-symbols-outlined text-xs">remove</span>
                                            </button>
                                            <span className="font-bold text-xs w-6 text-center">{guestCounts[type]}</span>
                                            <button onClick={() => updateGuestCount(type, 1)} className="size-10 hover:bg-gray-50 text-gray-500 flex items-center justify-center active:bg-gray-100">
                                                <span className="material-symbols-outlined text-xs">add</span>
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={() => updateGuestCount(type, 1)} className="h-10 px-3 flex items-center gap-1.5 text-orange-600 font-bold text-[10px] hover:bg-orange-50 transition-colors w-full" title="Add Guest">
                                            <span className="material-symbols-outlined text-base">person_add</span>
                                            <span className="hidden sm:inline">Guest</span>
                                        </button>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openPreferences(type)}
                                        className={`h-10 flex-1 rounded-xl border border-gray-200 flex items-center justify-center transition-colors shadow-sm ${preferences[type].spice !== 'Medium' ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-white text-gray-400 hover:bg-gray-50 hover:text-[#2D241E]'}`}
                                        title="Edit Preference"
                                    >
                                        <span className="material-symbols-outlined text-lg">tune</span>
                                    </button>
                                    <button
                                        onClick={() => togglePause(type)}
                                        className={`h-10 flex-1 rounded-xl border flex items-center justify-center transition-all shadow-sm ${pausedMeals[type] ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'}`}
                                        title={pausedMeals[type] ? "Resume Meal" : "Skip/Pause Meal"}
                                    >
                                        <span className="material-symbols-outlined text-lg">{pausedMeals[type] ? 'play_arrow' : 'pause'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Note */}
            <div className="mt-8 text-center flex flex-col items-center gap-2">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 inline-block px-4 py-1 rounded-full">Updates allowed till 10 AM</p>
                <Link to="/customer/pause" className="text-xs font-bold text-primary hover:underline">Want to pause for multiple days?</Link>
            </div>

            {/* Preference Modal (Portal) */}
            {showPrefModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-md animate-[fadeIn_0.2s]">
                    <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 shadow-2xl animate-[slideUp_0.3s] relative overflow-hidden">

                        {/* Decorative Background for Modal */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-black text-[#2D241E]">Customize Meal</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{activeMealType}</p>
                                </div>
                                <button onClick={() => setShowPrefModal(false)} className="size-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors group">
                                    <span className="material-symbols-outlined text-[#2D241E] group-hover:rotate-90 transition-transform">close</span>
                                </button>
                            </div>

                            {/* Spice Level */}
                            <div className="mb-6">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Spice Level</label>
                                <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
                                    {['Low', 'Medium', 'High'].map(level => (
                                        <button
                                            key={level}
                                            onClick={() => setPreferences(prev => ({
                                                ...prev,
                                                [activeMealType]: { ...prev[activeMealType], spice: level }
                                            }))}
                                            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${preferences[activeMealType].spice === level
                                                ? 'bg-white text-[#2D241E] shadow-sm scale-100'
                                                : 'text-gray-400 hover:text-gray-600 scale-95'
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Note */}
                            <div className="mb-8">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">Special Instructions</label>
                                <textarea
                                    value={preferences[activeMealType].note}
                                    onChange={(e) => setPreferences(prev => ({
                                        ...prev,
                                        [activeMealType]: { ...prev[activeMealType], note: e.target.value }
                                    }))}
                                    placeholder="Any preferences? (e.g. No Onion)"
                                    className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-bold text-[#2D241E] border border-transparent outline-none focus:bg-white focus:border-primary/20 focus:shadow-sm transition-all resize-none h-28 placeholder:font-medium placeholder:text-gray-300"
                                />
                            </div>

                            <button
                                onClick={() => savePreferences(preferences[activeMealType])}
                                className="w-full py-4 bg-[#2D241E] text-white rounded-[1.5rem] font-bold shadow-xl shadow-orange-900/10 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                            >
                                <span className="material-symbols-outlined text-lg">check_circle</span>
                                <span>Save Preferences</span>
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

        </div>
    );
};

export default Menu;
