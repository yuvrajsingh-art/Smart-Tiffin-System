const express = require("express");
const router = express.Router();

const {
    findMessProviders,
    getPopularLocations,
    getSearchSuggestions
} = require("../../controllers/customer/messDiscoveryController");

const { protect } = require("../../middleware/authMiddleware.middleware");

// Find mess providers with filters and location
router.get("/find-mess", findMessProviders);

// Get popular locations
router.get("/popular-locations", getPopularLocations);

// Get search suggestions
router.get("/search-suggestions", getSearchSuggestions);

module.exports = router;