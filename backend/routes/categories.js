const express = require("express");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

// Public route
router.get("/", categoryController.getAllCategories);

module.exports = router;
