const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Product = require("./models/Product");

// Dummy data with soldCount values
const products = [
  {
    name: "Premium Cotton Shirt",
    price: 79,
    originalPrice: 99,
    category: "shirts",
    images: [
      "https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1564566350775-0a2c1b3e3763?w=800&h=800&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Navy"],
    description:
      "Crafted from premium 100% cotton, this shirt offers unparalleled comfort and style.",
    features: [
      "100% Premium Cotton",
      "Wrinkle Resistant",
      "Classic Fit",
      "Machine Washable",
    ],
    inStock: true,
    rating: 0,
    reviews: 0,
    soldCount: 95, // Highest sold count for shirts
  },
  {
    name: "Slim Fit Chinos",
    price: 89,
    category: "pants",
    images: [
      "https://images.unsplash.com/photo-1506629905607-e7ff3833d066?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=800&fit=crop",
    ],
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["Khaki", "Navy", "Black"],
    description:
      "Modern slim-fit chinos that combine comfort with contemporary style.",
    features: ["Slim Fit", "Stretch Fabric", "Side Pockets", "Versatile Style"],
    inStock: true,
    rating: 0,
    reviews: 0,
    soldCount: 120, // Highest sold count for pants
  },
  {
    name: "Leather Wallet",
    price: 45,
    category: "accessories",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop",
    ],
    sizes: ["One Size"],
    colors: ["Black", "Brown"],
    description: "Handcrafted genuine leather wallet with RFID protection.",
    features: [
      "Genuine Leather",
      "RFID Protection",
      "8 Card Slots",
      "Compact Design",
    ],
    inStock: true,
    rating: 0,
    reviews: 0,
    soldCount: 150, // Highest sold count for accessories
  },
  {
    name: "Oxford Dress Shirt",
    price: 95,
    category: "shirts",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=800&h=800&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Light Blue"],
    description:
      "Classic Oxford dress shirt perfect for professional settings.",
    features: [
      "Oxford Cotton",
      "Button-Down Collar",
      "Classic Fit",
      "French Seams",
    ],
    inStock: true,
    rating: 0,
    reviews: 0,
    soldCount: 75,
  },
  {
    name: "Classic Denim Jeans",
    price: 99,
    originalPrice: 120,
    category: "pants",
    images: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=800&fit=crop",
    ],
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["Blue", "Black"],
    description:
      "Timeless denim jeans with a comfortable fit and durable fabric.",
    features: [
      "100% Cotton",
      "Classic Fit",
      "Machine Washable",
      "Durable Stitching",
    ],
    inStock: true,
    rating: 0,
    reviews: 0,
    soldCount: 110,
  },
  {
    name: "Minimalist Leather Belt",
    price: 35,
    category: "accessories",
    images: [
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&h=800&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Brown", "Black"],
    description: "Elegant minimalist belt crafted from genuine leather.",
    features: [
      "Genuine Leather",
      "Adjustable",
      "Minimalist Buckle",
      "Handcrafted",
    ],
    inStock: true,
    rating: 0,
    reviews: 0,
    soldCount: 130,
  },
  {
    name: "Performance Polo Shirt",
    price: 65,
    originalPrice: 80,
    category: "shirts",
    images: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&h=800&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Red", "Navy", "White"],
    description:
      "Breathable polo shirt designed for all-day comfort and style.",
    features: [
      "Moisture Wicking",
      "Breathable Fabric",
      "Modern Fit",
      "Easy Care",
    ],
    inStock: true,
    rating: 0,
    reviews: 0,
    soldCount: 60,
  },
  {
    name: "Canvas Backpack",
    price: 59,
    category: "accessories",
    images: [
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1465101178521-c3a6088edb41?w=800&h=800&fit=crop",
    ],
    sizes: ["One Size"],
    colors: ["Olive", "Black"],
    description: "Durable canvas backpack for everyday use.",
    features: [
      "Durable Canvas",
      "Adjustable Straps",
      "Multiple Compartments",
      "Water Resistant",
    ],
    inStock: true,
    rating: 0,
    reviews: 0,
    soldCount: 140,
  },
];

const seed = async () => {
  await connectDB();
  try {
    // Clear existing products
    await Product.deleteMany();

    // Insert new products with soldCount
    await Product.insertMany(products);
    console.log("Database seeded with products including soldCount!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
