const mongoose = require("mongoose");
const connectDB = require("./config/db");
const HeroCarousel = require("./models/HeroCarousel");

// Initial hero carousel slides data
const heroCarouselSlides = [
  {
    title: "Manalli Appedhi Yavadu Ra",
    customContent: "Manalli Appedhi Yavadu Ra",
    image:
      "https://res.cloudinary.com/dnbqgzh4t/image/upload/v1750787984/1401349_k7aefm.jpg",
    order: 1,
    isActive: true,
  },
  {
    title: "Premium Fashion Collection",
    description:
      "Crafted from the finest materials for unparalleled comfort and style",
    image:
      "https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=1920&h=800&fit=crop",
    order: 2,
    isActive: true,
  },
  {
    title: "Modern Gentleman Style",
    description:
      "Perfect fits for the modern gentleman. Elevate your everyday style",
    image:
      "https://www.fashioncronical.com/wp-content/uploads/2025/01/stylish-high-waisted-pants-for-men-in-2025.jpg",
    order: 3,
    isActive: true,
  },
];

const seedHeroCarousel = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    await HeroCarousel.deleteMany({});
    console.log("Cleared existing hero carousel data");

    // Insert new data
    const slides = await HeroCarousel.insertMany(heroCarouselSlides);
    console.log(`Seeded ${slides.length} hero carousel slides`);

    // Display the seeded data
    console.log("Seeded hero carousel slides:");
    slides.forEach((slide, index) => {
      console.log(
        `${index + 1}. ${slide.title} - Order: ${slide.order} - Active: ${slide.isActive}`
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding hero carousel:", error);
    process.exit(1);
  }
};

// Run the seed function
seedHeroCarousel();
