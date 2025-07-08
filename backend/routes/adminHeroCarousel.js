const express = require("express");
const heroCarouselController = require("../controllers/heroCarouselController");
const admin = require("../middleware/admin");

const router = express.Router();

// All routes require admin authentication
//router.use(admin);

// Admin routes
router.get("/", heroCarouselController.getAllSlides);
router.get("/:id", heroCarouselController.getSlideById);
router.post("/", heroCarouselController.createSlide);
router.put("/:id", heroCarouselController.updateSlide);
router.delete("/:id", heroCarouselController.deleteSlide);
router.patch("/:id/toggle", heroCarouselController.toggleSlideStatus);
router.put("/reorder", heroCarouselController.reorderSlides);

module.exports = router;
