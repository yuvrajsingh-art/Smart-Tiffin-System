import React from 'react';

const Menu = () => {
    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            <h2 className="text-2xl font-bold text-gray-900">Today's Menu 🍽️</h2>

            {/* Date Display */}
            <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Date</p>
                    <p className="text-lg font-bold text-primary">22 Jan, 2026</p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Provider</p>
                    <p className="text-lg font-bold text-gray-900">Annapurna Mess</p>
                </div>
            </div>

            {/* Meal Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lunch */}
                <div className="glass-panel p-0 rounded-2xl overflow-hidden group">
                    <div className="h-40 relative">
                        <img src="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=800&auto=format&fit=crop" alt="Lunch" className="w-full h-full object-cover" />
                        <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-md">LUNCH</div>
                    </div>
                    <div className="p-5">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Paneer Butter Masala Thali</h3>
                        <ul className="text-sm text-gray-600 space-y-1 mb-4">
                            <li>• 4 Butter Roti</li>
                            <li>• Jeera Rice</li>
                            <li>• Dal Fry</li>
                            <li>• Salad & Papad</li>
                        </ul>
                    </div>
                </div>

                {/* Dinner */}
                <div className="glass-panel p-0 rounded-2xl overflow-hidden group grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
                    <div className="h-40 relative">
                        <img src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop" alt="Dinner" className="w-full h-full object-cover" />
                        <div className="absolute top-3 left-3 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-md">DINNER</div>
                    </div>
                    <div className="p-5">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Aloo Gobi & Paratha</h3>
                        <ul className="text-sm text-gray-600 space-y-1 mb-4">
                            <li>• 3 Plain Paratha</li>
                            <li>• Curd</li>
                            <li>• Pickle</li>
                        </ul>
                        <p className="text-xs font-bold text-indigo-500">Upcoming (Starts 8:00 PM)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Menu;
