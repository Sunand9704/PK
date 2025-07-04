const express = require("express");
const { body } = require("express-validator");
const adminProductController = require("../controllers/adminProductController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

// Admin-only product CRUD
router.post(
  "/",
  auth,admin,
  [
    body("name").notEmpty(),
    body("description").notEmpty(),
    body("price").isNumeric(),
    body("category").notEmpty(),
    body("images").isArray({ min: 1 }),
  ],
  adminProductController.createProduct
);
router.put(
  "/:id",
  auth,admin,
  [
    body("name").optional().notEmpty(),
    body("description").optional().notEmpty(),
    body("price").optional().isNumeric(),
    body("category").optional().notEmpty(),
    body("images").optional().isArray({ min: 1 }),
  ],
  adminProductController.updateProduct
);
router.delete("/:id", auth, admin, adminProductController.deleteProduct);

module.exports = router;
