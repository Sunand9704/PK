const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dxwcflceu",
  api_key: process.env.CLOUDINARY_API_KEY || "784244663461292",
  api_secret: process.env.CLOUDINARY_API_SECRET || "Xzrx-hgcxnzTnL8qaGBbisGIYHE",
});

module.exports = cloudinary;
