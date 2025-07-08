const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Notification = require("./models/Notification");

const notifications = [
  {
    type: "user_registration",
    title: "New User Registration",
    message: "John Doe registered a new account",
    priority: "high",
    isRead: false,
  },
  {
    type: "new_order",
    title: "New Order Received",
    message: "Order #12345 placed by Sarah Wilson",
    priority: "high",
    isRead: false,
  },
  {
    type: "order_status",
    title: "Order Status Updated",
    message: "Order #12344 has been shipped",
    priority: "medium",
    isRead: true,
  },
  {
    type: "user_registration",
    title: "New User Registration",
    message: "Mike Johnson registered a new account",
    priority: "medium",
    isRead: true,
  },
  {
    type: "new_order",
    title: "New Order Received",
    message: "Order #12343 placed by Emily Brown",
    priority: "medium",
    isRead: true,
  },
  {
    type: "system_alert",
    title: "System Maintenance",
    message: "Scheduled maintenance completed successfully",
    priority: "low",
    isRead: true,
  },
  {
    type: "new_order",
    title: "New Order Received",
    message: "Order #12342 placed by David Lee",
    priority: "high",
    isRead: false,
  },
  {
    type: "user_registration",
    title: "New User Registration",
    message: "Lisa Chen registered a new account",
    priority: "medium",
    isRead: true,
  },
];

const seed = async () => {
  await connectDB();
  try {
    // Clear existing notifications
    await Notification.deleteMany();

    // Insert new notifications
    await Notification.insertMany(notifications);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
