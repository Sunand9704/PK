module.exports = (err, req, res, next) => {
  res.status(500).json({
    msg: "Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
