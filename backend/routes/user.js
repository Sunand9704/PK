const express = require("express");
const {
  getUserProfile,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../controllers/userController");
const auth = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/user/profile
// @access  Private
router.get("/profile", auth, getUserProfile);

// @route   POST /api/user/wishlist
// @access  Private
router.post("/wishlist", auth, addToWishlist);

// @route   GET /api/user/wishlist
// @access  Private
router.get("/wishlist", auth, getWishlist);

// @route   DELETE /api/user/wishlist
// @access  Private
router.delete("/wishlist", auth, removeFromWishlist);

module.exports = router;
