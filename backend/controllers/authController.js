const User = require("../models/User");
const { validationResult } = require("express-validator");
const generateToken = require("../utils/generateToken");

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }
    user = new User({ name, email, password });
    await user.save();
    const token = generateToken(user._id);
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }
    const token = generateToken(user._id);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};
