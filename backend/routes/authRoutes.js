/**
 * =============================================================================
 * AUTHENTICATION ROUTES
 * =============================================================================
 * Handles user authentication, registration, and profile management
 * Base URL: /api/auth
 * =============================================================================
 */

const express = require("express");
const router = express.Router();

// Import controller functions
const {
    loginUser,
    registerCustomer,
    providerCustomer,
    signOut,
    googleAuth,
    getProfile,
    forgotPassword,
    resetPassword,
    updatePassword
} = require("../controllers/authcontroller");

// Import authentication middleware
const { protect } = require("../middleware/authMiddleware.middleware");

// =============================================================================
// PUBLIC ROUTES (No authentication required)
// =============================================================================

// POST /api/auth/registerCustomer/customer - Register new customer
router.post("/registerCustomer/customer", registerCustomer);

// POST /api/auth/registerProvider/provider - Register new provider
router.post("/registerProvider/provider", providerCustomer);

// POST /api/auth/login - Login user (all roles)
router.post("/login", loginUser);

// POST /api/auth/logout - Logout user
router.post("/logout", signOut);

// POST /api/auth/google-auth - Google OAuth login
router.post("/google-auth", googleAuth);

// POST /api/auth/forgot-password - Generate OTP
router.post("/forgot-password", forgotPassword);

// POST /api/auth/reset-password - Verify OTP & Reset
router.post("/reset-password", resetPassword);

// POST /api/auth/update-password - Update password from profile
router.post("/update-password", protect, updatePassword);

// =============================================================================
// PROTECTED ROUTES (Authentication required)
// =============================================================================

// GET /api/auth/profile - Get current user profile
router.get("/profile", protect, getProfile);

module.exports = router;
