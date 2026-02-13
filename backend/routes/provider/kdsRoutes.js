const express = require("express");
const router = express.Router();
const { getKdsOrders, acceptOrder, markReady, markDispatched, markDelivered } = require("../../controllers/provider/kdsController");
const { protect } = require("../../middleware/authMiddleware.middleware");
const { isVerifiedProvider } = require("../../middlewares/isVerifiedProvider");

// Apply protection and verification to ALL KDS routes
router.use(protect);
router.use(isVerifiedProvider);

router.get("/kds-1", getKdsOrders);
router.put("/order/:id/accept", acceptOrder);
router.put("/order/:id/ready", markReady);
router.put("/order/:id/dispatched", markDispatched);
router.put("/order/:id/delivered", markDelivered);

module.exports = router;
