const express = require("express");
const { body } = require("express-validator");
const {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
} = require("../controllers/authController");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const router = express.Router();

// Utility function to refresh Google access token
const refreshGoogleToken = async (refreshToken) => {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error refreshing Google token:", error);
    throw error;
  }
};

// Utility function to make authenticated Google API calls
const makeGoogleApiCall = async (accessToken, endpoint) => {
  try {
    const response = await fetch(`https://www.googleapis.com${endpoint}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Google API call failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error making Google API call:", error);
    throw error;
  }
};

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

// Google OAuth config (directly in code as requested)
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          // Try to find by email (in case user signed up with email before)
          const email =
            profile.emails && profile.emails[0] && profile.emails[0].value;
          user = await User.findOne({ email });
          if (user) {
            user.googleId = profile.id;
            user.googleAccessToken = accessToken;
            user.googleRefreshToken = refreshToken;
            await user.save();
          } else {
            // Create new user
            user = await User.create({
              firstName: profile.name.givenName || "Google",
              lastName: profile.name.familyName || "User",
              email,
              googleId: profile.id,
              googleAccessToken: accessToken,
              googleRefreshToken: refreshToken,
              password: Math.random().toString(36).slice(-8), // random password (not used)
            });
          }
        } else {
          // Update existing user's tokens
          user.googleAccessToken = accessToken;
          user.googleRefreshToken = refreshToken;
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Google Auth Route
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

// Google Auth Callback
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err) {
      console.error("Google OAuth Error:", err);
      return res
        .status(500)
        .json({ msg: "Server Error", error: err.message, stack: err.stack });
    }
    if (!user) {
      console.error("Google OAuth No User:", info);
      return res.status(401).json({ msg: "Unauthorized", info });
    }
    // Generate JWT and redirect or respond
    const token = generateToken(user._id);
    res.redirect(`http://localhost:8080?token=${token}`);
  })(req, res, next);
});

// @route   GET /api/auth/google/profile
// Get user's Google profile using stored access token
router.get("/google/profile", async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!user.googleAccessToken) {
      return res.status(400).json({ msg: "No Google access token found" });
    }

    // Try to get user profile from Google
    const profile = await makeGoogleApiCall(
      user.googleAccessToken,
      "/oauth2/v2/userinfo"
    );
    res.json({ profile });
  } catch (error) {
    console.error("Error fetching Google profile:", error);
    res
      .status(500)
      .json({ msg: "Error fetching Google profile", error: error.message });
  }
});

// @route   POST /api/auth/google/refresh
// Refresh Google access token
router.post("/google/refresh", async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!user.googleRefreshToken) {
      return res.status(400).json({ msg: "No Google refresh token found" });
    }

    // Refresh the access token
    const newAccessToken = await refreshGoogleToken(user.googleRefreshToken);

    // Update user's access token
    user.googleAccessToken = newAccessToken;
    await user.save();

    res.json({
      msg: "Token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res
      .status(500)
      .json({ msg: "Error refreshing token", error: error.message });
  }
});

// @route   GET /api/auth/google/calendar
// Example: Get user's Google Calendar events (requires calendar scope)
router.get("/google/calendar", async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!user.googleAccessToken) {
      return res.status(400).json({ msg: "No Google access token found" });
    }

    // Get calendar events (this is just an example - you'd need calendar scope)
    const calendar = await makeGoogleApiCall(
      user.googleAccessToken,
      "/calendar/v3/calendars/primary/events"
    );
    res.json({ calendar });
  } catch (error) {
    console.error("Error fetching Google calendar:", error);
    res
      .status(500)
      .json({ msg: "Error fetching Google calendar", error: error.message });
  }
});

module.exports = router;
