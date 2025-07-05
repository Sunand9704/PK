const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    shippingAddress: {
      name: String,
      address: String,
      city: String,
      state: String,
      zip: String,
      country: String,
      email: String,
      phone: String,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "razorpay", "card"],
      default: "cod",
    },
    notes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    placedAt: {
      type: Date,
      default: Date.now,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// Defensive: Ensure orderId is set before validation
orderSchema.pre("validate", function (next) {
  if (!this.orderId) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    this.orderId = `ORD-${timestamp}-${random}`;
  }
  next();
});

// Generate unique orderId before saving
orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    this.orderId = `ORD-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
