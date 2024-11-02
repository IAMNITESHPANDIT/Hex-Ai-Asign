const express = require("express");

const {
  register,
  login,
  enableTwoFactor,
} = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/enable-2fa", authMiddleware, enableTwoFactor);

module.exports = router;
