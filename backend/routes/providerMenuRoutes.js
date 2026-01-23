const express = require("express");
const router = express.Router();

const { createOrUpdateMenu, getMyMenus, deleteMenu } = require("../controllers/providermenucontroller");

const { protect, authorizeRoles } = require("../middleware/authMiddleware.middleware");

router.post("/menu", protect, authorizeRoles("provider"), createOrUpdateMenu);

router.get("/menus", protect, authorizeRoles("provider"), getMyMenus);

router.delete("/menu/:id", protect, authorizeRoles("provider"), deleteMenu);

module.exports = router;
