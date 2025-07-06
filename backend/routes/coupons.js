const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponController");
const auth = require("../middleware/auth");

// Apply a coupon (user)
router.post("/apply", auth, couponController.applyCoupon);

module.exports = router; 