const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

module.exports = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, "secretToken");
   

    // Try to find user in both collections
    let user = await User.findById(decoded.id).select("-password");
    if (!user) {
      user = await Admin.findById(decoded.id).select("-password");
    }
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }
    req.user = user;
   

    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
