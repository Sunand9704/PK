const express = require("express");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

// Public routes
router.get("/", categoryController.getAllCategories);
router.get(
  "/with-top-products",
  categoryController.getCategoriesWithTopProducts
);

module.exports = router;
