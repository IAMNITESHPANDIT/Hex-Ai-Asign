const User = require("../models/User");

const { STATUS } = require("../utils/status");

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(STATUS.USER_NOT_FOUND_REQUEST).json({
        message: "User not found",
        status: STATUS.USER_NOT_FOUND_REQUEST,
      });
    }

    res.status(STATUS.SUCCESS_REQUEST).json({
      data: user,
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

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    // Validate input
    if (!username || !email) {
      return res.status(STATUS.BAD_REQUEST).json({
        message: "Username and email are required",
        status: STATUS.BAD_REQUEST,
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(STATUS.USER_NOT_FOUND_REQUEST).json({
        message: "User not found",
        status: STATUS.USER_NOT_FOUND_REQUEST,
      });
    }

    res.status(STATUS.SUCCESS_REQUEST).json({
      message: "Profile updated successfully",
      user,
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

// Upload Profile Picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    // Ensure a file has been uploaded
    if (!req.file) {
      return res.status(STATUS.BAD_REQUEST).json({
        message: "No file uploaded",
        status: STATUS.BAD_REQUEST,
      });
    }

    const profilePicturePath = `${process.env.SERVER_URL}/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: profilePicturePath },
      { new: true }
    );

    if (!user) {
      return res.status(STATUS.USER_NOT_FOUND_REQUEST).json({
        message: "User not found",
        status: STATUS.USER_NOT_FOUND_REQUEST,
      });
    }

    res.status(STATUS.SUCCESS_REQUEST).json({
      message: "Profile picture uploaded successfully",
      user,
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

exports.listUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const loggedInUser = await User.findById(req.user._id).select("friends");
    const friendsList = loggedInUser.friends;

    const users = await User.find({
      _id: { $nin: [...friendsList, req.user._id] },
    })
      .skip(skip)
      .limit(limit)
      .select("name email username profilePicture _id");

    const totalUsers = await User.countDocuments({
      _id: { $nin: [...friendsList, req.user._id] },
    });

    res.json({
      page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// track user activity
exports.trackUserActivity = async (req, res) => {
  try {
    const { userId, activity } = req.body;

    if (!userId || !activity) {
      return res.status(STATUS.BAD_REQUEST).json({
        message: "User ID and activity description are required",
        status: STATUS.BAD_REQUEST,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(STATUS.NOT_FOUND).json({
        message: "User not found",
        status: STATUS.NOT_FOUND,
      });
    }

    user.activityLogs.push({
      activity,
      date: new Date(),
    });

    await user.save();

    res.status(STATUS.SUCCESS_REQUEST).json({
      message: "Activity logged successfully",
      status: STATUS.SUCCESS_REQUEST,
    });
  } catch (error) {
    console.error("Error logging activity:", error);
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      message: "An error occurred while logging activity",
      error: error.message || "Internal server error",
      status: STATUS.INTERNAL_SERVER_ERROR,
    });
  }
};

exports.getUserActivityLogs = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(STATUS.BAD_REQUEST).json({
        message: "User ID is required",
        status: STATUS.BAD_REQUEST,
      });
    }

    const user = await User.findById(userId, "activityLogs");
    if (!user) {
      return res.status(STATUS.NOT_FOUND).json({
        message: "User not found",
        status: STATUS.NOT_FOUND,
      });
    }

    res.status(STATUS.SUCCESS_REQUEST).json({
      message: "Activity logs retrieved successfully",
      activityLogs: user.activityLogs,
      status: STATUS.SUCCESS_REQUEST,
    });
  } catch (error) {
    console.error("Error retrieving activity logs:", error);
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      message: "An error occurred while retrieving activity logs",
      error: error.message || "Internal server error",
      status: STATUS.INTERNAL_SERVER_ERROR,
    });
  }
};
