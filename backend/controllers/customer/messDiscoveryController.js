const ProviderProfile = require("../../models/providerProfile.model");
const StoreProfile = require("../../models/storeProfile.model");
const User = require("../../models/user.model");
const Review = require("../../models/review.model");
const Plan = require("../../models/plan.model");
const { sendSuccess, sendError } = require("../../utils/responseHelper");

/**
 * Get Standard Platform Plans
 * @route GET /api/customer/messes/plans
 */
exports.getStandardPlans = async (req, res) => {
    try {
        const plans = await Plan.find({ isActive: true, isStandard: true }).sort({ price: 1 });
        return sendSuccess(res, 200, "Standard plans retrieved", plans);
    } catch (error) {
        console.error("Get Standard Plans Error:", error.message);
        return sendError(res, 500, "Failed to fetch plans", error);
    }
};

// Find mess providers
exports.findMessProviders = async (req, res) => {
    try {
        const { location, searchTerm, filter } = req.query;

        // Simple query
        let query = { is_active: true };

        // Search by name or location
        if (searchTerm) {
            query.mess_name = { $regex: searchTerm, $options: 'i' };
        }

        if (location) {
            query['address.city'] = { $regex: location, $options: 'i' };
        }

        // Filter by type
        if (filter === 'Pure Veg') {
            query.cuisines = { $in: ['Jain', 'Vegan'] };
        } else if (filter === 'Budget') {
            query.monthlyPrice = { $lte: 3000 };
        } else if (filter === 'Premium') {
            query.monthlyPrice = { $gte: 4500 };
        }

        const providers = await StoreProfile.find(query).limit(20);

        // Format response
        const formattedProviders = providers.map(provider => ({
            id: provider._id,
            name: provider.mess_name,
            image: provider.store_image || "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2670&auto=format&fit=crop",
            distance: "Local",
            type: provider.cuisines.includes('Jain') || provider.cuisines.includes('Vegan') ? "Pure Veg" : "Veg & Non-Veg",
            priceRange: `₹${provider.weeklyPrice || 900}-₹${provider.monthlyPrice || 3500}`,
            rating: provider.rating || 0,
            reviews: provider.reviewCount || 0,
            description: provider.description || "",
            location: provider.address?.city || "",
            tags: provider.features || [],
            cuisines: provider.cuisines
        }));

        res.json({
            success: true,
            data: formattedProviders
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch providers'
        });
    }
};

// Get single mess details
exports.getMessDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const provider = await StoreProfile.findById(id);

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: 'Provider not found'
            });
        }

        // Format response
        const formattedProvider = {
            id: provider._id,
            providerId: provider.provider,
            name: provider.mess_name,
            image: provider.store_image || "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2670",
            banner: provider.store_image || "https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=2670",
            type: provider.cuisines.includes('Jain') || provider.cuisines.includes('Vegan') ? "Pure Veg" : "Veg & Non-Veg",
            rating: provider.rating || 0,
            reviews: provider.reviewCount || 0,
            address: `${provider.address?.street || ''}, ${provider.address?.city || ''}`,
            description: provider.description || "",
            features: provider.features || ["Verified Kitchen", "Hygiene Checked"],
            monthlyPrice: provider.monthlyPrice || 3500,
            weeklyPrice: provider.weeklyPrice || 900,
            timings: {
                lunch: `${provider.lunch_start} - ${provider.lunch_end}`,
                dinner: `${provider.dinner_start} - ${provider.dinner_end}`
            },
            cuisines: provider.cuisines
        };

        res.json({
            success: true,
            data: formattedProvider
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch mess details'
        });
    }
};

// Get popular locations
exports.getPopularLocations = async (req, res) => {
    try {
        // Aggregate unique cities from active store profiles
        const cities = await StoreProfile.distinct("address.city", { is_active: true });

        // Filter out empty cities and limit to 10
        const popularCities = cities.filter(city => city && city.trim() !== "").slice(0, 10);

        res.json({
            success: true,
            data: popularCities.length > 0 ? popularCities : ["Indore", "Pune", "Mumbai", "Delhi"] // Sensible defaults if DB empty
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch locations'
        });
    }
};

// Get search suggestions
exports.getSearchSuggestions = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.length < 2) {
            return res.json({ success: true, data: [] });
        }

        // Find matches in mess_name, description, or cuisines
        const suggestions = await StoreProfile.find({
            is_active: true,
            $or: [
                { mess_name: { $regex: query, $options: 'i' } },
                { cuisines: { $in: [new RegExp(query, 'i')] } },
                { "address.city": { $regex: query, $options: 'i' } }
            ]
        })
            .limit(5)
            .select('mess_name cuisines address.city');

        // Map to flat string array for simple suggestions
        const formattedSuggestions = suggestions.map(s => s.mess_name);

        res.json({
            success: true,
            data: [...new Set(formattedSuggestions)]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch suggestions'
        });
    }
};
