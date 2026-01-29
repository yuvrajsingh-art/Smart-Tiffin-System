const express = require("express");
const { loginUser, registerCustomer, providerCustomer, signOut, googleAuth, getProfile } = require("../controllers/authcontroller");


const { protect } = require("../middleware/authMiddleware.middleware");

const router = express.Router();

router.post("/registerCustomer/customer", registerCustomer);
router.post("/registerProvider/provider", providerCustomer)
router.post("/login", loginUser);
router.post("/logout", signOut);
router.post("/google-auth", googleAuth);

// Protected routes
router.get("/profile", protect, getProfile);

module.exports = router;
