const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// Helper function to send order emails
const sendOrderEmail = async (
  userEmail,
  userName,
  orderId,
  subject,
  message
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: "laptoptest7788@gmail.com",
      to: userEmail,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border-radius: 8px; background: #f9f9f9; border: 1px solid #eee;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #4F46E5; margin: 0;">PK Trends</h2>
            <p style="color: #666; margin: 8px 0;">Your Fashion Destination</p>
          </div>
          
          <div style="background: white; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
            <h3 style="color: #222; margin-top: 0;">Hello ${userName},</h3>
            <p style="color: #444; line-height: 1.6;">${message}</p>
            
            <div style="background: #f8f9fa; padding: 16px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                <strong>Order ID:</strong> ${orderId}
              </p>
            </div>
          </div>
          
          <div style="text-align: center; color: #666; font-size: 12px;">
            <p>Thank you for choosing PK Trends!</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    // Remove: console.error("Error sending email:", error);
  }
};

// Helper function to update product soldCount
const updateProductSoldCount = async (productId, quantity, operation) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Product not found");
    }

    if (operation === "increase") {
      product.soldCount += quantity;
    } else if (operation === "decrease") {
      product.soldCount = Math.max(0, product.soldCount - quantity); // Prevent negative values
    }

    await product.save();
    return product;
  } catch (error) {
    throw error;
  }
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const {
      productId,
      price,
      quantity = 1,
      shippingAddress,
      paymentMethod = "cod",
      notes = "",
    } = req.body;
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

    // Create the order with additional fields
    const order = new Order({
      productId,
      orderBy: userId,
      price,
      quantity,
      shippingAddress,
      paymentMethod,
      notes,
      status: paymentMethod === "cod" ? "pending" : "processing",
      discount: req.body.discount || 0,
      finalPrice: req.body.finalPrice || price,
      couponCode: req.body.couponCode || "",
    });

    await order.save();

    // Create notification for new order
    try {
      const Notification = require("../models/Notification");
      await Notification.create({
        type: "new_order",
        title: "New Order Received",
        message: `Order #${order.orderId} placed by ${user.firstName} ${user.lastName}`,
        priority: "high",
        relatedId: order._id,
        relatedModel: "Order",
        metadata: {
          orderId: order.orderId,
          productName: product.name,
          amount: price * quantity,
        },
      });
    } catch (error) {
      console.error("Error creating notification:", error);
    }

    // Update product soldCount for successful orders (non-cod orders are considered successful immediately)
    if (paymentMethod !== "cod") {
      await updateProductSoldCount(productId, quantity, "increase");
    }

    // Populate product details
    await order.populate("productId");

    // Mark coupon as used if couponCode is provided
    if (req.body.couponCode) {
      const Coupon = require("../models/Coupon");
      await Coupon.findOneAndUpdate(
        { code: req.body.couponCode },
        { $addToSet: { usedBy: userId } }
      );
    }

    // Send order confirmation email
    const userName = `${user.firstName} ${user.lastName}`;
    const orderMessage = `
      Your order has been successfully placed! We're excited to process your order and get it ready for delivery.
      <br><br>
      <strong>Order Details:</strong><br>
      Product: ${product.name}<br>
      Quantity: ${quantity}<br>
      Total Amount: ₹${price * quantity}<br>
      Payment Method: ${paymentMethod.toUpperCase()}<br>
      Status: ${paymentMethod === "cod" ? "Pending" : "Processing"}
      <br><br>
      We'll keep you updated on your order status via email.
    `;

    await sendOrderEmail(
      user.email,
      userName,
      order.orderId,
      "Order Confirmed - PK Trends",
      orderMessage
    );

    res.status(201).json({
      msg: "Order created successfully",
      order,
    });
  } catch (error) {
    // Duplicate key error (e.g., unique constraint)
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ msg: "You have already placed an order for this product." });
    }
    // Mongoose validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({ msg: error.message });
    }
    // Other errors
    res.status(500).json({ msg: "Server error. Please try again." });
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

    const previousStatus = order.status;
    order.status = status;
    await order.save();

    // Create notification for order status update
    try {
      const Notification = require("../models/Notification");
      await Notification.create({
        type: "order_status",
        title: "Order Status Updated",
        message: `Order #${order.orderId} status changed to ${status}`,
        priority: "medium",
        relatedId: order._id,
        relatedModel: "Order",
        metadata: {
          orderId: order.orderId,
          previousStatus,
          newStatus: status,
        },
      });
    } catch (error) {
      console.error("Error creating notification:", error);
    }

    // Handle soldCount updates based on status changes
    if (previousStatus !== "cancelled" && status === "cancelled") {
      // Order is being cancelled - decrease soldCount
      await updateProductSoldCount(order.productId, order.quantity, "decrease");
    } else if (previousStatus === "pending" && status === "delivered") {
      // COD order is being delivered - increase soldCount
      if (order.paymentMethod === "cod") {
        await updateProductSoldCount(
          order.productId,
          order.quantity,
          "increase"
        );
      }
    }

    await order.populate("productId");
    await order.populate("orderBy", "firstName lastName email");

    // Send status update email
    const user = await User.findById(order.orderBy);
    if (user) {
      const userName = `${user.firstName} ${user.lastName}`;
      let statusMessage = "";
      let emailSubject = "";

      switch (status) {
        case "processing":
          emailSubject = "Order Processing - PK Trends";
          statusMessage = `
            Great news! Your order is now being processed. Our team is preparing your items for shipment.
            <br><br>
            <strong>Order Details:</strong><br>
            Product: ${order.productId.name}<br>
            Quantity: ${order.quantity}<br>
            Total Amount: ₹${order.price * order.quantity}
            <br><br>
            We'll notify you once your order is shipped.
          `;
          break;
        case "shipped":
          emailSubject = "Order Shipped - PK Trends";
          statusMessage = `
            Exciting news! Your order has been shipped and is on its way to you.
            <br><br>
            <strong>Order Details:</strong><br>
            Product: ${order.productId.name}<br>
            Quantity: ${order.quantity}<br>
            Total Amount: ₹${order.price * order.quantity}
            <br><br>
            You'll receive another notification when your order is delivered.
          `;
          break;
        case "delivered":
          emailSubject = "Order Delivered - PK Trends";
          statusMessage = `
            Your order has been successfully delivered! We hope you love your purchase.
            <br><br>
            <strong>Order Details:</strong><br>
            Product: ${order.productId.name}<br>
            Quantity: ${order.quantity}<br>
            Total Amount: ₹${order.price * order.quantity}
            <br><br>
            Thank you for choosing PK Trends! We'd love to hear your feedback.
          `;
          break;
        case "cancelled":
          emailSubject = "Order Cancelled - PK Trends";
          statusMessage = `
            Your order has been successfully cancelled as requested.
            <br><br>
            <strong>Order Details:</strong><br>
            Product: ${order.productId.name}<br>
            Quantity: ${order.quantity}<br>
            Total Amount: ₹${order.price * order.quantity}
            <br><br>
            If you have any questions about the cancellation, please contact our support team.
          `;
          break;
        default:
          emailSubject = "Order Status Updated - PK Trends";
          statusMessage = `
            Your order status has been updated to: ${status.charAt(0).toUpperCase() + status.slice(1)}
            <br><br>
            <strong>Order Details:</strong><br>
            Product: ${order.productId.name}<br>
            Quantity: ${order.quantity}<br>
            Total Amount: ₹${order.price * order.quantity}
          `;
      }

      await sendOrderEmail(
        user.email,
        userName,
        order.orderId,
        emailSubject,
        statusMessage
      );
    }

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

    const previousStatus = order.status;
    order.status = "cancelled";
    await order.save();

    // Update soldCount if this was a non-cod order that was already counted
    if (order.paymentMethod !== "cod") {
      await updateProductSoldCount(order.productId, order.quantity, "decrease");
    }

    await order.populate("productId");

    // Send cancellation email
    const user = await User.findById(userId);
    if (user) {
      const userName = `${user.firstName} ${user.lastName}`;
      const cancelMessage = `
        Your order has been successfully cancelled as requested.
        <br><br>
        <strong>Order Details:</strong><br>
        Product: ${order.productId.name}<br>
        Quantity: ${order.quantity}<br>
        Total Amount: ₹${order.price * order.quantity}
        <br><br>
        If you have any questions about the cancellation or would like to place a new order, please don't hesitate to contact our support team.
      `;

      await sendOrderEmail(
        user.email,
        userName,
        order.orderId,
        "Order Cancelled - PK Trends",
        cancelMessage
      );
    }

    res.json({
      msg: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order (address, phone, etc)
// @route   PATCH /api/orders/:orderId
// @access  Private
exports.updateOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const update = req.body;
    // Only allow updating shippingAddress and notes (for safety)
    const allowedFields = {};
    if (update.shippingAddress)
      allowedFields.shippingAddress = update.shippingAddress;
    if (update.notes) allowedFields.notes = update.notes;
    // You can add more allowed fields as needed
    const order = await Order.findByIdAndUpdate(orderId, allowedFields, {
      new: true,
    });
    if (!order) return res.status(404).json({ msg: "Order not found" });
    res.json({ order });
  } catch (error) {
    next(error);
  }
};
