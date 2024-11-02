const User = require("../models/User");
const { STATUS } = require("../utils/status");

exports.addFriend = async (req, res) => {
  try {
    const { friendId } = req.body;

    if (!friendId) {
      return res.status(400).json({
        message: "Friend ID is required",
        status: 400,
      });
    }

    const user = await User.findById(req.user._id);

    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      await user.save();
      res.status(STATUS.SUCCESS_REQUEST).json({
        message: "Friend added successfully",
        friends: user.friends,
        status: STATUS.SUCCESS_REQUEST,
      });
    } else {
      res.status(STATUS.BAD_REQUEST).json({
        message: "User is already your friend",
        status: STATUS.BAD_REQUEST,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Remove this function
exports.removeFriend = async (req, res) => {
  try {
    const { id: friendId } = req.body;

    const user = await User.findById(req.user._id);

    if (!user.friends.includes(friendId)) {
      res.status(STATUS.BAD_REQUEST).json({
        message: "This user is not your friend",
        status: STATUS.BAD_REQUEST,
      });
    } else {
      // Todo: Remove this function need to work on it
      user.friends = user.friends.filter((friend) => friend !== friendId);
      await user.save();
      res.status(STATUS.SUCCESS_REQUEST).json({
        message: "Friend removed successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get List of Friends with Name
exports.getFriendsList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "friends",
      "name username email"
    );

    if (!user) {
      return res.status(STATUS.USER_NOT_FOUND_REQUEST).json({
        message: "User not found",
        status: STATUS.USER_NOT_FOUND_REQUEST,
      });
    }

    res.status(STATUS.SUCCESS_REQUEST).json({
      message: "Friends list retrieved successfully",
      friends: user.friends,
      status: STATUS.SUCCESS_REQUEST,
    });
  } catch (error) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      message: "Server error",
      error: error.message,
      status: STATUS.INTERNAL_SERVER_ERROR,
    });
  }
};
