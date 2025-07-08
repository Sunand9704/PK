const Product = require("../models/Product");

// @desc    Get all categories (from products)
// @route   GET /api/categories
// @access  Public
exports.getAllCategories = async (req, res, next) => {
  try {
    // Get all unique categories from products
    const categories = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { name: "$_id", count: 1, _id: 0 } },
    ]);
    res.json({ categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Get categories with highest sold product images (from products)
// @route   GET /api/categories/with-top-products
// @access  Public
exports.getCategoriesWithTopProducts = async (req, res, next) => {
  try {
    // Get all unique categories from products
    const categories = await Product.distinct("category");
    // For each category, get the top-selling product
    const categoriesWithTopProducts = await Promise.all(
      categories.map(async (category) => {
        const topProduct = await Product.findOne({ category })
          .sort({ soldCount: -1 })
          .select("images soldCount name");
        return {
          name: category,
          image: topProduct?.images?.[0] || null,
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
