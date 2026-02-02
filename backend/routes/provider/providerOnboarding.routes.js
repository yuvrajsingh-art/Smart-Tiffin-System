const express = require("express");
const {
  saveIdentity,
  saveLegal,
  saveOperations,
  saveBanking
} = require("../../controllers/provider/providerOnboarding.controller");

const authMiddleware = require("../../middleware/authMiddleware.middleware");

const router = express.Router();

router.post("/identity", authMiddleware.protect, saveIdentity);
router.post("/legal", authMiddleware.protect, saveLegal);
router.post("/operations", authMiddleware.protect, saveOperations);
router.post("/banking", authMiddleware.protect, saveBanking);

module.exports = router;
