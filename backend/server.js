// server.js
const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const validateEnv = require("./config/validateEnv");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const errorHandler = require("./middleware/errorHandler");
const productRoutes = require("./routes/products");
const adminAuthRoutes = require("./routes/adminAuth");
const uploadRoutes = require("./routes/upload");
const adminProductsRoutes = require("./routes/adminProducts");
const categoriesRoute = require("./routes/categories");
const reviewRoutes = require("./routes/reviews");
const orderRoutes = require("./routes/orders");
const dashboardRoutes = require("./routes/dashboard");
const adminCouponsRoutes = require("./routes/adminCoupons");
const couponsRoutes = require("./routes/coupons");
const notificationRoutes = require("./routes/notifications");
const contactRoutes = require("./routes/contact");

// Load env vars
dotenv.config();

// Validate environment variables
validateEnv();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
//app.use(helmet());

// CORS configuration with origins from environment variables
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : [
      "http://localhost:8080", // React development server
      "http://localhost:8081",
      "http://localhost:3000", // Fallback for development
      "http://localhost:5173", // Vite development server
      // Add your production frontend URL here
  // "https://yourdomain.com",
  // "https://www.yourdomain.com",
    ];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoriesRoute);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin/products", adminProductsRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin/coupons", adminCouponsRoutes);
app.use("/api/coupons", couponsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/contact", contactRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
