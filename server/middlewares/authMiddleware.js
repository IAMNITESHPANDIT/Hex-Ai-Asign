const jwt = require("jsonwebtoken");

const { STATUS } = require("../utils/status");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res
      .status(STATUS.UNAUTHORIZED_REQUEST)
      .json({ message: "Access denied", status: STATUS.UNAUTHORIZED_REQUEST });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res
      .status(STATUS.UNAUTHORIZED_REQUEST)
      .json({ message: "Invalid token", status: STATUS.UNAUTHORIZED_REQUEST });
  }
};

module.exports = authMiddleware;
