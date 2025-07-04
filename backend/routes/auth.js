const express = require("express");
const { body } = require("express-validator");
const { registerUser, loginUser, forgotPassword, verifyOtp, resetPassword } = require("../controllers/authController");

const router = express.Router();

// @route   POST /api/auth/register
router.post(
  "/register",
  [
    body("firstName", "First name is required").not().isEmpty(),
    body("lastName", "Last name is required").not().isEmpty(),
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

// @route   POST /api/auth/forgot-password
router.post("/forgot-password", forgotPassword);
// @route   POST /api/auth/verify-otp
router.post("/verify-otp", verifyOtp);
// @route   POST /api/auth/reset-password
router.post("/reset-password", resetPassword);

module.exports = router;
