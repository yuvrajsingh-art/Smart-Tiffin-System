const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware.middleware");
const { isVerifiedProvider } = require("../../middlewares/isVerifiedProvider");

const { getProviderDashboard } = require("../../controllers/provider/providerDeshbordcontroller");
const { toggleKitchenStatus } = require("../../controllers/provider/providerStatus.controller");

router.get("/dashboard", protect, isVerifiedProvider, getProviderDashboard);
router.patch("/kitchen-status", protect, isVerifiedProvider, toggleKitchenStatus);

module.exports = router;
