const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");

const upload = require("../middlewares/uploadMiddleware");

const {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  listUsers,
  trackUserActivity,
  getUserActivityLogs,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", authMiddleware, listUsers);

router.get("/activity", authMiddleware, getUserActivityLogs);

router.get("/profile", authMiddleware, getUserProfile);

router.put("/profile", authMiddleware, updateUserProfile);

router.post("/profile", authMiddleware, trackUserActivity);

// Use the `upload.single` middleware for profile picture uploads
router.post(
  "/profile/upload",
  authMiddleware,
  upload.single("profilePicture"),
  uploadProfilePicture
);

module.exports = router;
