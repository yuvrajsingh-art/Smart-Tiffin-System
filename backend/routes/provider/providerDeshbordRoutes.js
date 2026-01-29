const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authMiddleware.middleware");

const {getProviderDashboard} = require("../../controllers/provider/providerDeshbordcontroller");

const {toggleKitchenStatus} = require("../../controllers/provider/providerStatus.controller");

router.get("/dashboard", auth.protect, getProviderDashboard);
router.patch("/kitchen-status", auth.protect, toggleKitchenStatus);

module.exports = router;
