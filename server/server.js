require("dotenv").config();

const express = require("express");
const cors = require("cors"); // Import CORS
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoute");
const friendRoutes = require("./routes/friendRoute");
const connectDb = require("./config/db");
const apiLimiter = require("./middlewares/apiLimiter");

const PORT = process.env.PORT || 3000;
const API_VERSION = "v1";

const app = express();

connectDb();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

// Limit the number of requests based on IP
app.use(apiLimiter);

// Static file serving for uploads
app.use("/uploads", express.static("uploads"));

// API Routes with versioning
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/user`, userRoutes);
app.use(`/api/${API_VERSION}/chat`, chatRoutes);
app.use(`/api/${API_VERSION}/friend`, friendRoutes);

// Start the server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
