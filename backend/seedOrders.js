const mongoose = require("mongoose");
const Order = require("./models/Order");

async function seedOrder() {
  await mongoose.connect("mongodb://localhost:27017/PK", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  const orderData = {
    _id: new mongoose.Types.ObjectId("686aa92096d9292d6515160d"),
    productId: new mongoose.Types.ObjectId("686a7aa6772cada0d4f977a0"),
    orderBy: new mongoose.Types.ObjectId("68681cf82940a8f31afbe852"),
    price: 95,
    discount: 0,
    finalPrice: 95,
    couponCode: "",
    quantity: 1,
    shippingAddress: {
      name: "Hosanna King",
      address: "Vadepate",
      city: "Rajhmundry",
      state: "Andhra Pradesh",
      zip: "533125",
      country: "India",
      email: "freefirefacts000@gmail.com",
      phone: "09398334119",
    },
    paymentMethod: "cod",
    notes: "",
    status: "delivered",
    placedAt: new Date("2025-07-04T12:00:00.000Z"),
    orderId: "ORD-1751820576128-371",
    createdAt: new Date("2025-07-04T12:00:00.000Z"),
    updatedAt: new Date("2025-07-04T12:00:00.000Z"),
  };

  // Remove if already exists
  await Order.deleteOne({ _id: orderData._id });
  await Order.create(orderData);
  console.log("Seeded order with delivered date 3 days ago.");
  await mongoose.disconnect();
}

seedOrder().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});
