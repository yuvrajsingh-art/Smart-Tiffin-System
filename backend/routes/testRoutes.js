const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware.middleware");

const router = express.Router();

// Only logged in user
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Profile accessed",
    user: req.user,
  });
});

// Only admin
router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);

module.exports = router;
