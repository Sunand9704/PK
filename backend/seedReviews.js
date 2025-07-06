const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Review = require("./models/Review");
const Product = require("./models/Product");
const User = require("./models/User");

const reviews = [
  {
    userName: "David Miller",
    rating: 5,
    review:
      "Outstanding quality and perfect fit. The attention to detail is remarkable. This product exceeded all my expectations and I would highly recommend it to anyone looking for premium quality.",
  },
  {
    userName: "James Wilson",
    rating: 5,
    review:
      "Fast shipping and excellent customer service. Will definitely order again. The quality is top-notch and the fit is perfect.",
  },
  {
    userName: "Michael Brown",
    rating: 5,
    review:
      "Premium materials and craftsmanship. Worth every penny. The attention to detail is incredible and the customer service was exceptional.",
  },
  {
    userName: "Sarah Johnson",
    rating: 4,
    review: "Great product, good quality. Very satisfied with my purchase.",
  },
  {
    userName: "Robert Davis",
    rating: 5,
    review: "Excellent quality and fast delivery. Highly recommend!",
  },
  {
    userName: "Jennifer Smith",
    rating: 4,
    review: "Good product, meets expectations.",
  },
  {
    userName: "Christopher Lee",
    rating: 5,
    review:
      "Amazing quality and perfect fit. The materials are premium and the craftsmanship is outstanding. This is exactly what I was looking for.",
  },
  {
    userName: "Amanda White",
    rating: 5,
    review: "Perfect fit and excellent quality. Very happy with this purchase.",
  },
];

const seed = async () => {
  await connectDB();
  try {
    // Clear existing reviews
    await Review.deleteMany();

    // Get all products to assign reviews to
    const products = await Product.find();

    if (products.length === 0) {
      console.log("No products found. Please seed products first.");
      process.exit(1);
    }

    // Create a dummy user for reviews (or use existing user)
    let dummyUser = await User.findOne({ email: "dummy@example.com" });
    if (!dummyUser) {
      dummyUser = new User({
        firstName: "Dummy",
        lastName: "User",
        email: "dummy@example.com",
        password: "password123",
        username: "dummyuser",
      });
      await dummyUser.save();
    }

    // Create reviews and assign them to random products
    const reviewsWithProducts = reviews.map((review, index) => ({
      ...review,
      productId: products[index % products.length]._id,
      userId: dummyUser._id,
    }));

    await Review.insertMany(reviewsWithProducts);
    console.log("Database seeded with reviews!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
