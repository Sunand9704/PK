const express = require("express");
const { getUserProfile } = require("../controllers/userController");
const auth = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/user/profile
// @access  Private
router.get("/profile", auth, getUserProfile);

module.exports = router;
