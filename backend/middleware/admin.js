module.exports = (req, res, next) => {
 

  console.log("req.user",req.user);
  console.log("req.user.role",req.user.role);
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ msg: "Admin access required" });
  }
};
