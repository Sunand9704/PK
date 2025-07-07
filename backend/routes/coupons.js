const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponController");
const auth = require("../middleware/auth");

// Apply a coupon (user)
router.post("/apply", auth, couponController.applyCoupon);

// Get all active, non-expired coupons (user)
router.get("/available", auth, couponController.getAvailableCoupons);

module.exports = router; 