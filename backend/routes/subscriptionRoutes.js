const express = require("express");
const router = express.Router();

const {createSubscription,getMySubscriptions,pauseSubscription,resumeSubscription,cancelSubscription} = require("../controllers/subscriptioncontroller");
const { protect } = require("../middleware/authMiddleware.middleware");


router.post("/create", protect, createSubscription);
router.get("/my-subscriptions", protect, getMySubscriptions);
router.put("/pause/:id", protect, pauseSubscription);
router.put("/resume/:id", protect, resumeSubscription);
router.put("/cancel/:id", protect, cancelSubscription);

module.exports = router;