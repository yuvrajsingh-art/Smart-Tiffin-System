const express = require("express");
const router = express.Router();

const {
    getMyPlans,
    createPlan,
    updatePlan,
    deletePlan
} = require("../../controllers/provider/plan.controller");

const { protect } = require("../../middleware/authMiddleware.middleware");
const { isVerifiedProvider } = require("../../middlewares/isVerifiedProvider");

// /api/provider-plans

router.get("/", protect, isVerifiedProvider, getMyPlans);
router.post("/", protect, isVerifiedProvider, createPlan);
router.put("/:id", protect, isVerifiedProvider, updatePlan);
router.delete("/:id", protect, isVerifiedProvider, deletePlan);

module.exports = router;
