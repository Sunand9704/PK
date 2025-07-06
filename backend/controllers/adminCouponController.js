const Coupon = require("../models/Coupon");

// Create a new coupon
exports.createCoupon = async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json({ msg: "Coupon created", coupon });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Update a coupon
exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ msg: "Coupon not found" });
    res.json({ msg: "Coupon updated", coupon });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// Delete a coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ msg: "Coupon not found" });
    res.json({ msg: "Coupon deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

// List all coupons
exports.listCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ coupons });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}; 