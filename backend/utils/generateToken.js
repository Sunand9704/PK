const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secretToken' , {
    expiresIn: "7d",
  });
};

module.exports = generateToken;
