import React, { useState } from 'react';
import { useSubscription } from '../../context/SubscriptionContext';
import { Link } from 'react-router-dom';

const Menu = () => {
    const { hasActiveSubscription } = useSubscription();
    const hasSubscription = hasActiveSubscription();

    const [activeTab, setActiveTab] = useState('lunch');
    const [rotiCount, setRotiCount] = useState(4);
    const [riceCount, setRiceCount] = useState(1);
    const [guestMeals, setGuestMeals] = useState(0);
    const [isSaved, setIsSaved] = useState(false);

    const GUEST_MEAL_PRICE = 120;

    const handleSave = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="relative space-y-6 animate-[fadeIn_0.5s_ease-out] pb-20">

            {/* Header with Date */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-[#2D241E]">Today's Menu 🍽️</h2>
                    <p className="text-sm font-medium text-[#5C4D42] mt-1">Customize your meal or add for friends.</p>
                </div>
                <div className="bg-white/50 px-4 py-2 rounded-xl border border-orange-100/50">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Provider</p>
                    <p className="text-lg font-bold text-primary">Annapurna Mess</p>
                </div>
            </div>

            {/* Locked Content Overlay */}
            {!hasSubscription && (
                <div className="absolute inset-0 z-50 backdrop-blur-md bg-white/30 flex items-center justify-center rounded-3xl h-full">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md text-center border border-orange-100">
                        <div className="size-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-3xl text-primary">lock</span>
                        </div>
                        <h3 className="text-2xl font-black text-[#2D241E] mb-2">Menu Locked</h3>
                        <p className="text-[#5C4D42] mb-8">You need an active subscription to view the daily menu and book meals.</p>
                        <Link
                            to="/customer/find-mess"
                            className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-[#e05d00] transition-colors shadow-lg shadow-orange-500/20 inline-block"
                        >
                            Subscribe Now
                        </Link>
                    </div>
                </div>
            )}

            {/* Meal Type Tabs */}
            <div className="flex p-1 bg-white/60 rounded-2xl w-full max-w-md mx-auto relative z-10">
                <button
                    onClick={() => setActiveTab('lunch')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'lunch' ? 'bg-white shadow-md text-primary' : 'text-gray-500 hover:bg-white/50'}`}
                >
                    <span className="material-symbols-outlined">wb_sunny</span>
                    Lunch (12:30 PM)
                </button>
                <button
                    onClick={() => setActiveTab('dinner')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'dinner' ? 'bg-[#111716] shadow-md text-white' : 'text-gray-500 hover:bg-white/50'}`}
                >
                    <span className="material-symbols-outlined">dark_mode</span>
                    Dinner (8:00 PM)
                </button>
            </div>

            {activeTab === 'lunch' ? (
                /* Lunch Card */
                <div className="glass-panel p-0 rounded-[2rem] overflow-hidden group">
                    <div className="h-48 md:h-64 relative">
                        <img src="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=1200&auto=format&fit=crop" alt="Lunch" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                            <span className="bg-orange-500 text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block shadow-lg">TODAY'S SPECIAL</span>
                            <h3 className="text-3xl font-black">Paneer Butter Masala Thali</h3>
                            <p className="text-white/80 font-medium">Rich gravy, soft paneer, homestyle taste.</p>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-8">
                        {/* Customization Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h4 className="text-lg font-bold text-[#2D241E] flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">tune</span>
                                    Customize Your Meal
                                </h4>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                                                <span className="material-symbols-outlined">bakery_dining</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#2D241E]">Butter Roti</p>
                                                <p className="text-xs text-[#5C4D42]">Whole Wheat</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white rounded-lg p-1 shadow-sm border border-gray-100">
                                            <button
                                                onClick={() => setRotiCount(Math.max(0, rotiCount - 1))}
                                                className="size-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                                            >-</button>
                                            <span className="font-black text-[#2D241E] w-4 text-center">{rotiCount}</span>
                                            <button
                                                onClick={() => setRotiCount(rotiCount + 1)}
                                                className="size-8 flex items-center justify-center text-primary hover:bg-orange-50 rounded-md transition-colors"
                                            >+</button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                                <span className="material-symbols-outlined">rice_bowl</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#2D241E]">Jeera Rice</p>
                                                <p className="text-xs text-[#5C4D42]">Basmati</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white rounded-lg p-1 shadow-sm border border-gray-100">
                                            <button
                                                onClick={() => setRiceCount(Math.max(0, riceCount - 1))}
                                                className="size-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                                            >-</button>
                                            <span className="font-black text-[#2D241E] w-4 text-center">{riceCount}</span>
                                            <button
                                                onClick={() => setRiceCount(riceCount + 1)}
                                                className="size-8 flex items-center justify-center text-primary hover:bg-orange-50 rounded-md transition-colors"
                                            >+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Guest Meal Section */}
                            <div className="relative overflow-hidden bg-gradient-to-br from-[#111716] to-[#2D241E] rounded-3xl p-6 text-white shadow-xl">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                <h4 className="text-lg font-bold mb-1 flex items-center gap-2 relative z-10">
                                    <span className="material-symbols-outlined text-yellow-400">group_add</span>
                                    Add Guest Meals
                                </h4>
                                <p className="text-white/60 text-xs mb-6 relative z-10">Friend visiting? Add an extra tiffin.</p>

                                <div className="flex items-center justify-between mb-6 relative z-10">
                                    <div>
                                        <p className="text-3xl font-black">{guestMeals}</p>
                                        <p className="text-xs text-white/60">Extra Tiffins</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/10 rounded-xl p-1.5 backdrop-blur-sm">
                                        <button
                                            onClick={() => setGuestMeals(Math.max(0, guestMeals - 1))}
                                            className="size-10 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition-colors"
                                        >
                                            <span className="material-symbols-outlined">remove</span>
                                        </button>
                                        <button
                                            onClick={() => setGuestMeals(guestMeals + 1)}
                                            className="size-10 flex items-center justify-center bg-primary text-white hover:bg-orange-600 rounded-lg transition-colors shadow-lg"
                                        >
                                            <span className="material-symbols-outlined">add</span>
                                        </button>
                                    </div>
                                </div>

                                {guestMeals > 0 && (
                                    <div className="bg-white/10 rounded-xl p-3 flex justify-between items-center text-sm animate-[fadeIn_0.3s_ease-out]">
                                        <span>Extra Charges:</span>
                                        <span className="font-bold text-yellow-400">₹ {guestMeals * GUEST_MEAL_PRICE}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sticky Action Footer */}
                        <div className="pt-4 border-t border-orange-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#5C4D42] font-semibold">Total to Pay</p>
                                <p className="text-2xl font-black text-[#2D241E]">₹ {guestMeals * GUEST_MEAL_PRICE}</p>
                            </div>
                            <button
                                onClick={handleSave}
                                className={`
                                    px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-xl transition-all duration-300
                                    ${isSaved ? 'bg-green-500 text-white' : 'bg-primary text-white hover:scale-105 hover:shadow-primary/40'}
                                `}
                            >
                                {isSaved ? (
                                    <>
                                        <span className="material-symbols-outlined">check</span>
                                        Preferences Saved
                                    </>
                                ) : (
                                    <>
                                        Confirm Order
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Mock Dinner View */
                <div className="glass-panel p-10 rounded-[2rem] text-center py-20">
                    <div className="size-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 grayscale opacity-50">
                        <span className="material-symbols-outlined text-4xl text-gray-400">nights_stay</span>
                    </div>
                    <h3 className="text-2xl font-black text-gray-400">Dinner Menu Not Live Yet</h3>
                    <p className="text-gray-400 mt-2">Check back after 5:00 PM</p>
                </div>
            )}
        </div>
    );
};

export default Menu;
