const express = require("express");
const {
  getUserProfile,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  updateUserProfile,
  addAddress,
  editAddress,
  deleteAddress,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

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

// @route   PUT /api/user/profile
// @access  Private
router.put("/profile", auth, updateUserProfile);

// @route   POST /api/user/address
// @access  Private
router.post("/address", auth, addAddress);

// @route   PUT /api/user/address/:index
// @access  Private
router.put("/address/:index", auth, editAddress);

// @route   DELETE /api/user/address/:index
// @access  Private
router.delete("/address/:index", auth, deleteAddress);

// @route   GET /api/users
// @access  Private (admin)
router.get(
  "/users",
  // auth,
  // admin,
  require("../controllers/userController").getAllUsers
);

module.exports = router;
