const express = require("express");

const { getMessages, sendMessage } = require("../controllers/chatController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, sendMessage);

router.post("/interaction", authMiddleware, getMessages);

module.exports = router;
