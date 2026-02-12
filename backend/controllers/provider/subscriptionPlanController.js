const StoreProfile = require("../../models/storeProfile.model");

// Get provider's subscription plan
exports.getSubscriptionPlan = async (req, res) => {
    try {
        const storeProfile = await StoreProfile.findOne({ provider: req.user._id });

        if (!storeProfile) {
            return res.status(200).json({
                success: true,
                data: null
            });
        }

        const planData = {
            providerName: storeProfile.mess_name,
            kitchenName: storeProfile.mess_name,
            weeklyPrice: storeProfile.weeklyPrice,
            monthlyPrice: storeProfile.monthlyPrice,
            description: storeProfile.description,
            features: storeProfile.features || [],
            cuisines: storeProfile.cuisines || []
        };

        res.status(200).json({
            success: true,
            data: planData
        });
    } catch (error) {
        console.error("Error fetching subscription plan:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch subscription plan",
            error: error.message
        });
    }
};

// Create or update subscription plan
exports.createSubscriptionPlan = async (req, res) => {
    try {
        const { providerName, kitchenName, weeklyPrice, monthlyPrice, description, features, cuisines } = req.body;

        console.log("Creating plan for user:", req.user._id);
        console.log("Plan data:", { kitchenName, weeklyPrice, monthlyPrice });

        let storeProfile = await StoreProfile.findOne({ provider: req.user._id });

        if (storeProfile) {
            // Update existing plan
            storeProfile.mess_name = kitchenName;
            storeProfile.weeklyPrice = Number(weeklyPrice);
            storeProfile.monthlyPrice = Number(monthlyPrice);
            storeProfile.description = description;
            storeProfile.features = features;
            storeProfile.cuisines = cuisines;
            await storeProfile.save();
            console.log("Plan updated successfully");
        } else {
            // Create new plan
            storeProfile = await StoreProfile.create({
                provider: req.user._id,
                mess_name: kitchenName,
                contact_number: req.user.phone || "0000000000",
                weeklyPrice: Number(weeklyPrice),
                monthlyPrice: Number(monthlyPrice),
                description,
                features,
                cuisines
            });
            console.log("Plan created successfully");
        }

        const planData = {
            providerName,
            kitchenName: storeProfile.mess_name,
            weeklyPrice: storeProfile.weeklyPrice,
            monthlyPrice: storeProfile.monthlyPrice,
            description: storeProfile.description,
            features: storeProfile.features,
            cuisines: storeProfile.cuisines
        };

        res.status(200).json({
            success: true,
            message: "Subscription plan saved successfully",
            data: planData
        });
    } catch (error) {
        console.error("Error creating subscription plan:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create subscription plan",
            error: error.message
        });
    }
};
