const User = require("../models/User");
const Admin = require("../models/Admin");
const { validationResult } = require("express-validator");
const generateToken = require("../utils/generateToken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { firstName, lastName, email, password, phone } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }
    user = new User({ firstName, lastName, email, password, phone });
    await user.save();

    // Create notification for new user registration
    try {
      const Notification = require("../models/Notification");
      await Notification.create({
        type: "user_registration",
        title: "New User Registration",
        message: `${firstName} ${lastName} registered a new account`,
        priority: "high",
        relatedId: user._id,
        relatedModel: "User",
      });
    } catch (error) {
      console.error("Error creating notification:", error);
    }

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

// Forgot Password: Send OTP
exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user =
      (await User.findOne({ email })) || (await Admin.findOne({ email }));
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOtp = otp;

    user.resetPasswordOtpExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();
    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "laptoptest7788@gmail.com",
        pass: "uqfiabjkiqudrgdw",
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP is: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 24px; border-radius: 8px; background: #f9f9f9; border: 1px solid #eee;">
          <h2 style="color: #222;">Password Reset Request</h2>
          <p style="font-size: 16px; color: #444;">We received a request to reset your password. Use the OTP below to proceed:</p>
          <div style="font-size: 32px; font-weight: bold; color: #4F46E5; letter-spacing: 4px; margin: 24px 0;">${otp}</div>
          <p style="font-size: 14px; color: #666;">This OTP is valid for 10 minutes. If you did not request a password reset, you can safely ignore this email.</p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #aaa;">Thank you,<br/>PK Trends Team</p>
        </div>
      `,
    });
    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    next(error);
  }
};

// Verify OTP
exports.verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    const user =
      (await User.findOne({ email })) || (await Admin.findOne({ email }));
    if (!user || !user.resetPasswordOtp || !user.resetPasswordOtpExpires) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request" });
    }
    if (user.resetPasswordOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    if (user.resetPasswordOtpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }
    res.json({ success: true, message: "OTP verified" });
  } catch (error) {
    next(error);
  }
};

// Reset Password
exports.resetPassword = async (req, res, next) => {
  const { email, otp, password } = req.body;
  try {
    const user =
      (await User.findOne({ email })) || (await Admin.findOne({ email }));
    if (!user || !user.resetPasswordOtp || !user.resetPasswordOtpExpires) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request" });
    }
    if (user.resetPasswordOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    if (user.resetPasswordOtpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }
    user.password = password;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    await user.save();
    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};
