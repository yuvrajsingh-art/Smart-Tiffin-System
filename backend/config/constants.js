/**
 * =============================================================================
 * APPLICATION CONSTANTS
 * =============================================================================
 * Centralized configuration for magic numbers and default values.
 * Usage: const { MEAL, CALORIES, IMAGES } = require('../config/constants');
 * =============================================================================
 */

// Meal Configuration
const MEAL = {
    // Cutoff times (24-hour format)
    CUTOFF_LUNCH: 10,      // 10:00 AM - Last time to skip/customize lunch
    CUTOFF_DINNER: 16,     // 4:00 PM - Last time to skip/customize dinner

    // Meal types
    TYPES: {
        LUNCH: 'lunch',
        DINNER: 'dinner',
        BOTH: 'Both'
    },

    // Default delivery times
    DEFAULT_LUNCH_TIME: '12:45 PM',
    DEFAULT_DINNER_TIME: '08:45 PM'
};

// Calorie Values (per serving)
const CALORIES = {
    BREAD: 80,        // Per roti/chapati
    RICE: 200,        // Per serving
    DAL: 150,         // Per serving
    MAIN_DISH: 250,   // Per serving
    SABJI_DRY: 100,   // Per serving
    SALAD: 30,        // Side
    RAITA: 80,        // Side
    PAPAD: 50,        // Side
    PICKLE: 10,       // Side
    DEFAULT: 500      // Fallback if nothing calculated
};

// Default Images (Unsplash)
const IMAGES = {
    MENU: {
        LUNCH_VEG: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=200',
        DINNER_VEG: 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=200',
        FALLBACK: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=200'
    },
    DELIVERY: {
        PARTNER: 'https://cdn-icons-png.flaticon.com/512/1995/1995493.png',
        RESTAURANT: 'https://cdn-icons-png.flaticon.com/512/3023/3023758.png'
    },
    AVATAR: {
        DEFAULT: 'https://api.dicebear.com/7.x/avataaars/svg?seed='
    }
};

// Default Map Coordinates (Fallback only)
const MAP = {
    // Default center (Indore, MP - can be changed per deployment)
    DEFAULT_CENTER: {
        lat: 22.7196,
        lng: 75.8577
    },
    // Default zoom levels
    ZOOM: {
        CITY: 12,
        DELIVERY: 15
    }
};

// Order Status Flow
const ORDER_STATUS = {
    FLOW: ['confirmed', 'cooking', 'prepared', 'out_for_delivery', 'delivered'],
    VALID: ['pending', 'confirmed', 'preparing', 'cooking', 'ready', 'packed', 'out_for_delivery', 'delivered', 'cancelled'],
    ETA: {
        confirmed: 45,
        cooking: 30,
        prepared: 20,
        out_for_delivery: 10
    }
};

// Wallet & Transactions
const WALLET = {
    MIN_TOPUP: 50,
    MAX_TOPUP: 50000,
    UTR_LENGTH: 12
};

// Pagination Defaults
const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 50
};

// Feedback/Review
const FEEDBACK = {
    MIN_RATING: 1,
    MAX_RATING: 5,
    BADGE_THRESHOLD: 4,  // Rating >= 4 earns badge
    TAGS: [
        'Fresh', 'Tasty', 'On Time', 'Great Portion',
        'Hot Food', 'Healthy', 'Good Packaging', 'Authentic',
        'Well Cooked', 'Good Value', 'Clean', 'Spicy'
    ]
};

// Loyalty Levels
const LOYALTY = {
    BRONZE: { min: 0, label: 'Bronze' },
    SILVER: { min: 2, label: 'Silver' },
    GOLD: { min: 5, label: 'Gold' }
};

module.exports = {
    MEAL,
    CALORIES,
    IMAGES,
    MAP,
    ORDER_STATUS,
    WALLET,
    PAGINATION,
    FEEDBACK,
    LOYALTY
};
