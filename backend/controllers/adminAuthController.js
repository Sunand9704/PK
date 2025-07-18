const Admin = require("../models/Admin");
const { validationResult } = require("express-validator");
const generateToken = require("../utils/generateToken");

// @desc    Register new admin
// @route   POST /api/admin/register
// @access  Public (should xxbe restricted in production)
exports.registerAdmin = async (req, res, next) => {
  // const errors = validationxResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }
  const { name, email, password } = req.body;
  
  try {
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists." });
    }
    admin = new Admin({ name, email, password });
    await admin.save();
    const token = generateToken(admin._id);
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
exports.loginAdmin = async (req, res, next) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }
  const { email, password } = req.body;
  
  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ success: false, message: "Invalid email." });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password." });
    }

    const token = generateToken(admin._id);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};
