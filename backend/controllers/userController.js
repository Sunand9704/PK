const User = require("../models/User");

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/user/wishlist
// @access  Private
exports.addToWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ msg: "Product ID is required" });
    }
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user wishlist
// @route   GET /api/user/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/user/wishlist
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ msg: "Product ID is required" });
    }
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private (admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    console.log("Fetching all users...");
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
exports.updateUserProfile = async (req, res, next) => {
  try {
    const { phone, dateOfBirth, gender, avatar } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (phone !== undefined) user.phone = phone;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (gender !== undefined) user.gender = gender;
    if (avatar !== undefined) user.avatar = avatar;
    await user.save();
    res.json({ msg: "Profile updated successfully", user: {
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      avatar: user.avatar,
      firstName: user.firstName,
      lastName: user.lastName,
    }});
  } catch (error) {
    next(error);
  }
};

// @desc    Add new address to addressBook
// @route   POST /api/user/address
// @access  Private
exports.addAddress = async (req, res, next) => {
  try {
    const { label, street, city, state, zip, country } = req.body;
    if (!street || !city || !country) {
      return res.status(400).json({ msg: "Street, city, and country are required" });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const newAddress = { label, street, city, state, zip, country };
    user.addressBook.push(newAddress);
    await user.save();
    res.json({ msg: "Address added", addressBook: user.addressBook });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit an address in addressBook
// @route   PUT /api/user/address/:index
// @access  Private
exports.editAddress = async (req, res, next) => {
  try {
    const { index } = req.params;
    const { label, street, city, state, zip, country } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (!user.addressBook || !user.addressBook[index]) {
      return res.status(404).json({ msg: "Address not found" });
    }
    if (label !== undefined) user.addressBook[index].label = label;
    if (street !== undefined) user.addressBook[index].street = street;
    if (city !== undefined) user.addressBook[index].city = city;
    if (state !== undefined) user.addressBook[index].state = state;
    if (zip !== undefined) user.addressBook[index].zip = zip;
    if (country !== undefined) user.addressBook[index].country = country;
    await user.save();
    res.json({ msg: "Address updated", addressBook: user.addressBook });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an address from addressBook
// @route   DELETE /api/user/address/:index
// @access  Private
exports.deleteAddress = async (req, res, next) => {
  try {
    const { index } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (!user.addressBook || !user.addressBook[index]) {
      return res.status(404).json({ msg: "Address not found" });
    }
    user.addressBook.splice(index, 1);
    await user.save();
    res.json({ msg: "Address deleted", addressBook: user.addressBook });
  } catch (error) {
    next(error);
  }
};
