const Category = require("../models/Category");
const Product = require("../models/Product");

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json({ categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Get categories with highest sold product images
// @route   GET /api/categories/with-top-products
// @access  Public
exports.getCategoriesWithTopProducts = async (req, res, next) => {
  try {
    const categories = await Category.find();

    // Get the highest sold product for each category
    const categoriesWithTopProducts = await Promise.all(
      categories.map(async (category) => {
        const topProduct = await Product.findOne(
          { category: category.name.toLowerCase() },
          { images: 1, soldCount: 1, name: 1 }
        ).sort({ soldCount: -1 });

        return {
          id: category.id,
          name: category.name,
          description: category.description,
          image: topProduct?.images?.[0] || category.image, // Use top product image or fallback to category image
          topProductName: topProduct?.name || null,
          soldCount: topProduct?.soldCount || 0,
        };
      })
    );

    res.json({ categories: categoriesWithTopProducts });
  } catch (error) {
    next(error);
  }
};
