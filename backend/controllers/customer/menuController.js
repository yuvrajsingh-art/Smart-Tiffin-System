const Menu = require("../../models/menu.model");
const User = require("../../models/user.model");
const Subscription = require("../../models/subscription.model");
const CustomerWallet = require("../../models/customerWallet.model");
const Transaction = require("../../models/transaction.model");
const { createNotification } = require("../../utils/notificationService");

// Get weekly menu for customer
exports.getWeeklyMenu = async (req, res) => {
    try {
        const customerId = req.user._id;

        // Check if customer has active subscription
        const activeSubscription = await Subscription.findOne({
            customer: customerId,
            status: "approved",
            endDate: { $gte: new Date() }
        }).populate('provider', 'fullName');

        if (!activeSubscription) {
            return res.status(404).json({
                success: false,
                message: 'No active subscription found'
            });
        }

        const providerId = activeSubscription.provider._id;

        // Get current week dates (Monday to Sunday)
        const today = new Date();
        const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // If Sunday, go back 6 days

        const monday = new Date(today);
        monday.setDate(today.getDate() + mondayOffset);
        monday.setHours(0, 0, 0, 0);

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);

        // Fetch weekly menu from database
        const weeklyMenus = await Menu.find({
            provider: providerId,
            menuDate: { $gte: monday, $lte: sunday },
            isPublished: true,
            approvalStatus: "Approved"
        }).sort({ menuDate: 1, mealType: 1 });

        // Format menu data for frontend
        const menuData = {};
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Initialize all days with default data
        days.forEach(day => {
            menuData[day] = {
                lunch: {
                    title: "Menu Not Available",
                    items: "Please check with provider",
                    cal: 0,
                    img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=200"
                },
                dinner: {
                    title: "Menu Not Available",
                    items: "Please check with provider",
                    cal: 0,
                    img: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=200"
                }
            };
        });

        // Fill with actual menu data
        weeklyMenus.forEach(menu => {
            const menuDate = new Date(menu.menuDate);
            const dayName = days[menuDate.getDay()];

            if (menuData[dayName]) {
                const menuItems = [];

                // Build menu items string
                if (menu.bread?.count && menu.bread?.type) {
                    menuItems.push(`${menu.bread.count} ${menu.bread.type}`);
                }
                if (menu.rice) menuItems.push(menu.rice);
                if (menu.dal) menuItems.push(menu.dal);
                if (menu.mainDish) menuItems.push(menu.mainDish);
                if (menu.sabjiDry) menuItems.push(menu.sabjiDry);

                // Add accompaniments
                const accompaniments = [];
                if (menu.accompaniments?.salad) accompaniments.push("Salad");
                if (menu.accompaniments?.pickle) accompaniments.push("Pickle");
                if (menu.accompaniments?.papad) accompaniments.push("Papad");
                if (menu.accompaniments?.raita) accompaniments.push("Raita");

                if (accompaniments.length > 0) {
                    menuItems.push(...accompaniments);
                }

                menuData[dayName][menu.mealType] = {
                    title: menu.name || menu.mainDish || "Special Thali",
                    items: menuItems.join(", ") || menu.description || "Delicious meal",
                    cal: calculateCalories(menu),
                    img: menu.image || getDefaultImage(menu.mealType, menu.type)
                };
            }
        });

        res.json({
            success: true,
            data: {
                menuData,
                providerName: activeSubscription.provider.fullName,
                subscriptionId: activeSubscription._id,
                skippedMeals: activeSubscription.skippedMeals || []
            }
        });

    } catch (error) {
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
            if (now.getHours() >= 10) {
                return res.status(400).json({
                    success: false,
                    message: "Cutoff time (10:00 AM) exceeded for today's meal. Cannot change status now."
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
            endDate: { $gte: new Date() }
        }).populate('provider', 'fullName');

        if (!activeSubscription) {
            return res.status(404).json({ success: false, message: "No active subscription found" });
        }

        const providerId = activeSubscription.provider._id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const todayMenus = await Menu.find({
            provider: providerId,
            menuDate: { $gte: today, $lt: tomorrow },
            isPublished: true,
            approvalStatus: "Approved"
        });

        const lunchMenu = todayMenus.find(m => m.mealType === 'lunch');
        const dinnerMenu = todayMenus.find(m => m.mealType === 'dinner');

        const formatMenu = (menu) => {
            if (!menu) return null;
            const items = [];
            if (menu.bread?.count) items.push(`${menu.bread.count} ${menu.bread.type}`);
            if (menu.rice) items.push(menu.rice);
            if (menu.dal) items.push(menu.dal);
            if (menu.mainDish) items.push(menu.mainDish);

            return {
                name: menu.name || menu.mainDish || "Special Thali",
                items: items.join(", "),
                emoji: menu.mealType === 'lunch' ? "🍛" : "🌙",
                calories: calculateCalories(menu),
                spiceLevel: menu.spiceLevel || "Medium",
                type: menu.type || "Veg"
            };
        };

        res.json({
            success: true,
            data: {
                lunch: formatMenu(lunchMenu),
                dinner: formatMenu(dinnerMenu),
                providerName: activeSubscription.provider.fullName,
                skippedMeals: activeSubscription.skippedMeals || []
            }
        });

    } catch (error) {
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

        const menuData = {};
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            menuData[day] = { lunch: "Menu Not Available", dinner: "Menu Not Available", badges: [] };
        });

        weeklyMenus.forEach(menu => {
            const menuDate = new Date(menu.menuDate);
            const dayName = days[menuDate.getDay()];
            if (menuData[dayName]) {
                const items = [];
                if (menu.mainDish) items.push(menu.mainDish);
                if (menu.sabjiDry) items.push(menu.sabjiDry);
                menuData[dayName][menu.mealType] = items.join(", ") || menu.name;
                if (menu.tags) menuData[dayName].badges = menu.tags;
            }
        });

        res.json({ success: true, data: menuData });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch public menu" });
    }
};

// Helper function to calculate calories
const calculateCalories = (menu) => {
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