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

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: "*" || true, credentials: true }));
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
