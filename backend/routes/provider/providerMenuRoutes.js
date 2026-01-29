const express = require("express");
const router = express.Router();

const {createOrUpdateMenu,publishMenu,getTodayMenu} = require("../../controllers/provider/providerMenucontroller");

const authMiddleware = require("../../middleware/authMiddleware.middleware");

// Create menu (provider)
router.post("/",authMiddleware.protect,authMiddleware.authorizeRoles("provider"),createOrUpdateMenu);

// Publish menu & unlock dashboard
router.put("/publish/:id", authMiddleware.protect,authMiddleware.authorizeRoles("provider"),publishMenu);

// Get today's published menu
router.get("/today", getTodayMenu);

module.exports = router;
