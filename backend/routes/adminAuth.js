const express = require("express");
const { body } = require("express-validator");
const {
  registerAdmin,
  loginAdmin,
} = require("../controllers/adminAuthController");

const router = express.Router();

// @route   POST /api/admin/register
router.post(
  "/register",
  [
    body("name", "Name is required").not().isEmpty(),
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ],
  registerAdmin
);

// @route   POST /api/admin/login
router.post(
  "/login",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  loginAdmin
);

module.exports = router;
