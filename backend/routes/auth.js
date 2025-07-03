const express = require("express");
const { body } = require("express-validator");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

// @route   POST /api/auth/register
router.post(
  "/register",
  [
    body("name", "Name is required").not().isEmpty(),
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password must be 6 or more characters").isLength({
      min: 6,
    }),
  ],
  registerUser
);

// @route   POST /api/auth/login
router.post(
  "/login",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  loginUser
);

module.exports = router;
