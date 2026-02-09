const Menu = require("../../models/menu.model");
const User = require("../../models/user.model");
const Subscription = require("../../models/subscription.model");
const CustomerWallet = require("../../models/customerWallet.model");
const Transaction = require("../../models/transaction.model");
const { createNotification } = require("../../utils/notificationService");
const logger = require("../../utils/logger");

// Get weekly menu for customer
exports.getWeeklyMenu = async (req, res) => {
    try {
        const customerId = req.user._id;

        // Check if customer has active subscription
        const now = new Date();
        const startOfTodaySub = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const activeSubscription = await Subscription.findOne({
            customer: customerId,
            status: "approved",
            endDate: { $gte: startOfTodaySub }
        }).populate('provider', 'fullName');

        if (!activeSubscription || !activeSubscription.provider) {
            logger.warn("Menu Fetch Failed: No Active Subscription or Provider", { customerId });
            return res.status(404).json({
                success: false,
                message: 'No active subscription found or provider is missing'
            });
        }

        const providerId = activeSubscription.provider._id;

        // --- IST Aware Weekly Logic ---
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istNow = new Date(now.getTime() + istOffset);
        const currentDay = istNow.getUTCDay();
        const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

        // Start of Monday IST (at 00:00:00)
        const monday = new Date(Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate() + mondayOffset, 0, 0, 0, 0));
        monday.setTime(monday.getTime() - istOffset); // Map back to UTC for query if stored as UTC

        // End of Sunday IST (at 23:59:59)
        const sunday = new Date(monday.getTime() + (7 * 24 * 60 * 60 * 1000) - 1);

        // Fetch weekly menu from database
        const weeklyMenus = await Menu.find({
            provider: providerId,
            menuDate: { $gte: monday, $lte: sunday },
            isPublished: true,
            approvalStatus: { $in: ["Approved", "Pending"] }
        }).sort({ menuDate: 1, mealType: 1 });

        // Format menu data for frontend
        const menuData = {};
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Initialize all days with default data (Matching Frontend Keys)
        days.forEach(day => {
            menuData[day] = {
                lunch: {
                    name: "Chef's Lunch Special",
                    items: "Signature delights being prepared by the chef...",
                    calories: 0,
                    price: 0,
                    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=200"
                },
                dinner: {
                    name: "Chef's Dinner Special",
                    items: "Signature delights being prepared by the chef...",
                    calories: 0,
                    price: 0,
                    image: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=200"
                }
            };
        });

        // Fill with actual menu data
        weeklyMenus.forEach(menu => {
            // Adjust menuDate to IST to find the correct bucket
            const menuDateIST = new Date(menu.menuDate.getTime() + istOffset);
            const dayName = days[menuDateIST.getUTCDay()];

            if (menuData[dayName]) {
                const itemsString = Array.isArray(menu.items) && menu.items.length > 0
                    ? menu.items.map(i => i.name).join(', ')
                    : (menu.description || 'Standard meal');

                menuData[dayName][menu.mealType] = {
                    id: menu._id,
                    name: menu.menuLabel || menu.name,
                    items: itemsString,
                    itemsArray: menu.items || [],
                    calories: menu.calories || 650,
                    price: menu.price || 0,
                    type: menu.type || "Veg",
                    image: menu.image || (menu.mealType === 'lunch' ? "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=200" : "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=200"),
                    emoji: menu.mealType === 'lunch' ? "🍛" : "🌙"
                };
            }
        });

        res.json({
            success: true,
            data: {
                menuData,
                providerName: activeSubscription.provider?.fullName || "Missing Provider",
                subscriptionId: activeSubscription._id,
                skippedMeals: activeSubscription.skippedMeals || []
            }
        });

    } catch (error) {
        logger.error("Error in getWeeklyMenu:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch weekly menu'
        });
    }
};

/**
 * Toggle skip for a specific meal (Lunch/Dinner)
 * POST /api/customer/menu/toggle-skip
 */
exports.toggleMealSkip = async (req, res) => {
    try {
        const customerId = req.user._id;
        const { date, mealType } = req.body; // date format: YYYY-MM-DD, mealType: lunch/dinner

        if (!date || !mealType) {
            return res.status(400).json({ success: false, message: "Date and mealType are required" });
        }

        // 1. Check active subscription
        const subscription = await Subscription.findOne({
            customer: customerId,
            status: "approved",
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() }
        });

        if (!subscription) {
            return res.status(404).json({ success: false, message: "No active subscription found" });
        }

        // 2. Validate cutoff time if date is today
        const todayStr = new Date().toISOString().split('T')[0];
        const requestedDateStr = new Date(date).toISOString().split('T')[0];

        if (requestedDateStr === todayStr) {
            const now = new Date();
            const currentHour = now.getHours();

            // Lunch Cutoff: 10:00 AM
            // Dinner Cutoff: 4:00 PM (16:00)
            const cutoffHour = mealType.toLowerCase() === 'lunch' ? 10 : 16;
            const cutoffLabel = mealType.toLowerCase() === 'lunch' ? '10:00 AM' : '4:00 PM';

            if (currentHour >= cutoffHour) {
                console.log(`[PAUSE_DENIED] Cutoff reached for ${mealType}: ${currentHour} >= ${cutoffHour}`);
                return res.status(400).json({
                    success: false,
                    message: `Cutoff time (${cutoffLabel}) exceeded for today's ${mealType}. Cannot change status now.`
                });
            }
        } else if (new Date(date) < new Date(todayStr)) {
            return res.status(400).json({ success: false, message: "Cannot skip past meals" });
        }

        // 3. Check if already skipped
        const skipIndex = subscription.skippedMeals.findIndex(
            s => s.date === requestedDateStr && s.mealType === mealType
        );

        let message = "";
        let refundProcessed = 0;

        if (skipIndex > -1) {
            // Unskip logic (Reverse)
            const skippedMeal = subscription.skippedMeals[skipIndex];
            refundProcessed = -skippedMeal.refundAmount; // Deduct the refund back

            // Check wallet balance before deducting (user might have spent it)
            const wallet = await CustomerWallet.findOne({ customer: customerId });
            if (wallet && wallet.balance < skippedMeal.refundAmount) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient wallet balance to resume this meal (refund was already used)."
                });
            }

            subscription.skippedMeals.splice(skipIndex, 1);
            message = `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} resumed successfully. Amount deducted from wallet.`;
        } else {
            // Skip logic
            // Calculate refund amount: (Price / (Duration * MealsPerDay))
            const mealsPerDay = subscription.mealType === "Both" ? 2 : 1;
            const totalMeals = subscription.durationInDays * mealsPerDay;
            const perMealCost = Math.floor(subscription.price / totalMeals);
            refundProcessed = perMealCost;

            subscription.skippedMeals.push({
                date: requestedDateStr,
                mealType,
                refundAmount: refundProcessed
            });
            message = `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} skipped successfully. ₹${refundProcessed} refunded to wallet.`;
        }

        // 4. Update Subscription
        await subscription.save();

        // 5. Update Wallet & Create Transaction
        if (refundProcessed !== 0) {
            await CustomerWallet.findOneAndUpdate(
                { customer: customerId },
                { $inc: { balance: refundProcessed } },
                { upsert: true }
            );

            await Transaction.create({
                customer: customerId,
                provider: subscription.provider,
                type: refundProcessed > 0 ? "credit" : "debit",
                transactionType: "Refund",
                referenceId: `SKIP-${subscription._id.toString().slice(-4)}-${requestedDateStr}`,
                amount: Math.abs(refundProcessed),
                status: "Success",
                description: refundProcessed > 0
                    ? `Refund for skipping ${mealType} on ${requestedDateStr}`
                    : `Charge for resuming ${mealType} on ${requestedDateStr}`,
                subscriptionId: subscription._id
            });

            // 6. Send Notification
            await createNotification(
                customerId,
                refundProcessed > 0 ? "Meal Skipped" : "Meal Resumed",
                refundProcessed > 0
                    ? `Your ${mealType} for ${requestedDateStr} has been skipped. ₹${refundProcessed} credited to wallet.`
                    : `Your ${mealType} for ${requestedDateStr} has been resumed. ₹${Math.abs(refundProcessed)} deducted from wallet.`,
                refundProcessed > 0 ? "Success" : "Info",
                { mealType, date: requestedDateStr, refundAmount: refundProcessed }
            );
        }

        res.json({
            success: true,
            message,
            data: {
                skippedMeals: subscription.skippedMeals
            }
        });

    } catch (error) {
        console.error("Toggle Skip Meal Error:", error);
        res.status(500).json({ success: false, message: "Failed to update meal status" });
    }
};

/**
 * Get skipped meals for active subscription
 * GET /api/customer/menu/skipped-meals
 */
exports.getSkippedMeals = async (req, res) => {
    try {
        const customerId = req.user._id;

        const subscription = await Subscription.findOne({
            customer: customerId,
            status: "approved",
            endDate: { $gte: new Date() }
        });

        if (!subscription) {
            return res.status(404).json({ success: false, message: "No active subscription found" });
        }

        res.json({
            success: true,
            data: {
                skippedMeals: subscription.skippedMeals || []
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch skipped meals" });
    }
};

/**
 * Get today's menu for subscribed customer
 * GET /api/customer/menu/today
 */
exports.getTodayMenu = async (req, res) => {
    try {
        const customerId = req.user._id;

        const activeSubscription = await Subscription.findOne({
            customer: customerId,
            status: "approved",
            endDate: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        }).populate('provider', 'fullName');

        if (!activeSubscription || !activeSubscription.provider) {
            logger.warn("Today Menu Fetch Failed: No Active Subscription or Provider", { customerId });
            return res.status(404).json({ success: false, message: "No active subscription found or provider is missing" });
        }

        const providerId = activeSubscription.provider._id;

        // Use a more robust date calculation (Targeting the calendar date)
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        const todayMenus = await Menu.find({
            provider: providerId,
            menuDate: { $gte: startOfToday, $lte: endOfToday },
            isPublished: true,
            // Allowing Pending for development/user-test visibility
            approvalStatus: { $in: ["Approved", "Pending"] }
        });

        console.log(`[MENU_DEBUG] Customer: ${customerId}, Provider: ${providerId}`);
        console.log(`[MENU_DEBUG] Date Range: ${startOfToday.toISOString()} to ${endOfToday.toISOString()}`);
        console.log(`[MENU_DEBUG] Found Menus: ${todayMenus.length}`);


        const lunchMenu = todayMenus.find(m => m.mealType === 'lunch');
        const dinnerMenu = todayMenus.find(m => m.mealType === 'dinner');

        const formatMenu = (menu) => {
            if (!menu) return null;

            const itemsString = Array.isArray(menu.items) && menu.items.length > 0
                ? menu.items.map(i => i.name).join(', ')
                : menu.description || 'Standard meal';

            return {
                name: menu.menuLabel || menu.name,
                items: itemsString,
                itemsArray: menu.items || [],
                calories: menu.calories || 0,
                price: menu.price || 0,
                type: menu.type || "Veg",
                image: menu.image || null,
                emoji: menu.mealType === 'lunch' ? "🍛" : "🌙"
            };
        };

        res.json({
            success: true,
            data: {
                lunch: formatMenu(lunchMenu),
                dinner: formatMenu(dinnerMenu),
                providerName: activeSubscription.provider?.fullName || "Missing Provider",
                skippedMeals: activeSubscription.skippedMeals || []
            }
        });

    } catch (error) {
        logger.error("Error in getTodayMenu:", error);
        res.status(500).json({ success: false, message: "Failed to fetch today's menu" });
    }
};

/**
 * Get public menu for provider
 */
exports.getPublicMenu = async (req, res) => {
    try {
        const { providerId } = req.params;
        const today = new Date();
        const currentDay = today.getDay();
        const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;

        const monday = new Date(today);
        monday.setDate(today.getDate() + mondayOffset);
        monday.setHours(0, 0, 0, 0);

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);

        const weeklyMenus = await Menu.find({
            provider: providerId,
            menuDate: { $gte: monday, $lte: sunday },
            isPublished: true,
            approvalStatus: "Approved"
        }).sort({ menuDate: 1, mealType: 1 });

        // Unified formatter for Customer response
        const formatForCustomer = (menu) => {
            if (!menu) return null;
            const itemsString = Array.isArray(menu.items) && menu.items.length > 0
                ? menu.items.map(i => i.name).join(', ')
                : (menu.description || 'Standard meal');

            return {
                name: menu.menuLabel || menu.name,
                items: itemsString,
                calories: menu.calories || 650,
                price: menu.price || 0,
                type: menu.type || "Veg",
                image: menu.image || null,
                emoji: menu.mealType === 'lunch' ? "🍛" : "🌙"
            };
        };

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const menuData = {};
        days.forEach(day => {
            menuData[day] = { lunch: null, dinner: null, badges: [] };
        });

        weeklyMenus.forEach(menu => {
            const menuDate = new Date(menu.menuDate);
            const dayName = days[menuDate.getDay()];
            if (menuData[dayName]) {
                menuData[dayName][menu.mealType] = formatForCustomer(menu);

                // Use menuLabel as a badge if tags aren't present
                if (menu.tags && menu.tags.length > 0) {
                    menuData[dayName].badges = menu.tags;
                } else if (menu.menuLabel) {
                    menuData[dayName].badges = [menu.menuLabel];
                }
            }
        });

        res.json({ success: true, data: menuData });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch public menu" });
    }
};

// Helper function to calculate calories
const calculateCalories = (menu) => {
    if (menu.calories) return menu.calories;

    let calories = 0;
    if (menu.bread?.count) calories += menu.bread.count * 80;
    if (menu.rice) calories += 200;
    if (menu.dal) calories += 150;
    if (menu.mainDish) calories += 250;
    if (menu.sabjiDry) calories += 100;
    if (menu.accompaniments?.salad) calories += 30;
    if (menu.accompaniments?.raita) calories += 80;
    if (menu.accompaniments?.papad) calories += 50;
    return calories || 500;
};

// Helper function to get default images
const getDefaultImage = (mealType, foodType) => {
    const images = {
        lunch: { 'Veg': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=200' },
        dinner: { 'Veg': 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=200' }
    };
    return images[mealType]?.[foodType] || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=200';
};