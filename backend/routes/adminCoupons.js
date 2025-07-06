const express = require("express");
const router = express.Router();
const adminCouponController = require("../controllers/adminCouponController");
const auth = require("../middleware/auth");
// Optionally add admin middleware if needed

// Create a coupon
router.post("/", auth, adminCouponController.createCoupon);
// Update a coupon
router.patch("/:id", auth, adminCouponController.updateCoupon);
// Delete a coupon
router.delete("/:id", auth, adminCouponController.deleteCoupon);
// List all coupons
router.get("/", auth, adminCouponController.listCoupons);

module.exports = router; 