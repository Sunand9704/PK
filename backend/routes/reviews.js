const express = require("express");
const reviewController = require("../controllers/reviewController");
const auth = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/:productId", reviewController.getProductReviews);

// Private routes (require authentication)
router.post("/", auth, reviewController.addReview);
router.get("/:productId/user", auth, reviewController.getUserReview);
router.patch("/:reviewId", auth, reviewController.editReview);
router.delete("/:reviewId", auth, reviewController.deleteReview);

module.exports = router;
