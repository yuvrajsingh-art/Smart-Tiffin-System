const express = require("express");
const router = express.Router();

const {
    getProfile,
    updateProfile,
    uploadProfileImage,
    getProfileSummary,
    deleteAccount,
    exportUserData,
    updateSecuritySettings
} = require("../../controllers/customer/profileController");

const { protect } = require("../../middleware/authMiddleware.middleware");

// Profile routes
router.get("/", protect, getProfile);
router.put("/update", protect, updateProfile);
router.post("/upload-image", protect, uploadProfileImage);
router.get("/summary", protect, getProfileSummary);
router.get("/export-data", protect, exportUserData);
router.post("/delete-account", protect, deleteAccount);
router.post("/security-settings", protect, updateSecuritySettings);

module.exports = router;