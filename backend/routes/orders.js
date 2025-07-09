const express = require("express");
const orderController = require("../controllers/orderController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// All routes require authentication
router.use(auth);

// User routes
router.post("/", orderController.createOrder);
router.get("/user", orderController.getUserOrders);
router.get("/:orderId", orderController.getOrderById);
router.patch("/:orderId", orderController.updateOrder);
router.patch("/:orderId/cancel", orderController.cancelOrder);

// Admin routes
router.get("/",  orderController.getAllOrders);
router.patch("/:orderId/status",  orderController.updateOrderStatus);

module.exports = router;
