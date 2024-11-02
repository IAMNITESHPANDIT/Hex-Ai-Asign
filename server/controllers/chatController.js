const Chat = require("../models/Chat");
const User = require("../models/User");
const { STATUS } = require("../utils/status");
const { ObjectId } = require("mongoose").Types;

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    // Validate input
    if (!receiverId || !message) {
      return res.status(STATUS.BAD_REQUEST).json({
        message: "Receiver ID and message are required",
        status: STATUS.BAD_REQUEST,
      });
    }

    // Create new message
    const chatMessage = new Chat({
      sender: req.user._id,
      receiver: receiverId,
      message,
    });

    await chatMessage.save();

    // Log the activity for the sender
    const sender = await User.findById(req.user._id);
    sender.activityLogs.push({
      activity: `Sent message to user ${receiverId}`,
      date: new Date(),
    });
    await sender.save();

    res.status(STATUS.SUCCESS_REQUEST).json({
      message: "Message sent successfully",
      chatMessage,
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

// Get chat messages between two users
exports.getMessages = async (req, res) => {
  try {
    const { otherUserId, userId } = req.body;

    if (!otherUserId || !userId) {
      return res.status(STATUS.BAD_REQUEST).json({
        message: "Both user ID and other user ID are required",
        status: STATUS.BAD_REQUEST,
      });
    }

    const senderId = new ObjectId(userId);
    const receiverId = new ObjectId(otherUserId);

    const messages = await Chat.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ timestamp: 1 });

    const formattedMessages = messages.map((message) => ({
      ...message.toObject(),
      direction: message.sender.equals(senderId) ? "sent" : "received",
    }));

    res.status(STATUS.SUCCESS_REQUEST).json({
      message: "Messages retrieved successfully",
      messages: formattedMessages,
      status: STATUS.SUCCESS_REQUEST,
    });
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      message: "Server error",
      error: error.message || "An error occurred",
      status: STATUS.INTERNAL_SERVER_ERROR,
    });
  }
};
