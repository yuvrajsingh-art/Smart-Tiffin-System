const express = require("express");
const router = express.Router();

const { getMenusByDate, getProviderMenus } = require("../controllers/customermenucontroller");

const { protect, authorizeRoles } = require("../middleware/authMiddleware.middleware");
router.get("/menus", protect, authorizeRoles("customer"), getMenusByDate);
router.get("/menus/provider/:providerId", protect, authorizeRoles("customer"), getProviderMenus);

module.exports = router;
