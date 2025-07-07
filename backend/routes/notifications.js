const express = require("express");
const notificationController = require("../controllers/notificationController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// All routes require authentication and admin privileges
router.use(auth, admin);

// @route   GET /api/notifications
router.get("/", notificationController.getNotifications);

// @route   GET /api/notifications/unread-count
router.get("/unread-count", notificationController.getUnreadCount);

// @route   PATCH /api/notifications/:id/read
router.patch("/:id/read", notificationController.markAsRead);

// @route   PATCH /api/notifications/mark-all-read
router.patch("/mark-all-read", notificationController.markAllAsRead);

// @route   POST /api/notifications (for creating notifications)
router.post("/", notificationController.createNotification);

module.exports = router;
