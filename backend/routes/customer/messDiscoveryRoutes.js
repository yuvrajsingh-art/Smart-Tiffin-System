const express = require("express");
const router = express.Router();

const {
    findMessProviders,
    getMessDetails,
    getPopularLocations,
    getSearchSuggestions,
    getStandardPlans,
    getProviderPlans
} = require("../../controllers/customer/messDiscoveryController");

const { protect } = require("../../middleware/authMiddleware.middleware");

// GET /api/customer/messes/plans - Get standard plans (Public)
router.get("/plans", getStandardPlans);

// GET /api/discovery/plans/:providerId - Get provider specific plans
router.get("/plans/:providerId", getProviderPlans);

// GET /api/discovery/find-mess - Find messes
router.get("/find-mess", findMessProviders);

// GET /api/customer/messes/:id - Get mess details
router.get("/mess/:id", getMessDetails);

// Get popular locations
router.get("/popular-locations", getPopularLocations);

// Get search suggestions
router.get("/search-suggestions", getSearchSuggestions);

module.exports = router;