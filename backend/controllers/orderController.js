const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { productId, price } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!productId || !price) {
      return res.status(400).json({
        msg: "Product ID and price are required",
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Create the order
    const order = new Order({
      productId,
      orderBy: userId,
      price,
    });

    await order.save();

    // Populate product details
    await order.populate("productId");

    res.status(201).json({
      msg: "Order created successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/user
// @access  Private
exports.getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ orderBy: userId })
      .populate("productId")
      .sort({ placedAt: -1 });

    res.json({ orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (admin only)
// @route   GET /api/orders
// @access  Private (admin)
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("productId")
      .populate("orderBy", "firstName lastName email")
      .sort({ placedAt: -1 });

    res.json({ orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:orderId
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(orderId)
      .populate("productId")
      .populate("orderBy", "firstName lastName email");

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Check if user is authorized to view this order
    if (order.orderBy.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Not authorized to view this order" });
    }

    res.json({ order });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (admin only)
// @route   PATCH /api/orders/:orderId/status
// @access  Private (admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ msg: "Status is required" });
    }

    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    order.status = status;
    await order.save();

    await order.populate("productId");
    await order.populate("orderBy", "firstName lastName email");

    res.json({
      msg: "Order status updated successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (user can cancel their own order)
// @route   PATCH /api/orders/:orderId/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // Check if user is authorized to cancel this order
    if (order.orderBy.toString() !== userId) {
      return res
        .status(403)
        .json({ msg: "Not authorized to cancel this order" });
    }

    // Check if order can be cancelled (only pending orders can be cancelled)
    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ msg: "Only pending orders can be cancelled" });
    }

    order.status = "cancelled";
    await order.save();

    await order.populate("productId");

    res.json({
      msg: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};
