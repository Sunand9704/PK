const express = require("express");
const heroCarouselController = require("../controllers/heroCarouselController");

const router = express.Router();

// Public routes
router.get("/", heroCarouselController.getActiveSlides);

module.exports = router;
