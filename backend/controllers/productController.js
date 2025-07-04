const Product = require("../models/Product");

// @desc    Get all products with server-side search, pagination, sorting, and filters
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res, next) => {
  try {
    const {
      search = "",
      page = 1,
      limit = 10,
      sort = "createdAt_desc",
      category,
      inStock,
    } = req.query;

    // Build the query object
    const query = {
      $and: [
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { colors: { $regex: search, $options: "i" } },
          ],
        },
      ],
    };

    if (category) {
      query.$and.push({ category });
    }
    if (
      typeof inStock === "string" &&
      ["true", "false"].includes(inStock.toLowerCase())
    ) {
      query.$and.push({ inStock: inStock.toLowerCase() === "true" });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    let sortObj = {};
    if (sort) {
      const [field, order] = sort.split("_");
      sortObj[field] = order === "desc" ? -1 : 1;
    }
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortObj).skip(skip).limit(parseInt(limit)),
      Product.countDocuments(query),
    ]);
    res.json({ products, total });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};
