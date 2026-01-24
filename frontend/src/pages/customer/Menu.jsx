import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
    const [selectedDay, setSelectedDay] = useState('Mon');

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const menuData = {
        'Mon': { lunch: { title: 'Paneer Butter Masala', items: '3 Rotis, Jeera Rice, Dal Fry, Salad', cal: 650 }, dinner: { title: 'Aloo Gobi Dry', items: '3 Rotis, Dal Tadka, Rice', cal: 500 } },
        'Tue': { lunch: { title: 'Veg Kofta Curry', items: '3 Rotis, Steam Rice, Curd', cal: 620 }, dinner: { title: 'Sev Bhaji (Spicy)', items: '2 Bhakri/Rotis, Thecha, Rice', cal: 550 } },
        'Wed': { lunch: { title: 'Rajma Chawal Special', items: 'Jeera Rice, Fryums, Pickle', cal: 700 }, dinner: { title: 'Mix Veg Handi', items: '3 Rotis, Dal Fry, Rice', cal: 480 } },
        'Thu': { lunch: { title: 'Baingan Bharta', items: '3 Rotis, Varan Bhat, Salad', cal: 580 }, dinner: { title: 'Methi Matar Malai', items: '3 Rotis, Jeera Rice', cal: 520 } },
        'Fri': { lunch: { title: 'Chole Bhature Treat', items: '2 Bhature, Chole, Onion Salad', cal: 850 }, dinner: { title: 'Soyabean Curry', items: '3 Rotis, Rice, Buttermilk', cal: 500 } },
        'Sat': { lunch: { title: 'Maharashtrian Thali', items: 'Puran Poli, Katachi Amti, Rice', cal: 900 }, dinner: { title: 'Egg Curry / Paneer Bhurji', items: '3 Rotis, Rice', cal: 600 } },
        'Sun': { lunch: { title: 'Sunday Special Biryani', items: 'Veg Hyderabadi Biryani, Raita', cal: 750 }, dinner: { title: 'Light Khichdi Kadhi', items: 'Roasted Papad, Pickle', cal: 400 } },
    };

    const currentMenu = menuData[selectedDay];

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-[fadeIn_0.5s_ease-out] px-4">

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link to="/customer/dashboard" className="size-10 rounded-full bg-white flex items-center justify-center text-[#2D241E] shadow-sm hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-[#2D241E] leading-none">Weekly Menu</h1>
                    <p className="text-xs font-bold text-[#5C4D42] mt-1">Plan your week ahead 📅</p>
                </div>
            </div>

            {/* Day Selector */}
            <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                {weekDays.map((day) => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`min-w-[4rem] h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${selectedDay === day ? 'bg-[#2D241E] text-white shadow-lg scale-105' : 'bg-white hover:bg-gray-50 text-[#5C4D42] border border-gray-100'}`}
                    >
                        <span className="text-xs font-bold opacity-60 uppercase tracking-wider">{day}</span>
                        {/* Mock Date for demo */}
                        <span className="text-xl font-black">
                            {20 + weekDays.indexOf(day)}
                        </span>
                    </button>
                ))}
            </div>

            {/* Menu Cards */}
            <div className="space-y-6">

                {/* Lunch Card */}
                <div className="glass-panel p-6 rounded-[2rem] border border-white/60 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/50 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-200/50 transition-colors"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">wb_sunny</span> Lunch
                            </span>
                            <div className="flex gap-2">
                                <button className="size-8 rounded-full bg-white hover:bg-gray-50 flex items-center justify-center text-[#5C4D42] transition-colors" title="Change Meal">
                                    <span className="material-symbols-outlined text-lg">swap_horiz</span>
                                </button>
                                <button className="size-8 rounded-full bg-white hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-[#5C4D42] transition-colors" title="Skip Meal">
                                    <span className="material-symbols-outlined text-lg">close</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="size-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-4xl">
                                🍛
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-black text-[#2D241E] mb-1">{currentMenu.lunch.title}</h3>
                                <p className="text-sm font-medium text-[#5C4D42] mb-3">{currentMenu.lunch.items}</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">local_fire_department</span>
                                        {currentMenu.lunch.cal} kcal
                                    </span>
                                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                        Pure Veg
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dinner Card */}
                <div className="glass-panel p-6 rounded-[2rem] border border-white/60 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-200/50 transition-colors"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">bedtime</span> Dinner
                            </span>
                            <div className="flex gap-2">
                                <button className="size-8 rounded-full bg-white hover:bg-gray-50 flex items-center justify-center text-[#5C4D42] transition-colors" title="Change Meal">
                                    <span className="material-symbols-outlined text-lg">swap_horiz</span>
                                </button>
                                <button className="size-8 rounded-full bg-white hover:bg-red-50 hover:text-red-500 flex items-center justify-center text-[#5C4D42] transition-colors" title="Skip Meal">
                                    <span className="material-symbols-outlined text-lg">close</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="size-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-4xl">
                                🍲
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-black text-[#2D241E] mb-1">{currentMenu.dinner.title}</h3>
                                <p className="text-sm font-medium text-[#5C4D42] mb-3">{currentMenu.dinner.items}</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">local_fire_department</span>
                                        {currentMenu.dinner.cal} kcal
                                    </span>
                                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                        Pure Veg
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Note */}
                <div className="text-center p-4">
                    <p className="text-xs text-gray-400 font-medium">
                        <span className="material-symbols-outlined text-sm align-bottom mr-1">info</span>
                        You can change or skip meals up to 2 hours before delivery.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Menu;
