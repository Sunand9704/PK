const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Category = require("./models/Category");

const categories = [
  {
    id: "shirts",
    name: "Shirts",
    image:
      "https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=600&h=400&fit=crop",
    description: "Premium shirts for every occasion",
  },
  {
    id: "pants",
    name: "Pants",
    image:
      "https://images.unsplash.com/photo-1696889450800-e94ec7a32206?q=80&w=848&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Comfortable and stylish pants",
  },
  {
    id: "accessories",
    name: "Accessories",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=400&fit=crop",
    description: "Complete your look with our accessories",
  },
];

const seed = async () => {
  await connectDB();
  try {
    // Clear existing categories
    await Category.deleteMany();

    // Insert new categories
    await Category.insertMany(categories);
    console.log("Database seeded with categories!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
