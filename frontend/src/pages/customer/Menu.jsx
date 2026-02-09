import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MealTimelineItem, PreferenceModal, GuestMealStickyBar, GuestMealModal } from '../../components/customer';
import {
    MenuSkeleton,
    PaymentModal,
    BackgroundBlobs,
    PageHeader,
    ConfirmationModal
} from '../../components/common';

const Menu = () => {
    // Day selector - defaults to today, but user can select any day
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayIndex = new Date().getDay();
    const [selectedDay, setSelectedDay] = useState(days[todayIndex]);
    const [viewMode, setViewMode] = useState('today'); // 'today' or 'week'

    // Helper: Get actual date for a day name (Sun, Mon, etc.)
    // Returns date within current week
    const getDateForDay = (dayName) => {
        const dayIndex = days.indexOf(dayName);
        const today = new Date();
        const currentDayIndex = today.getDay();
        const diff = dayIndex - currentDayIndex;
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + diff);
        return targetDate.toISOString().split('T')[0]; // YYYY-MM-DD
    };

    const [loading, setLoading] = useState(true);
    const [menuData, setMenuData] = useState({});
    const [guestCounts, setGuestCounts] = useState({ lunch: 0, dinner: 0 }); // Incremental guests to be booked
    const [bookedGuests, setBookedGuests] = useState({ lunch: 0, dinner: 0 }); // Already saved in DB
    const [pausedMeals, setPausedMeals] = useState({ lunch: false, dinner: false });
    const [guestOrders, setGuestOrders] = useState([]); // List of guest orders (for cancel feature)

    // Preferences State
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingPause, setPendingPause] = useState(null);
    const [showPrefModal, setShowPrefModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showGuestModal, setShowGuestModal] = useState(false); // New guest booking modal
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

                // Fetch Guest Orders (for cancel feature)
                const ordersResp = await axios.get('/api/customer/menu/guest-orders');
                if (ordersResp.data.success) {
                    setGuestOrders(ordersResp.data.data);
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
            // Use selected day's date for advance booking
            const bookingDate = getDateForDay(selectedDay);

            for (const b of bookings) {
                const { data } = await axios.post('/api/customer/menu/book-guest', {
                    ...b,
                    payNow,
                    date: bookingDate  // Uses selected day's date (today or future)
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

    // Cancel Guest Order Function
    const cancelGuestOrder = async (orderId) => {
        if (!window.confirm('Cancel this guest meal? Refund will be added to wallet.')) return;

        try {
            const { data } = await axios.post('/api/customer/menu/cancel-guest', { orderId });

            if (data.success) {
                toast.success(data.message);

                // Refresh guest orders and wallet
                const ordersResp = await axios.get('/api/customer/menu/guest-orders');
                if (ordersResp.data.success) setGuestOrders(ordersResp.data.data);

                const guestResp = await axios.get('/api/customer/menu/get-guest-meals');
                if (guestResp.data.success) setBookedGuests(guestResp.data.data);

                const walletResp = await axios.get('/api/customer/wallet/balance');
                if (walletResp.data.success) setWalletBalance(walletResp.data.data.balance);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel');
        }
    };

    // Handle booking from new GuestMealModal
    const handleGuestModalBook = async (bookingData) => {
        setIsProcessing(true);
        try {
            const { date, lunch, dinner, payNow, paymentMethod, transactionId, totalCost } = bookingData;

            // Book lunch if any
            if (lunch > 0) {
                const { data } = await axios.post('/api/customer/menu/book-guest', {
                    mealType: 'lunch',
                    quantity: lunch,
                    payNow,
                    paymentMethod: payNow ? paymentMethod : null,
                    transactionId: paymentMethod === 'upi' ? transactionId : null,
                    date
                });
                if (!data.success) throw new Error(data.message);
            }

            // Book dinner if any
            if (dinner > 0) {
                const { data } = await axios.post('/api/customer/menu/book-guest', {
                    mealType: 'dinner',
                    quantity: dinner,
                    payNow,
                    paymentMethod: payNow ? paymentMethod : null,
                    transactionId: paymentMethod === 'upi' ? transactionId : null,
                    date
                });
                if (!data.success) throw new Error(data.message);
            }

            // Success!
            const formattedDate = new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
            toast.success(payNow
                ? `✅ ${lunch + dinner} guest meal(s) booked & paid for ${formattedDate}!`
                : `✅ ${lunch + dinner} guest meal(s) booked for ${formattedDate}!`
            );

            setShowGuestModal(false);

            // Refresh data
            const ordersResp = await axios.get('/api/customer/menu/guest-orders');
            if (ordersResp.data.success) setGuestOrders(ordersResp.data.data);

            const guestResp = await axios.get('/api/customer/menu/get-guest-meals');
            if (guestResp.data.success) setBookedGuests(guestResp.data.data);

            const walletResp = await axios.get('/api/customer/wallet/balance');
            if (walletResp.data.success) setWalletBalance(walletResp.data.data.balance);

        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Booking failed");
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) return (
        <div className="max-w-7xl mx-auto pb-20 px-4">
            <PageHeader title="Today's Menu" />
            <MenuSkeleton />
        </div>
    );

    return (
        <div className="w-full pb-20 px-4 relative">

            {/* Header with View Toggle */}
            <div className="flex flex-col gap-4 pt-4 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link to="/customer/dashboard" className="text-xs font-bold text-[#5C4D42] hover:text-primary flex items-center gap-1 w-fit mb-1">
                            <span className="material-symbols-outlined text-lg">arrow_back</span> Back
                        </Link>
                        <h1 className="text-xl font-black text-[#2D241E]">
                            {viewMode === 'today' ? "Today's Menu" : "Weekly Menu"}
                        </h1>
                        <p className="text-sm text-[#5C4D42]">
                            {viewMode === 'today'
                                ? new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })
                                : `${selectedDay === days[todayIndex] ? 'Today' : selectedDay}'s Menu`
                            }
                        </p>
                    </div>

                    {/* View Mode Toggle & Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowGuestModal(true)}
                            className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-xs shadow-lg shadow-primary/30 hover:bg-primary/90 flex items-center gap-2 transition-all"
                        >
                            <span className="material-symbols-outlined text-sm">group_add</span>
                            Book Guest
                        </button>

                        <div className="flex bg-gray-100 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('today')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'today'
                                    ? 'bg-white text-primary shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Today
                            </button>
                            <button
                                onClick={() => setViewMode('week')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'week'
                                    ? 'bg-white text-primary shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Week
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Today View - Timeline */}
            {viewMode === 'today' && (
                <div className="relative mt-4">
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
            )}

            {/* Week View - Simplified Grid (No Animations) */}
            {viewMode === 'week' && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Day Cards */}
                    {days.map((day, idx) => {
                        const isToday = idx === todayIndex;
                        const isSelected = day === selectedDay;
                        const dayMenu = menuData[day];

                        return (
                            <div
                                key={day}
                                onClick={() => setSelectedDay(day)}
                                className={`bg-white p-6 rounded-[2rem] border transition-colors cursor-pointer relative overflow-hidden ${isSelected
                                    ? 'border-primary ring-2 ring-primary/5 shadow-md'
                                    : isToday
                                        ? 'border-orange-200 bg-orange-50/10'
                                        : 'border-gray-100 hover:border-gray-200'
                                    }`}
                            >
                                {/* Day Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`size-10 rounded-xl flex items-center justify-center font-black ${isSelected ? 'bg-primary text-white shadow-sm' : isToday ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>
                                            {day.slice(0, 3)}
                                        </div>
                                        <div>
                                            <span className={`text-md font-black block leading-none ${isSelected ? 'text-[#2D241E]' : 'text-gray-700'}`}>
                                                {day}
                                            </span>
                                            {isToday && (
                                                <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest mt-0.5 block">Active</span>
                                            )}
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <div className="bg-primary/5 p-1 rounded-lg">
                                            <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                                        </div>
                                    )}
                                </div>

                                {/* Meals Stack */}
                                <div className="space-y-4">
                                    {/* Lunch Segment */}
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 w-1 bg-orange-500 rounded-full"></div>
                                        <div className="bg-gray-50 p-4 rounded-xl ml-3">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-1">
                                                    <span className="text-sm">🌞</span> Lunch
                                                </span>
                                                {dayMenu?.lunch?.price > 0 && (
                                                    <span className="text-[11px] font-black text-primary">₹{dayMenu.lunch.price}</span>
                                                )}
                                            </div>
                                            <h4 className="text-sm font-black text-[#2D241E] truncate">
                                                {dayMenu?.lunch?.name || "Chef's Lunch Special"}
                                            </h4>
                                            <p className="text-[10px] text-[#5C4D42] font-medium opacity-70 italic mt-0.5 leading-relaxed">
                                                {dayMenu?.lunch?.items || "Signature delights being prepared..."}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Dinner Segment */}
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500 rounded-full"></div>
                                        <div className="bg-gray-50 p-4 rounded-xl ml-3">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1">
                                                    <span className="text-sm">🌙</span> Dinner
                                                </span>
                                                {dayMenu?.dinner?.price > 0 && (
                                                    <span className="text-[11px] font-black text-indigo-700">₹{dayMenu.dinner.price}</span>
                                                )}
                                            </div>
                                            <h4 className="text-sm font-black text-[#2D241E] truncate">
                                                {dayMenu?.dinner?.name || "Chef's Dinner Special"}
                                            </h4>
                                            <p className="text-[10px] text-[#5C4D42] font-medium opacity-70 italic mt-0.5 leading-relaxed">
                                                {dayMenu?.dinner?.items || "Signature delights being prepared..."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Booked Guest Meals Section */}
            {guestOrders.filter(o => o.status !== 'cancelled').length > 0 && (
                <div className="mt-6 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                        👥 Your Guest Meals
                    </h3>
                    <div className="space-y-2">
                        {guestOrders.filter(o => o.status !== 'cancelled').map(order => (
                            <div key={order._id} className="bg-white rounded-xl p-3 flex items-center justify-between border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">{order.mealType === 'Lunch' ? '🌞' : '🌙'}</span>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            {order.mealType} × {order.quantity}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            ₹{order.amount} • {order.paymentStatus}
                                        </p>
                                    </div>
                                </div>
                                {order.canCancel ? (
                                    <button
                                        onClick={() => cancelGuestOrder(order._id)}
                                        className="px-3 py-1 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                                    >
                                        Cancel
                                    </button>
                                ) : (
                                    <span className="text-[10px] text-gray-400 font-medium">
                                        Cutoff passed
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-8 text-center flex flex-col items-center gap-2">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 inline-block px-4 py-1 rounded-full">Updates allowed till 10:30 AM (Lunch) & 5:00 PM (Dinner)</p>
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

            <GuestMealModal
                isOpen={showGuestModal}
                onClose={() => setShowGuestModal(false)}
                onBook={handleGuestModalBook}
                walletBalance={walletBalance}
                isProcessing={isProcessing}
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
