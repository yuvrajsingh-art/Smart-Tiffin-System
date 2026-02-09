const express = require("express");
const router = express.Router();

const { createMenu, updateMenu, publishMenu, getTodayMenu, getMenuHistory } = require("../../controllers/provider/providerMenucontroller");

const authMiddleware = require("../../middleware/authMiddleware.middleware");
const { isVerifiedProvider } = require("../../middlewares/isVerifiedProvider");

// Create menu (provider)
router.post("/", authMiddleware.protect, authMiddleware.authorizeRoles("provider"), isVerifiedProvider, createMenu);

// Update menu (provider)
router.put("/:id", authMiddleware.protect, authMiddleware.authorizeRoles("provider"), isVerifiedProvider, updateMenu);

// Get provider's own menus
router.get("/", authMiddleware.protect, authMiddleware.authorizeRoles("provider"), isVerifiedProvider, require("../../controllers/provider/providerMenucontroller").getProviderMenus);

// Publish menu & unlock dashboard
router.put("/publish/:id", authMiddleware.protect, authMiddleware.authorizeRoles("provider"), isVerifiedProvider, publishMenu);

// Get today's published menu
router.get("/today", authMiddleware.protect, getTodayMenu);

// Get menu history
router.get("/history", authMiddleware.protect, authMiddleware.authorizeRoles("provider"), getMenuHistory);

// Delete menu item
router.delete("/:id", authMiddleware.protect, async (req, res) => {
  try {
    const Menu = require("../../models/menu.model");
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Menu deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Toggle menu availability
router.patch("/:id/toggle", authMiddleware.protect, async (req, res) => {
  try {
    const Menu = require("../../models/menu.model");
    const menu = await Menu.findById(req.params.id);
    menu.isAvailable = !menu.isAvailable;
    await menu.save();
    res.json({ success: true, data: menu });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
