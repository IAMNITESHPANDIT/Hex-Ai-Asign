const express = require("express");

const {
  addFriend,
  removeFriend,
  getFriendsList,
} = require("../controllers/friendController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getFriendsList);

router.post("/", authMiddleware, addFriend);

router.post("/delete", authMiddleware, removeFriend);

module.exports = router;
