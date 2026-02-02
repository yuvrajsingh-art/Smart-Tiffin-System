const express = require("express");
const router = express.Router();

const {
    getProfile,
    updateProfile,
    uploadProfileImage,
    getProfileSummary,
    deleteAccount
} = require("../../controllers/customer/profileController");

const { protect } = require("../../middleware/authMiddleware.middleware");

// Profile routes
router.get("/", protect, getProfile);
router.put("/update", protect, updateProfile);
router.put("/upload-image", protect, uploadProfileImage);
router.get("/summary", protect, getProfileSummary);
router.delete("/delete", protect, deleteAccount);

module.exports = router;