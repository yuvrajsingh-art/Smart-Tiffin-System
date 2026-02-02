const StoreProfile = require("../../models/storeProfile.model");

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
        }

        const providers = await StoreProfile.find(query).limit(20);

        // Format response
        const formattedProviders = providers.map(provider => ({
            id: provider._id,
            name: provider.mess_name,
            image: provider.store_image || "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2670&auto=format&fit=crop",
            distance: "0.5 km", // Mock distance
            type: provider.cuisines.includes('Jain') ? "Pure Veg" : "Veg & Non-Veg",
            priceRange: "₹2800", // Mock price
            rating: 4.8, // Mock rating
            reviews: 210, // Mock reviews
            description: provider.description || "Delicious homemade food",
            location: provider.address?.city || "Location",
            tags: ["Bestseller"],
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
            type: provider.cuisines.includes('Jain') ? "Pure Veg" : "Veg & Non-Veg",
            rating: 4.8, // Mock
            reviews: 120, // Mock
            address: `${provider.address?.street}, ${provider.address?.city}`,
            description: provider.description || "Authentic home-cooked meals.",
            features: ["Hygiene Verified", "Ghar Jaisa Taste"],
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
        const locations = [
            { location: "Pune", providerCount: 25, avgRating: 4.5 },
            { location: "Mumbai", providerCount: 18, avgRating: 4.3 },
            { location: "Delhi", providerCount: 15, avgRating: 4.6 }
        ];

        res.json({
            success: true,
            data: locations
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

        const suggestions = [
            { type: 'mess', value: 'Annapurna Mess' },
            { type: 'cuisine', value: 'North Indian' },
            { type: 'location', value: 'Pune' }
        ];

        res.json({
            success: true,
            data: suggestions
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch suggestions'
        });
    }
};