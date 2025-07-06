const Coupon = require("../models/Coupon");

// Validate and apply a coupon code
exports.applyCoupon = async (req, res) => {
  try {
    const { code, orderValue } = req.body;
    const userId = req.user.id;
    const coupon = await Coupon.findOne({ code, active: true });
    if (!coupon) return res.status(400).json({ msg: "Invalid coupon code." });
    if (coupon.expiryDate < Date.now()) return res.status(400).json({ msg: "Coupon expired." });
    if (coupon.usageLimit && coupon.usedBy.length >= coupon.usageLimit) return res.status(400).json({ msg: "Coupon usage limit reached." });
    if (coupon.usedBy.includes(userId)) return res.status(400).json({ msg: "You have already used this coupon." });
    if (orderValue < coupon.minOrderValue) return res.status(400).json({ msg: `Order does not meet minimum value of ${coupon.minOrderValue}.` });
    // Calculate discount
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = orderValue * (coupon.discountValue / 100);
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.discountValue;
    }
    res.json({ discount, msg: "Coupon applied!", coupon });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}; 