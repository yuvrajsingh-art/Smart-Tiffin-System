const express = require("express");
const {addTiffin,getAllTiffins} = require("../controllers/tiffinController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware.middleware");

const router = express.Router();

// Provider add tiffin
router.post("/", protect,authorizeRoles("provider"),addTiffin);

// Customer & Admin view tiffins
router.get("/", protect, getAllTiffins);

module.exports = router;
