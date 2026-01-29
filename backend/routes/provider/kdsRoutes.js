const express = require("express");
const router = express.Router();
const { getKdsOrders, acceptOrder, markReady, markDispatched } = require("../../controllers/provider/kdscontroller");
const {protect} = require("../../middleware/authMiddleware.middleware");

router.get("/kds-1", protect, getKdsOrders);
router.put("/order/:id/accept", protect,acceptOrder);
router.put("/order/:id/ready", protect, markReady);
router.put("/order/:id/dispatched", protect,markDispatched);

module.exports = router;
