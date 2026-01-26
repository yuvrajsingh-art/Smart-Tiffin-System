import React, { useState } from 'react';
import toast from 'react-hot-toast';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const mealTypes = [
    { type: 'Breakfast', icon: 'coffee', color: 'text-orange-500', bg: 'bg-orange-50' },
    { type: 'Lunch', icon: 'wb_sunny', color: 'text-amber-600', bg: 'bg-amber-50' },
    { type: 'Dinner', icon: 'dark_mode', color: 'text-indigo-600', bg: 'bg-indigo-50' }
];

const initialMenu = {
    'Mon': { Breakfast: 'Poha Jalebi', Lunch: 'Rajma Chawal', Dinner: 'Paneer Roti' },
    'Tue': { Breakfast: 'Aloo Paratha', Lunch: 'Kadi Chawal', Dinner: 'Mix Veg' },
    'Wed': { Breakfast: 'Idli Sambhar', Lunch: 'Chole Bhature', Dinner: 'Sev Tamatar' },
    'Thu': { Breakfast: 'Upma', Lunch: 'Dal Tadka', Dinner: 'Baigan Bharta' },
    'Fri': { Breakfast: 'Thepla', Lunch: 'Veg Pulao', Dinner: 'Kofta Curry' },
    'Sat': { Breakfast: 'Sandwich', Lunch: 'Special Thali', Dinner: 'Dal Bati' },
    'Sun': { Breakfast: 'Puri Sabzi', Lunch: 'Biryani', Dinner: 'Light Khichdi' },
};

const AdminMenu = () => {
    const [menu, setMenu] = useState(initialMenu);
    const [selectedDay, setSelectedDay] = useState('Mon');

    const handleUpdate = (day, type, value) => {
        setMenu(prev => ({
            ...prev,
            [day]: { ...prev[day], [type]: value }
        }));
    };

    const handleSave = () => {
        toast.success('Weekly Menu published successfully!', {
            icon: '🚀',
            style: { borderRadius: '15px', background: '#2D241E', color: '#fff' }
        });
    };

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto min-h-full pb-8 animate-[fadeIn_0.5s]">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black text-[#2D241E] tracking-tight flex items-center gap-2">
                        Daily Menu Planner
                        <span className="px-2 py-0.5 bg-amber-500 text-white text-[9px] font-black rounded-lg uppercase tracking-wider">Kitchen Live</span>
                    </h2>
                    <p className="text-[#5C4D42] text-xs font-medium opacity-80 mt-0.5 italic text-display">Set your weekly flavors and keep your customers excited.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black text-[#2D241E] hover:border-amber-500 transition-all">Clear Week</button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#2D241E] text-white rounded-2xl text-[11px] font-black hover:bg-[#453831] shadow-xl shadow-[#2D241E]/10 transition-all uppercase tracking-widest"
                    >
                        Publish Menu
                    </button>
                </div>
            </div>

            {/* Week Selector */}
            <div className="flex items-center gap-2 p-2 bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-sm overflow-x-auto no-scrollbar">
                {weekDays.map(day => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`flex-1 min-w-[80px] py-4 rounded-3xl flex flex-col items-center justify-center transition-all duration-300 ${selectedDay === day ? 'bg-[#2D241E] text-white shadow-xl scale-105' : 'text-[#897a70] hover:bg-white/80'
                            }`}
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{day}</span>
                        <span className="text-xl font-black italic">
                            {day === 'Sun' ? '28' : day === 'Mon' ? '29' : day === 'Tue' ? '30' : '31'}
                        </span>
                    </button>
                ))}
            </div>

            {/* Menu Editor Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {mealTypes.map(({ type, icon, color, bg }) => (
                    <div key={type} className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/60 shadow-lg group hover:shadow-2xl transition-all">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className={`size-14 ${bg} ${color} rounded-2xl flex items-center justify-center shadow-inner`}>
                                    <span className="material-symbols-outlined text-3xl">{icon}</span>
                                </div>
                                <h3 className="text-lg font-black text-[#2D241E] tracking-tight">{type}</h3>
                            </div>
                            <span className="text-[9px] font-black text-[#897a70] uppercase tracking-widest">Active Slot</span>
                        </div>

                        <div className="space-y-6">
                            <div className="relative group/input">
                                <label className="text-[10px] font-black text-[#897a70] uppercase ml-2 mb-2 block tracking-widest">Primary Dish</label>
                                <input
                                    type="text"
                                    value={menu[selectedDay][type]}
                                    onChange={(e) => handleUpdate(selectedDay, type, e.target.value)}
                                    className="w-full bg-gray-50/50 border-2 border-transparent border-b-gray-200 px-4 py-3 rounded-2xl text-sm font-bold text-[#2D241E] focus:bg-white focus:border-amber-500/50 focus:ring-0 transition-all outline-none"
                                />
                            </div>

                            <div className="p-4 bg-gray-50/50 rounded-3xl border border-gray-100 flex items-center justify-between group-hover:bg-white transition-colors">
                                <div>
                                    <p className="text-[9px] font-black text-[#897a70] uppercase tracking-widest">Calorie Goal</p>
                                    <p className="text-xs font-black text-[#2D241E] mt-0.5">~ 650 kcal</p>
                                </div>
                                <button onClick={() => toast('AI suggestions coming soon!', { icon: '🤖' })} className="size-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#5C4D42] hover:text-amber-500 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                                </button>
                            </div>

                            <div className="pt-4">
                                <p className="text-[9px] font-black text-[#897a70] uppercase ml-2 mb-3 tracking-widest">Portion Scale</p>
                                <div className="flex gap-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-amber-400 w-full"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Suggestions / Global Presets */}
            <div className="bg-[#2D241E] p-8 rounded-[3rem] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 size-64 bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-md">
                        <h4 className="text-xl font-black italic tracking-tight mb-2">Smart Menu Presets</h4>
                        <p className="text-white/60 text-xs font-medium leading-relaxed">Instantly apply a pre-designed weekly menu for different palettes. Saves time and ensures nutritional balance.</p>
                    </div>
                    <div className="flex gap-4">
                        {['Standard', 'Budget', 'Premium'].map(preset => (
                            <button key={preset} className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-[11px] font-black transition-all">
                                Apply {preset}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMenu;
