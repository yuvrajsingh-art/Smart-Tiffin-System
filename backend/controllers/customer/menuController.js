const { Menu } = require("../../models/menu.model");
const User = require("../../models/user.model");
const Subscription = require("../../models/subscription.model");

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
                subscriptionId: activeSubscription._id
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch weekly menu'
        });
    }
};

// Get today's menu only
exports.getTodayMenu = async (req, res) => {
    try {
        const customerId = req.user._id;
        
        // Check active subscription
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
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Get today's menu
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
            if (menu.bread?.count && menu.bread?.type) {
                items.push(`${menu.bread.count} ${menu.bread.type}`);
            }
            if (menu.rice) items.push(menu.rice);
            if (menu.dal) items.push(menu.dal);
            if (menu.mainDish) items.push(menu.mainDish);
            
            return {
                name: menu.name || menu.mainDish || "Special Thali",
                items: items.join(", ") || menu.description || "Delicious meal",
                emoji: menu.mealType === 'lunch' ? "🍛" : "🌙",
                provider: activeSubscription.provider.fullName,
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
                providerName: activeSubscription.provider.fullName
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch today menu'
        });
    }
};

// Helper function to calculate calories
const calculateCalories = (menu) => {
    let calories = 0;
    
    // Base calories for different components
    if (menu.bread?.count) calories += menu.bread.count * 80; // 80 cal per roti
    if (menu.rice) calories += 200; // Base rice calories
    if (menu.dal) calories += 150; // Dal calories
    if (menu.mainDish) calories += 250; // Main dish calories
    if (menu.sabjiDry) calories += 100; // Dry sabji calories
    
    // Add accompaniment calories
    if (menu.accompaniments?.salad) calories += 30;
    if (menu.accompaniments?.raita) calories += 80;
    if (menu.accompaniments?.papad) calories += 50;
    
    return calories || 500; // Default 500 if no calculation
};

// Helper function to get default images
const getDefaultImage = (mealType, foodType) => {
    const images = {
        lunch: {
            'Veg': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=200',
            'Non-Veg': 'https://images.unsplash.com/photo-1585937421612-70a008356f36?q=80&w=200',
            'Egg': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=200'
        },
        dinner: {
            'Veg': 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=200',
            'Non-Veg': 'https://images.unsplash.com/photo-1606491956091-76c9efdd336f?q=80&w=200',
            'Egg': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=200'
        }
    };
    
    return images[mealType]?.[foodType] || images[mealType]?.['Veg'] || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=200';
};