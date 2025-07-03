// server.js
const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const errorHandler = require("./middleware/errorHandler");

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || true, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
