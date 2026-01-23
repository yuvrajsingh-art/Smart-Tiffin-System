const express = require("express");
const router = express.Router();

const { upsertProviderProfile, getMyProviderProfile,toggleAvailability,getNearbyProviders,deleteProviderProfile} = require("../controllers/providerprofilecontroller");
 const { protect} = require("../middleware/authMiddleware.middleware");

router.post("/provider/profile", protect, upsertProviderProfile);
router.get("/provider/profile/me", protect, getMyProviderProfile);
router.patch("/provider/availability", protect, toggleAvailability);
router.get("/provider/nearby", getNearbyProviders);
router.delete("/provider/profile", protect, deleteProviderProfile);


module.exports = router;
