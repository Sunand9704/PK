const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ["percentage", "fixed"], required: true },
  discountValue: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  maxDiscount: { type: Number }, // Only for percentage type
  expiryDate: { type: Date, required: true },
  usageLimit: { type: Number }, // Total times coupon can be used
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Coupon", couponSchema); 