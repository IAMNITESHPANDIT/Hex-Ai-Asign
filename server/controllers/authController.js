const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { STATUS } = require("../utils/status");
const speakeasy = require("speakeasy");

// Register User
exports.register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(STATUS.BAD_REQUEST).json({
        message: "All fields are required",
        status: STATUS.BAD_REQUEST,
      });
    }
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({
        message: "Username already taken",
        status: 400,
      });
    }

    // Check if the email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({
        message: "Email already registered",
        status: 400,
      });
    }

    const user = new User({ name, username, email, password });
    await user.save();

    res.status(STATUS.SUCCESS_REQUEST).json({
      message: "User registered successfully",
      status: STATUS.SUCCESS_REQUEST,
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(STATUS.BAD_REQUEST).json({
        message: "Email or username already exists",
        status: STATUS.BAD_REQUEST,
      });
    }

    res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      message: "Server error",
      error,
      status: STATUS.INTERNAL_SERVER_ERROR,
    });
  }
};

// Login User with 2FA
exports.login = async (req, res) => {
  try {
    const { email, password, token } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(STATUS.BAD_REQUEST).json({
        message: "Invalid email or password",
        status: STATUS.BAD_REQUEST,
      });
    }

    // If 2FA is enabled, verify token
    if (user.twoFactorSecret) {
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token,
      });

      if (!verified) {
        return res.status(STATUS.UNAUTHORIZED).json({
          message: "Invalid 2FA token",
          status: STATUS.UNAUTHORIZED,
        });
      }
    }

    // Generate JWT
    const authToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.lastLogin = new Date();
    user.activityLogs.push({ activity: "User logged in", date: new Date() });

    await user.save();

    res.status(STATUS.SUCCESS_REQUEST).json({
      message: "Login successful",
      token: authToken,
      userId: user._id,
      status: STATUS.SUCCESS_REQUEST,
    });
  } catch (error) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      message: "Server error",
      error,
      status: STATUS.INTERNAL_SERVER_ERROR,
    });
  }
};

// Enable 2FA for User
exports.enableTwoFactor = async (req, res) => {
  try {
    const secret = speakeasy.generateSecret();
    await User.findByIdAndUpdate(req.user._id, {
      twoFactorSecret: secret.base32,
    });

    res.status(STATUS.SUCCESS_REQUEST).json({
      message: "2FA enabled",
      secretUrl: secret.otpauth_url, //TODO : provide url
      status: STATUS.SUCCESS_REQUEST,
    });
  } catch (error) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      message: "Server error",
      error,
      status: STATUS.INTERNAL_SERVER_ERROR,
    });
  }
};
