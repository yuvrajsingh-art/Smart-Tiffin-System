const express = require("express");
const router = express.Router();
const bankController = require("../../controllers/bankController");
const { protect, customerOnly } = require("../../middleware/authMiddleware.middleware");

router.get("/details", protect, customerOnly, bankController.getBankDetails);
router.post("/reset", protect, customerOnly, bankController.resetBankBalance);

module.exports = router;
