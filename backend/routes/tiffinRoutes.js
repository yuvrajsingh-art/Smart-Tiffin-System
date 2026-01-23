const express = require("express");
const router = express.Router();

const {createTiffinPlan,getAllTiffinPlans,getMyTiffinPlans,updateTiffinPlan,disableTiffinPlan  } = require("../controllers/tiffinController");
const { protect } = require("../middleware/authMiddleware.middleware");

// customer can view all active plans 
router.get("/", getAllTiffinPlans);

// provider routes
router.post("/create", protect, createTiffinPlan);
router.get("/my-plans", protect, getMyTiffinPlans);
router.put("/update/:id", protect, updateTiffinPlan);
router.put("/disable/:id", protect, disableTiffinPlan);

module.exports = router;