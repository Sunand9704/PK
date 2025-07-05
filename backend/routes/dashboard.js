const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// All routes require authentication and admin privileges
router.use(auth);
router.use(admin);

// @route   GET /api/dashboard/stats
// @access  Private (admin)
router.get("/stats", dashboardController.getDashboardStats);

module.exports = router;
