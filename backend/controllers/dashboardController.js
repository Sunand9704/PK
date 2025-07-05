const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private (admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get total revenue from delivered orders
    const totalRevenue = await Order.aggregate([
      { $match: { status: "delivered" } },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$price", "$quantity"] } },
        },
      },
    ]);

    // Get total orders count
    const totalOrders = await Order.countDocuments();

    // Get total users count
    const totalUsers = await User.countDocuments();

    // Get total products count
    const totalProducts = await Product.countDocuments();

    // Get delivered orders count
    const deliveredOrders = await Order.countDocuments({ status: "delivered" });

    // Get pending orders count
    const pendingOrders = await Order.countDocuments({ status: "pending" });

    // Get processing orders count
    const processingOrders = await Order.countDocuments({
      status: "processing",
    });

    // Get shipped orders count
    const shippedOrders = await Order.countDocuments({ status: "shipped" });

    // Get cancelled orders count
    const cancelledOrders = await Order.countDocuments({ status: "cancelled" });

    res.json({
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      totalOrders,
      totalUsers,
      totalProducts,
      orderStats: {
        delivered: deliveredOrders,
        pending: pendingOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        cancelled: cancelledOrders,
      },
    });
  } catch (error) {
    next(error);
  }
};
