import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MealTimelineItem, PreferenceModal, GuestMealStickyBar } from '../../components/customer';
import {
    MenuSkeleton,
    PaymentModal,
    BackgroundBlobs,
    PageHeader
} from '../../components/common';

const Menu = () => {
    // Selection Logic (Defaulting to Today)
    const [selectedDay] = useState(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[new Date().getDay()];
    });

    const [loading, setLoading] = useState(true);
    const [menuData, setMenuData] = useState({});
    const [guestCounts, setGuestCounts] = useState({ lunch: 0, dinner: 0 });
    const [pausedMeals, setPausedMeals] = useState({ lunch: false, dinner: false });

    // Preferences State
    const [showPrefModal, setShowPrefModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [activeMealType, setActiveMealType] = useState('lunch');
    const [preferences, setPreferences] = useState({
        lunch: { spice: 'Medium', note: '', extras: [] },
        dinner: { spice: 'Medium', note: '', extras: [] }
    });

    useEffect(() => {
        const fetchWeeklyMenu = async () => {
            try {
                const { data } = await axios.get('/api/customer/menu/weekly');
                if (data.success) {
                    const { menuData: rawMenu, skippedMeals } = data.data;
                    const todayStr = new Date().toISOString().split('T')[0];
                    const todaySkips = skippedMeals.filter(s => s.date === todayStr);

                    setPausedMeals({
                        lunch: todaySkips.some(s => s.mealType === 'lunch'),
                        dinner: todaySkips.some(s => s.mealType === 'dinner')
                    });
                    setMenuData(rawMenu || {});
                }
            } catch (error) {
                console.error("Failed to fetch menu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWeeklyMenu();
    }, []);

    const togglePause = async (type) => {
        const isPausing = !pausedMeals[type];
        if (isPausing && !window.confirm(`Pause ${type} for Today? Money will be refunded to wallet.`)) return;

        try {
            const todayStr = new Date().toISOString().split('T')[0];
            const { data } = await axios.post('/api/customer/menu/toggle-skip', { date: todayStr, mealType: type });
            if (data.success) {
                setPausedMeals(prev => ({ ...prev, [type]: !prev[type] }));
                alert(data.message);
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to toggle meal");
        }
    };

    const updateGuestCount = (type, increment) => {
        if (pausedMeals[type]) return;
        setGuestCounts(prev => ({ ...prev, [type]: Math.max(0, prev[type] + increment) }));
    };

    const handleSavePreferences = (newPrefs) => {
        setPreferences(prev => ({ ...prev, [activeMealType]: newPrefs }));
        setShowPrefModal(false);
        alert(`Preferences saved for ${activeMealType}! 🌶️`);
    };

    const totalGuests = guestCounts.lunch + guestCounts.dinner;
    const totalCost = totalGuests * 150;

    if (loading) return (
        <div className="max-w-7xl mx-auto pb-20 px-4">
            <PageHeader title="Today's Menu" />
            <MenuSkeleton />
        </div>
    );

    return (
        <div className="w-full pb-20 animate-[fadeIn_0.5s_ease-out] px-4 relative">
            <BackgroundBlobs />
            <PageHeader
                title="Today's Menu"
                subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                backText="Back"
            />

            <div className="relative mt-8">
                <div className="absolute left-[2rem] top-4 bottom-12 w-0.5 bg-gray-200 -translate-x-1/2 rounded-full"></div>
                {['lunch', 'dinner'].map((type) => (
                    <MealTimelineItem
                        key={type}
                        type={type}
                        menu={menuData[selectedDay]?.[type]}
                        paused={pausedMeals[type]}
                        preferences={preferences[type]}
                        onTogglePause={() => togglePause(type)}
                        guestCount={guestCounts[type]}
                        onUpdateGuest={(inc) => updateGuestCount(type, inc)}
                        onOpenPreferences={() => { setActiveMealType(type); setShowPrefModal(true); }}
                    />
                ))}
            </div>

            <div className="mt-8 text-center flex flex-col items-center gap-2">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 inline-block px-4 py-1 rounded-full">Updates allowed till 10 AM</p>
                <Link to="/customer/pause" className="text-xs font-bold text-primary hover:underline">Want to pause for multiple days?</Link>
            </div>

            <PreferenceModal
                isOpen={showPrefModal}
                activeMealType={activeMealType}
                preferences={preferences}
                setPreferences={setPreferences}
                onClose={() => setShowPrefModal(false)}
                onSave={handleSavePreferences}
            />

            <GuestMealStickyBar
                totalGuests={totalGuests}
                totalCost={totalCost}
                onCheckout={() => setShowPaymentModal(true)}
            />

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                amount={totalCost}
                onSuccess={() => { setGuestCounts({ lunch: 0, dinner: 0 }); setShowPaymentModal(false); alert('Guest meals booked!'); }}
                title="Pay for Guest Meals"
            />
        </div>
    );
};
export default Menu;
