const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  
    expiresIn: "7d",
  });
};

module.exports = generateToken;
