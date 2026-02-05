import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MealTimelineItem, PreferenceModal, GuestMealStickyBar } from '../../components/customer';
import {
    MenuSkeleton,
    PaymentModal,
    BackgroundBlobs,
    PageHeader,
    ConfirmationModal
} from '../../components/common';

const Menu = () => {
    // Selection Logic (Defaulting to Today)
    const [selectedDay] = useState(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[new Date().getDay()];
    });

    const [loading, setLoading] = useState(true);
    const [menuData, setMenuData] = useState({});
    const [guestCounts, setGuestCounts] = useState({ lunch: 0, dinner: 0 }); // Incremental guests to be booked
    const [bookedGuests, setBookedGuests] = useState({ lunch: 0, dinner: 0 }); // Already saved in DB
    const [pausedMeals, setPausedMeals] = useState({ lunch: false, dinner: false });

    // Preferences State
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingPause, setPendingPause] = useState(null);
    const [showPrefModal, setShowPrefModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const [tempPrefs, setTempPrefs] = useState(null);
    const [activeMealType, setActiveMealType] = useState('lunch');
    const [preferences, setPreferences] = useState({
        lunch: { spice: 'Medium', note: '', extras: { extraRoti: 0, extraRice: false } },
        dinner: { spice: 'Medium', note: '', extras: { extraRoti: 0, extraRice: false } }
    });
    const [originalPreferences, setOriginalPreferences] = useState({
        lunch: { spice: 'Medium', note: '', extras: { extraRoti: 0, extraRice: false } },
        dinner: { spice: 'Medium', note: '', extras: { extraRoti: 0, extraRice: false } }
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch Weekly Menu
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

                // Fetch Today's Guest Meals (Baseline)
                const guestResp = await axios.get('/api/customer/menu/get-guest-meals');
                if (guestResp.data.success) {
                    setBookedGuests(guestResp.data.data);
                }

                // Fetch Saved Preferences
                const prefResp = await axios.get('/api/customer/menu/customization');
                if (prefResp.data.success) {
                    const savedPrefs = prefResp.data.data;
                    const todayStr = new Date().toLocaleDateString('en-CA');
                    if (savedPrefs[todayStr]) {
                        setPreferences(prev => ({
                            ...prev,
                            lunch: {
                                spice: savedPrefs[todayStr].lunch?.spice || 'Medium',
                                note: savedPrefs[todayStr].lunch?.note || '',
                                extras: savedPrefs[todayStr].lunch?.extras || { extraRoti: 0, extraRice: false }
                            },
                            dinner: {
                                spice: savedPrefs[todayStr].dinner?.spice || 'Medium',
                                note: savedPrefs[todayStr].dinner?.note || '',
                                extras: savedPrefs[todayStr].dinner?.extras || { extraRoti: 0, extraRice: false }
                            }
                        }));
                        setOriginalPreferences({
                            lunch: {
                                spice: savedPrefs[todayStr].lunch?.spice || 'Medium',
                                note: savedPrefs[todayStr].lunch?.note || '',
                                extras: savedPrefs[todayStr].lunch?.extras || { extraRoti: 0, extraRice: false }
                            },
                            dinner: {
                                spice: savedPrefs[todayStr].dinner?.spice || 'Medium',
                                note: savedPrefs[todayStr].dinner?.note || '',
                                extras: savedPrefs[todayStr].dinner?.extras || { extraRoti: 0, extraRice: false }
                            }
                        });
                    }
                }

                // Fetch Wallet Balance
                const walletResp = await axios.get('/api/customer/wallet/balance');
                if (walletResp.data.success) {
                    setWalletBalance(walletResp.data.data.balance);
                }
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const togglePause = (type) => {
        if (!pausedMeals[type]) {
            setPendingPause(type);
            setShowConfirmModal(true);
        } else {
            executePause(type, false);
        }
    };

    const executePause = async (type, applyToAll) => {
        try {
            const todayStr = new Date().toISOString().split('T')[0];
            const mealsToToggle = applyToAll ? ['lunch', 'dinner'] : [type];

            for (const meal of mealsToToggle) {
                // If we are applying to all, only toggle the one that isn't already in that state
                // (e.g. if pausing, only pause the active ones)
                if (applyToAll && pausedMeals[meal]) continue;

                const { data } = await axios.post('/api/customer/menu/toggle-skip', {
                    date: todayStr,
                    mealType: meal
                });

                if (data.success) {
                    setPausedMeals(prev => ({ ...prev, [meal]: !prev[meal] }));
                }
            }

            toast.success(applyToAll ? "All meals updated!" : "Meal status updated!");
            setShowConfirmModal(false);
            setPendingPause(null);

            // Refresh wallet as money might be refunded
            const walletResp = await axios.get('/api/customer/wallet/balance');
            if (walletResp.data.success) setWalletBalance(walletResp.data.data.balance);

        } catch (error) {
            toast.error(error.response?.data?.message || "Action failed");
        }
    };

    const updateGuestCount = (type, increment) => {
        if (pausedMeals[type]) return;
        setGuestCounts(prev => ({ ...prev, [type]: Math.max(0, prev[type] + increment) }));
    };

    const handleSavePreferences = async (mealPrefs) => {
        // Calculate cost difference to see if payment is needed
        const oldRoti = preferences[activeMealType].extras?.extraRoti || 0;
        const oldRice = preferences[activeMealType].extras?.extraRice ? 1 : 0;
        const newRoti = mealPrefs.extras?.extraRoti || 0;
        const newRice = mealPrefs.extras?.extraRice ? 1 : 0;
        const costDiff = ((newRoti - oldRoti) * 10) + ((newRice - oldRice) * 30);

        // If Online payment chosen and cost > 0, trigger payment modal first
        if (mealPrefs.paymentMethod === 'online' && costDiff > 0) {
            setTempPrefs(mealPrefs);
            setShowPaymentModal(true);
            return;
        }

        await submitPreferences(mealPrefs);
    };

    const submitPreferences = async (mealPrefs) => {
        try {
            const todayStr = new Date().toLocaleDateString('en-CA');
            const { data } = await axios.post('/api/customer/menu/customization', {
                date: todayStr,
                mealType: activeMealType,
                spiceLevel: mealPrefs.spice,
                note: mealPrefs.note,
                extras: mealPrefs.extras,
                paymentMethod: mealPrefs.paymentMethod || 'wallet'
            });

            if (data.success) {
                setPreferences(prev => ({ ...prev, [activeMealType]: mealPrefs }));
                setOriginalPreferences(prev => ({ ...prev, [activeMealType]: mealPrefs }));
                toast.success("Preferences saved & paid! 🌶️");
                setShowPrefModal(false);

                // Refresh wallet balance
                const walletResp = await axios.get('/api/customer/wallet/balance');
                if (walletResp.data.success) setWalletBalance(walletResp.data.data.balance);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save preferences");
            console.error(error);
        }
    };

    const handleGuestBooking = async (payNow) => {
        setIsProcessing(true);
        try {
            const bookings = [];
            if (guestCounts.lunch > 0) bookings.push({ mealType: 'lunch', quantity: guestCounts.lunch });
            if (guestCounts.dinner > 0) bookings.push({ mealType: 'dinner', quantity: guestCounts.dinner });

            if (bookings.length === 0) return;

            // Simple loop for now (can be bulk later)
            for (const b of bookings) {
                const { data } = await axios.post('/api/customer/menu/book-guest', {
                    ...b,
                    payNow,
                    date: new Date().toISOString().split('T')[0]
                });

                if (!data.success) throw new Error(data.message);
            }

            toast.success(payNow ? "Guest meals paid & booked!" : "Guest meals booked (Pay Later)!");

            // Refresh counts
            const guestResp = await axios.get('/api/customer/menu/get-guest-meals');
            if (guestResp.data.success) {
                setBookedGuests(guestResp.data.data);
                setGuestCounts({ lunch: 0, dinner: 0 });
            }
            setShowPaymentModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Booking failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const [isProcessing, setIsProcessing] = useState(false);

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
                {['lunch', 'dinner'].map((type) => {
                    const now = new Date();
                    const currentHour = now.getHours();
                    const cutoffHour = type === 'lunch' ? 10 : 16;
                    const isPastCutoff = currentHour >= cutoffHour;

                    return (
                        <MealTimelineItem
                            key={type}
                            type={type}
                            menu={menuData[selectedDay]?.[type]}
                            paused={pausedMeals[type]}
                            preferences={preferences[type]}
                            onTogglePause={() => togglePause(type)}
                            guestCount={bookedGuests[type] + guestCounts[type]}
                            bookedCount={bookedGuests[type]}
                            onUpdateGuest={(inc) => updateGuestCount(type, inc)}
                            onOpenPreferences={() => { setActiveMealType(type); setShowPrefModal(true); }}
                            isPastCutoff={isPastCutoff}
                        />
                    );
                })}
            </div>

            <div className="mt-8 text-center flex flex-col items-center gap-2">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 inline-block px-4 py-1 rounded-full">Updates allowed till 10 AM</p>
                <Link to="/customer/manage-subscription" className="text-xs font-bold text-primary hover:underline">Want to pause for multiple days?</Link>
            </div>

            <PreferenceModal
                isOpen={showPrefModal}
                activeMealType={activeMealType}
                preferences={preferences}
                setPreferences={setPreferences}
                onClose={() => setShowPrefModal(false)}
                onSave={handleSavePreferences}
                walletBalance={walletBalance}
                originalPreferences={originalPreferences}
            />

            <GuestMealStickyBar
                totalGuests={guestCounts.lunch + guestCounts.dinner}
                totalCost={(guestCounts.lunch + guestCounts.dinner) * 150}
                onCheckout={(payNow) => {
                    if (payNow) {
                        setTempPrefs(null); // Clear temp prefs to indicate guest booking
                        setShowPaymentModal(true);
                    }
                    else handleGuestBooking(false);
                }}
            />

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                amount={tempPrefs ?
                    (((tempPrefs.extras?.extraRoti || 0) - (preferences[activeMealType].extras?.extraRoti || 0)) * 10 +
                        ((tempPrefs.extras?.extraRice ? 1 : 0) - (preferences[activeMealType].extras?.extraRice ? 1 : 0)) * 30) :
                    (guestCounts.lunch + guestCounts.dinner) * 150}
                onSuccess={() => {
                    if (tempPrefs) submitPreferences(tempPrefs);
                    else handleGuestBooking(true);
                }}
                title={tempPrefs ? "Pay for Meal Extras" : "Pay for Guest Meals"}
                isProcessing={isProcessing}
            />

            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => { setShowConfirmModal(false); setPendingPause(null); }}
                onConfirm={(applyToAll) => executePause(pendingPause, applyToAll)}
                title={`Pause ${pendingPause}?`}
                message={`Your ${pendingPause} for today will be skipped and the amount will be refunded to your wallet.`}
                confirmText="Pause Meal"
                showSyncOption={true}
                syncText="Apply to both Lunch & Dinner"
            />
        </div>
    );
};
export default Menu;
